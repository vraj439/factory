import React from 'react';
import { useNavigate } from 'react-router-dom';

const LeftMenu = () => {
  const navigate = useNavigate();
  const menuItems = [
    { label: 'Instant Quote', route: '/instant-quote' },
    { label: 'Quotes', route: '/quotes' },
    { label: 'Orders', route: '/orders' },
    { label: 'Items Library', route: '/items' },
    { label: 'Contracts' },
    { label: 'Help' }
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <h1 className="text-xl font-bold text-blue-600">FACTORY.IO</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col flex-grow">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
            onClick={() => {
              navigate(item.route as string);
            }}
          >
            {/* <span className="text-lg mr-3">{item.icon}</span> */}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default LeftMenu;
