import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle, 
  FileCheck
} from 'lucide-react';
import { useBillContext } from '../../context/BillContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  isActive = false,
  onClick
}) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`
          flex items-center w-full px-4 py-3 rounded-md text-left transition-colors
          ${isActive 
            ? 'bg-blue-50 text-blue-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <span className="mr-3">{icon}</span>
        <span className="font-medium">{text}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { selectBill } = useBillContext();
  
  const handleNavigation = (path: string) => {
    selectBill(null);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };
  
  // This would be more dynamic in a real app
  const isActive = (path: string) => {
    return path === 'dashboard';
  };
  
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform lg:translate-x-0 lg:static lg:h-auto lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200 lg:border-none">
          <div className="flex items-center flex-shrink-0">
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
        
        <nav className="mt-5 px-3 py-2">
          <ul className="space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              text="Dashboard" 
              isActive={isActive('dashboard')}
              onClick={() => handleNavigation('dashboard')}
            />
            <SidebarItem 
              icon={<FileText size={20} />} 
              text="All Bills" 
              onClick={() => handleNavigation('bills')}
            />
            <SidebarItem 
              icon={<FileCheck size={20} />} 
              text="Paid Bills" 
              onClick={() => handleNavigation('paid-bills')}
            />
            <SidebarItem 
              icon={<Users size={20} />} 
              text="Customers" 
              onClick={() => handleNavigation('customers')}
            />
          </ul>
          
          <div className="mt-10 pt-5 border-t border-gray-200">
            <ul className="space-y-1">
              <SidebarItem 
                icon={<Settings size={20} />} 
                text="Settings" 
                onClick={() => handleNavigation('settings')}
              />
              <SidebarItem 
                icon={<HelpCircle size={20} />} 
                text="Help & Support" 
                onClick={() => handleNavigation('help')}
              />
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;