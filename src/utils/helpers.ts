import { v4 as uuidv4 } from 'uuid';
import { Bill, BillItem } from '../types';

export const generateBillNumber = (): string => {
  const prefix = 'INV';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${date}-${random}`;
};

export const calculateItemAmount = (quantity: number, price: number): number => {
  return quantity * price;
};

export const calculateSubtotal = (items: BillItem[]): number => {
  return items.reduce((sum, item) => sum + item.amount, 0);
};

export const calculateTax = (subtotal: number, taxRate: number = 0.1): number => {
  return subtotal * taxRate;
};

export const calculateTotal = (subtotal: number, tax: number): number => {
  return subtotal + tax;
};

export const createEmptyBillItem = (): BillItem => {
  return {
    id: uuidv4(),
    description: '',
    quantity: 1,
    price: 0,
    amount: 0
  };
};

export const createEmptyBill = (): Bill => {
  const newItem = createEmptyBillItem();
  
  return {
    id: uuidv4(),
    billNumber: generateBillNumber(),
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    billingAddress: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [newItem],
    notes: '',
    status: 'draft',
    subtotal: 0,
    tax: 0,
    total: 0
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    case 'draft':
    default:
      return 'bg-gray-100 text-gray-800';
  }
};