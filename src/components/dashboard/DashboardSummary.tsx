import React from 'react';
import { CircleDollarSign, Clock, FileCheck, FileClock } from 'lucide-react';
import Card, { CardContent } from '../ui/Card';
import { useBillContext } from '../../context/BillContext';
import { formatCurrency } from '../../utils/helpers';

const DashboardSummary: React.FC = () => {
  const { bills } = useBillContext();
  
  // Calculate summary statistics
  const totalBills = bills.length;
  const paidBills = bills.filter(bill => bill.status === 'paid');
  const pendingBills = bills.filter(bill => bill.status === 'pending');
  const overdueBills = bills.filter(bill => bill.status === 'overdue');
  
  const totalAmount = bills.reduce((sum, bill) => sum + bill.total, 0);
  const paidAmount = paidBills.reduce((sum, bill) => sum + bill.total, 0);
  const pendingAmount = pendingBills.reduce((sum, bill) => sum + bill.total, 0);
  const overdueAmount = overdueBills.reduce((sum, bill) => sum + bill.total, 0);
  
  const summaryCards = [
    {
      title: 'Total Billed',
      value: formatCurrency(totalAmount),
      icon: <CircleDollarSign size={24} className="text-blue-500" />,
      subtitle: `${totalBills} total bill${totalBills !== 1 ? 's' : ''}`,
      color: 'border-blue-500 bg-blue-50',
    },
    {
      title: 'Paid',
      value: formatCurrency(paidAmount),
      icon: <FileCheck size={24} className="text-green-500" />,
      subtitle: `${paidBills.length} paid bill${paidBills.length !== 1 ? 's' : ''}`,
      color: 'border-green-500 bg-green-50',
    },
    {
      title: 'Pending',
      value: formatCurrency(pendingAmount),
      icon: <Clock size={24} className="text-yellow-500" />,
      subtitle: `${pendingBills.length} pending bill${pendingBills.length !== 1 ? 's' : ''}`,
      color: 'border-yellow-500 bg-yellow-50',
    },
    {
      title: 'Overdue',
      value: formatCurrency(overdueAmount),
      icon: <FileClock size={24} className="text-red-500" />,
      subtitle: `${overdueBills.length} overdue bill${overdueBills.length !== 1 ? 's' : ''}`,
      color: 'border-red-500 bg-red-50',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {summaryCards.map((card, index) => (
        <Card key={index} className={`border-l-4 ${card.color}`}>
          <CardContent className="p-5">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
                <div className="text-2xl font-bold mt-1">{card.value}</div>
                <div className="text-sm text-gray-500 mt-1">{card.subtitle}</div>
              </div>
              <div className="flex items-start">
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardSummary;