import React from 'react';
import { useBillContext } from '../../context/BillContext';
import BillItem from '../bills/BillItem';
import Card, { CardHeader } from '../ui/Card';
import Button from '../ui/Button';

const RecentBills: React.FC = () => {
  const { filteredBills, selectBill } = useBillContext();
  
  // Get the 6 most recent bills
  const recentBills = [...filteredBills]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
  
  const handleViewAll = () => {
    // Navigate to bills list
    selectBill(null);
  };
  
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Bills</h2>
        <Button 
          variant="outline"
          size="sm"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </CardHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {recentBills.map(bill => (
          <BillItem 
            key={bill.id}
            bill={bill}
            onClick={() => selectBill(bill.id)}
          />
        ))}
      </div>
    </Card>
  );
};

export default RecentBills;