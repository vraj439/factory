import React, { useState } from 'react';
import useDal from '../../hooks/useDAL';
import { UserRole } from '../../../types/enums';
import { useNavigate } from 'react-router-dom';
import useConsumerStore from '../../../stores/consumer';

interface HeaderProps {
  userName?: string;
  headerTitle: string;
  userRole: UserRole;
}

const Header = ({ headerTitle, userName, userRole }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dal = useDal();
  const navigate = useNavigate();
  const { consumer } = useConsumerStore();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await dal.userAuth.logout(userRole);
      navigate(`/${userRole}-login`);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between border-b px-4 py-3 bg-white shadow">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Breadcrumbs */}
        <nav>
          <h2 className="text-lg font-semibold">{headerTitle}</h2>
        </nav>
      </div>
      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none"
          >
            <span>Hi, {consumer.name}</span>
            <span className="material-icons">account_circle</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li
                  onClick={() => handleSignOut()}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  <span className="material-icons text-gray-500">logout</span>
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
