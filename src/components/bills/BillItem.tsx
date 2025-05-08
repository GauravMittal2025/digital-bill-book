import React from 'react';
import { Bill } from '../../types';
import Card, { CardContent } from '../ui/Card';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';

interface BillItemProps {
  bill: Bill;
  onClick: () => void;
}

const BillItem: React.FC<BillItemProps> = ({ bill, onClick }) => {
  return (
    <Card hoverable onClick={onClick} className="transition-all duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium text-gray-900">{bill.billNumber}</div>
            <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bill.status)}`}>
              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
            </div>
          </div>
          
          <div className="mb-3">
            <div className="text-sm font-semibold">{bill.customerName}</div>
            <div className="text-xs text-gray-500">{bill.customerEmail}</div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div>
              <div className="text-gray-500">Date</div>
              <div>{formatDate(bill.date)}</div>
            </div>
            <div>
              <div className="text-gray-500">Due Date</div>
              <div>{formatDate(bill.dueDate)}</div>
            </div>
            <div>
              <div className="text-gray-500">Amount</div>
              <div className="font-semibold">{formatCurrency(bill.total)}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-4 py-2 border-t text-sm flex justify-between">
          <div className="text-gray-500">
            {bill.items.length} item{bill.items.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillItem;