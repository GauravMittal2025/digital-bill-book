import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import BillItem from './BillItem';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Card, { CardContent, CardHeader } from '../ui/Card';
import { useBillContext } from '../../context/BillContext';
import { Bill } from '../../types';
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

interface SortableBillProps {
  bill: Bill;
  onSelect: (id: string) => void;
}

const SortableBill: React.FC<SortableBillProps> = ({ bill, onSelect }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: bill.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="mb-4"
    >
      <BillItem bill={bill} onClick={() => onSelect(bill.id)} />
    </div>
  );
};

const BillList: React.FC = () => {
  const { filteredBills, selectBill, updateFilterOptions, bills } = useBillContext();
  const [orderChanged, setOrderChanged] = useState(false);
  const [displayBills, setDisplayBills] = useState<Bill[]>([]);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  React.useEffect(() => {
    // Only update displayBills from filteredBills if the order hasn't been manually changed
    if (!orderChanged) {
      setDisplayBills(filteredBills);
    } else {
      // If order was changed, just update the content of the bills while preserving the order
      const billMap = new Map(filteredBills.map(bill => [bill.id, bill]));
      setDisplayBills(prev => 
        prev
          .filter(bill => billMap.has(bill.id))
          .map(bill => billMap.get(bill.id)!)
          .concat(filteredBills.filter(bill => !prev.some(p => p.id === bill.id)))
      );
    }
  }, [filteredBills, orderChanged]);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setDisplayBills(bills => {
        const oldIndex = bills.findIndex(bill => bill.id === active.id);
        const newIndex = bills.findIndex(bill => bill.id === over.id);
        
        setOrderChanged(true);
        return arrayMove(bills, oldIndex, newIndex);
      });
    }
  };
  
  const handleStatusChange = (value: string) => {
    updateFilterOptions({ status: value });
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilterOptions({ searchQuery: e.target.value });
  };
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-medium">Filter Bills</h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              icon={<Search size={18} />}
              placeholder="Search bills..."
              onChange={handleSearchChange}
              fullWidth
            />
            
            <div className="flex gap-4">
              <Select
                icon={<Filter size={18} />}
                options={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'overdue', label: 'Overdue' }
                ]}
                onChange={handleStatusChange}
                className="w-40"
              />
              
              <Input
                type="date"
                icon={<Calendar size={18} />}
                placeholder="Date from"
                className="w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {displayBills.length} Bill{displayBills.length !== 1 ? 's' : ''}
        </h2>
        <div className="text-sm text-gray-500">
          Drag to reorder bills
        </div>
      </div>
      
      {displayBills.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-2">No bills found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your filters or create a new bill
            </div>
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={displayBills.map(bill => bill.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayBills.map(bill => (
                <SortableBill 
                  key={bill.id} 
                  bill={bill} 
                  onSelect={selectBill} 
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default BillList;