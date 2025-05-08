import React from 'react';
import DashboardSummary from './DashboardSummary';
import RecentBills from './RecentBills';
import { useBillContext } from '../../context/BillContext';
import Card, { CardContent } from '../ui/Card';
import { FilePlus } from 'lucide-react';
import Button from '../ui/Button';

const Dashboard: React.FC = () => {
  const { bills, createBill } = useBillContext();
  
  const hasBills = bills.length > 0;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your billing activity</p>
      </div>
      
      {hasBills ? (
        <>
          <DashboardSummary />
          <RecentBills />
        </>
      ) : (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Welcome to BillBook</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Start by creating your first bill. You can add customer details, bill items, and more.
              </p>
            </div>
            
            <Button 
              variant="primary"
              size="lg"
              icon={<FilePlus size={18} />}
              onClick={createBill}
            >
              Create Your First Bill
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;