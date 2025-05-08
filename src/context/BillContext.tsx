import React, { createContext, useState, useEffect, useContext } from 'react';
import { Bill, BillFilterOptions } from '../types';
import { createEmptyBill } from '../utils/helpers';

interface BillContextType {
  bills: Bill[];
  selectedBill: Bill | null;
  filterOptions: BillFilterOptions;
  filteredBills: Bill[];
  createBill: () => void;
  updateBill: (bill: Bill) => void;
  deleteBill: (id: string) => void;
  selectBill: (id: string | null) => void;
  updateFilterOptions: (options: Partial<BillFilterOptions>) => void;
}

const defaultFilterOptions: BillFilterOptions = {
  status: 'all',
  dateRange: null,
  searchQuery: '',
};

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [filterOptions, setFilterOptions] = useState<BillFilterOptions>(defaultFilterOptions);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);

  // Load bills from localStorage on initial load
  useEffect(() => {
    const savedBills = localStorage.getItem('bills');
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    }
  }, []);

  // Save bills to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  // Apply filters whenever bills or filter options change
  useEffect(() => {
    let result = [...bills];

    // Filter by status
    if (filterOptions.status !== 'all') {
      result = result.filter(bill => bill.status === filterOptions.status);
    }

    // Filter by date range
    if (filterOptions.dateRange) {
      const { from, to } = filterOptions.dateRange;
      result = result.filter(bill => {
        const billDate = new Date(bill.date);
        return billDate >= new Date(from) && billDate <= new Date(to);
      });
    }

    // Filter by search query (customer name, bill number)
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      result = result.filter(
        bill => 
          bill.customerName.toLowerCase().includes(query) || 
          bill.billNumber.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredBills(result);
  }, [bills, filterOptions]);

  const createBill = () => {
    const newBill = createEmptyBill();
    setBills(prevBills => [newBill, ...prevBills]);
    setSelectedBill(newBill);
  };

  const updateBill = (updatedBill: Bill) => {
    setBills(prevBills => 
      prevBills.map(bill => 
        bill.id === updatedBill.id ? updatedBill : bill
      )
    );
    
    if (selectedBill && selectedBill.id === updatedBill.id) {
      setSelectedBill(updatedBill);
    }
  };

  const deleteBill = (id: string) => {
    setBills(prevBills => prevBills.filter(bill => bill.id !== id));
    
    if (selectedBill && selectedBill.id === id) {
      setSelectedBill(null);
    }
  };

  const selectBill = (id: string | null) => {
    if (id === null) {
      setSelectedBill(null);
      return;
    }
    
    const bill = bills.find(b => b.id === id);
    setSelectedBill(bill || null);
  };

  const updateFilterOptions = (options: Partial<BillFilterOptions>) => {
    setFilterOptions(prev => ({
      ...prev,
      ...options
    }));
  };

  const value = {
    bills,
    selectedBill,
    filterOptions,
    filteredBills,
    createBill,
    updateBill,
    deleteBill,
    selectBill,
    updateFilterOptions
  };

  return (
    <BillContext.Provider value={value}>
      {children}
    </BillContext.Provider>
  );
};

export const useBillContext = () => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBillContext must be used within a BillProvider');
  }
  return context;
};