export interface Bill {
  id: string;
  billNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  date: string;
  dueDate: string;
  items: BillItem[];
  notes: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  total: number;
  subtotal: number;
  tax: number;
}

export interface BillItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface BillFilterOptions {
  status: string;
  dateRange: {
    from: string;
    to: string;
  } | null;
  searchQuery: string;
}