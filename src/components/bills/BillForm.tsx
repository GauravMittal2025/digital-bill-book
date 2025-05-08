import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Trash2, 
  Plus, 
  Save, 
  Printer, 
  Download, 
  ChevronLeft,
  GripVertical
} from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card, { CardContent, CardFooter, CardHeader } from '../ui/Card';
import { Bill, BillItem } from '../../types';
import { useBillContext } from '../../context/BillContext';
import { 
  calculateItemAmount, 
  calculateSubtotal, 
  calculateTax, 
  calculateTotal, 
  formatCurrency 
} from '../../utils/helpers';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BillItemRowProps {
  item: BillItem;
  index: number;
  onChange: (id: string, field: keyof BillItem, value: string | number) => void;
  onRemove: (id: string) => void;
}

const SortableBillItemRow: React.FC<BillItemRowProps> = ({ 
  item, 
  index, 
  onChange, 
  onRemove 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <tr ref={setNodeRef} style={style} className="group hover:bg-gray-50">
      <td className="w-8 px-2 py-3 text-gray-500">
        <div 
          className="cursor-grab opacity-50 group-hover:opacity-100" 
          {...attributes} 
          {...listeners}
        >
          <GripVertical size={16} />
        </div>
      </td>
      <td className="px-2 py-3">
        <Input
          value={item.description}
          onChange={e => onChange(item.id, 'description', e.target.value)}
          placeholder="Item description"
          fullWidth
        />
      </td>
      <td className="w-24 px-2 py-3">
        <Input
          type="number"
          value={item.quantity}
          onChange={e => onChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
          min="1"
          placeholder="Qty"
          fullWidth
        />
      </td>
      <td className="w-32 px-2 py-3">
        <Input
          type="number"
          value={item.price}
          onChange={e => onChange(item.id, 'price', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
          placeholder="Price"
          fullWidth
        />
      </td>
      <td className="w-32 px-2 py-3 text-right">
        <div className="font-medium">{formatCurrency(item.amount)}</div>
      </td>
      <td className="w-10 px-2 py-3 text-right">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

const BillForm: React.FC = () => {
  const { selectedBill, updateBill, selectBill } = useBillContext();
  const [bill, setBill] = useState<Bill | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  useEffect(() => {
    if (selectedBill) {
      setBill(selectedBill);
    }
  }, [selectedBill]);
  
  if (!bill) return null;
  
  const handleGoBack = () => {
    selectBill(null);
  };
  
  const handleInputChange = (field: keyof Bill, value: string | number) => {
    setBill(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };
  
  const handleStatusChange = (value: string) => {
    setBill(prev => {
      if (!prev) return prev;
      return { 
        ...prev, 
        status: value as 'draft' | 'pending' | 'paid' | 'overdue' 
      };
    });
  };
  
  const handleItemChange = (id: string, field: keyof BillItem, value: string | number) => {
    setBill(prev => {
      if (!prev) return prev;
      
      const newItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          // Recalculate amount if quantity or price changes
          if (field === 'quantity' || field === 'price') {
            updatedItem.amount = calculateItemAmount(updatedItem.quantity, updatedItem.price);
          }
          
          return updatedItem;
        }
        return item;
      });
      
      const subtotal = calculateSubtotal(newItems);
      const tax = calculateTax(subtotal);
      const total = calculateTotal(subtotal, tax);
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total
      };
    });
  };
  
  const handleAddItem = () => {
    setBill(prev => {
      if (!prev) return prev;
      
      const newItem: BillItem = {
        id: uuidv4(),
        description: '',
        quantity: 1,
        price: 0,
        amount: 0
      };
      
      return {
        ...prev,
        items: [...prev.items, newItem]
      };
    });
  };
  
  const handleRemoveItem = (id: string) => {
    setBill(prev => {
      if (!prev) return prev;
      
      const newItems = prev.items.filter(item => item.id !== id);
      
      // Prevent removing all items
      if (newItems.length === 0) {
        return prev;
      }
      
      const subtotal = calculateSubtotal(newItems);
      const tax = calculateTax(subtotal);
      const total = calculateTotal(subtotal, tax);
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total
      };
    });
  };
  
  const handleSave = () => {
    if (bill) {
      updateBill(bill);
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setBill(prev => {
        if (!prev) return prev;
        
        const oldIndex = prev.items.findIndex(item => item.id === active.id);
        const newIndex = prev.items.findIndex(item => item.id === over.id);
        
        return {
          ...prev,
          items: arrayMove(prev.items, oldIndex, newIndex)
        };
      });
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            icon={<ChevronLeft size={16} />}
            onClick={handleGoBack}
          >
            Back to Bills
          </Button>
          <h1 className="ml-4 text-2xl font-bold text-gray-900">
            {bill.billNumber}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer size={16} />}
          >
            Print
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={16} />}
          >
            Export
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Save size={16} />}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bill details */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Bill Details</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Customer Name"
                      value={bill.customerName}
                      onChange={e => handleInputChange('customerName', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <Input
                      label="Customer Email"
                      type="email"
                      value={bill.customerEmail}
                      onChange={e => handleInputChange('customerEmail', e.target.value)}
                      fullWidth
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="Customer Phone"
                      value={bill.customerPhone}
                      onChange={e => handleInputChange('customerPhone', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <Input
                      label="Bill Number"
                      value={bill.billNumber}
                      onChange={e => handleInputChange('billNumber', e.target.value)}
                      fullWidth
                    />
                  </div>
                </div>
                
                <div>
                  <Input
                    label="Billing Address"
                    value={bill.billingAddress}
                    onChange={e => handleInputChange('billingAddress', e.target.value)}
                    fullWidth
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="Bill Date"
                      type="date"
                      value={bill.date}
                      onChange={e => handleInputChange('date', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <Input
                      label="Due Date"
                      type="date"
                      value={bill.dueDate}
                      onChange={e => handleInputChange('dueDate', e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <Select
                      label="Status"
                      value={bill.status}
                      onChange={handleStatusChange}
                      options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'paid', label: 'Paid' },
                        { value: 'overdue', label: 'Overdue' }
                      ]}
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bill summary */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Bill Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(bill.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-medium">{formatCurrency(bill.tax)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="text-lg font-medium">Total:</span>
                  <span className="text-lg font-bold">{formatCurrency(bill.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Bill items */}
        <div className="md:col-span-12">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Bill Items</h2>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="w-8"></th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase px-2 py-3">Description</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase px-2 py-3">Qty</th>
                      <th className="text-left text-xs font-medium text-gray-500 uppercase px-2 py-3">Price</th>
                      <th className="text-right text-xs font-medium text-gray-500 uppercase px-2 py-3">Amount</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={bill.items.map(item => item.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {bill.items.map((item, index) => (
                          <SortableBillItemRow
                            key={item.id}
                            item={item}
                            index={index}
                            onChange={handleItemChange}
                            onRemove={handleRemoveItem}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                icon={<Plus size={16} />}
                onClick={handleAddItem}
              >
                Add Item
              </Button>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {bill.items.length} item{bill.items.length !== 1 ? 's' : ''}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Notes */}
        <div className="md:col-span-12">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium">Notes</h2>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-32 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={bill.notes}
                onChange={e => handleInputChange('notes', e.target.value)}
                placeholder="Add notes or payment instructions..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BillForm;