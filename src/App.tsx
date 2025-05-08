import React, { useState, useEffect } from 'react';
import Layout from './components/layout/Layout';
import BillList from './components/bills/BillList';
import BillForm from './components/bills/BillForm';
import Dashboard from './components/dashboard/Dashboard';
import { BillProvider, useBillContext } from './context/BillContext';
import { createEmptyBill } from './utils/helpers';

// Sample bill data to populate for first-time users
const generateSampleBills = () => {
  const bills = [];
  
  // Sample bill 1
  const bill1 = createEmptyBill();
  bill1.customerName = 'Acme Corporation';
  bill1.customerEmail = 'billing@acmecorp.com';
  bill1.customerPhone = '555-123-4567';
  bill1.billingAddress = '123 Business Ave, Suite 100, New York, NY 10001';
  bill1.date = '2025-01-15';
  bill1.dueDate = '2025-02-15';
  bill1.status = 'paid';
  bill1.items = [
    { id: '1', description: 'Website Development', quantity: 1, price: 2500, amount: 2500 },
    { id: '2', description: 'Hosting (Annual)', quantity: 1, price: 199, amount: 199 }
  ];
  bill1.subtotal = 2699;
  bill1.tax = 269.9;
  bill1.total = 2968.9;
  bill1.notes = 'Thank you for your business!';
  
  // Sample bill 2
  const bill2 = createEmptyBill();
  bill2.customerName = 'TechStart Inc.';
  bill2.customerEmail = 'accounts@techstart.co';
  bill2.customerPhone = '555-987-6543';
  bill2.billingAddress = '456 Innovation Park, San Francisco, CA 94107';
  bill2.date = '2025-02-01';
  bill2.dueDate = '2025-03-01';
  bill2.status = 'pending';
  bill2.items = [
    { id: '1', description: 'Consulting Services (20 hours)', quantity: 20, price: 150, amount: 3000 },
    { id: '2', description: 'Software License', quantity: 5, price: 99, amount: 495 }
  ];
  bill2.subtotal = 3495;
  bill2.tax = 349.5;
  bill2.total = 3844.5;
  bill2.notes = 'Net 30 payment terms';
  
  // Sample bill 3
  const bill3 = createEmptyBill();
  bill3.customerName = 'Global Enterprises LLC';
  bill3.customerEmail = 'finance@globalent.org';
  bill3.customerPhone = '555-555-5555';
  bill3.billingAddress = '789 Corporate Blvd, Chicago, IL 60601';
  bill3.date = '2025-01-05';
  bill3.dueDate = '2025-01-20';
  bill3.status = 'overdue';
  bill3.items = [
    { id: '1', description: 'Marketing Campaign', quantity: 1, price: 5000, amount: 5000 },
    { id: '2', description: 'Social Media Management', quantity: 1, price: 1500, amount: 1500 }
  ];
  bill3.subtotal = 6500;
  bill3.tax = 650;
  bill3.total = 7150;
  bill3.notes = 'Please pay immediately';
  
  bills.push(bill1, bill2, bill3);
  return bills;
};

const MainContent: React.FC = () => {
  const { selectedBill, bills } = useBillContext();
  
  // If a bill is selected, show the bill form
  if (selectedBill) {
    return <BillForm />;
  }
  
  // Otherwise show dashboard or bill list based on whether there are bills
  return bills.length === 0 ? <Dashboard /> : <BillList />;
};

const App: React.FC = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Check if this is the first load
  useEffect(() => {
    const savedBills = localStorage.getItem('bills');
    
    // If no bills in storage, add sample data
    if (!savedBills && isFirstLoad) {
      const sampleBills = generateSampleBills();
      localStorage.setItem('bills', JSON.stringify(sampleBills));
      setIsFirstLoad(false);
    }
  }, [isFirstLoad]);
  
  return (
    <BillProvider>
      <Layout>
        <MainContent />
      </Layout>
    </BillProvider>
  );
};

export default App;