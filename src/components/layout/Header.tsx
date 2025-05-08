import React from 'react';
import { FilePlus, FileSearch, Menu, X } from 'lucide-react';
import Button from '../ui/Button';
import { useBillContext } from '../../context/BillContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { createBill, selectBill } = useBillContext();
  
  const handleCreateBill = () => {
    createBill();
  };
  
  const handleViewBills = () => {
    selectBill(null);
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="ml-4 lg:ml-0 flex items-center">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h1 className="ml-2 text-xl font-bold text-gray-900">BillBook</h1>
              </div>
            </div>
          </div>
          
          {/* Right side */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              icon={<FileSearch size={18} />}
              onClick={handleViewBills}
              className="hidden sm:flex"
            >
              View Bills
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<FilePlus size={18} />}
              onClick={handleCreateBill}
            >
              New Bill
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;