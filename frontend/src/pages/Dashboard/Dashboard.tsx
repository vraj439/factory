import React from 'react';
import LeftMenu from '../../common/menu';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <LeftMenu />
      <div className="flex-grow bg-gray-50 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
