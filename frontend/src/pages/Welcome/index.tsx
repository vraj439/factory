// import React from "react";
import { useNavigate } from 'react-router-dom';
import DropdownMenu from '../../common/DropdownMenu';
import ContactSalesSection from '../../common/components/ContactSalesSection';
import useDal from '../../common/hooks/useDAL';
import useDAL from '../../common/hooks/useDAL';
import { UserRole } from '../../types/enums';
import axios from 'axios';
// import image from '../../assets/assets/hero-background.jpg';

const HomePage = () => {
  const token = localStorage.getItem('access_token');
  const isUserLoggedIn = !!token; // Boolean check for token presence
  const navigate = useNavigate();
  const dal = useDAL();
  const handleLogout = async () => {
    const userType: string = localStorage.getItem('user_type');
    try {
      // await dal.userAuth.logout(userType as UserRole);
      const response = await axios.post("http://127.0.0.1:8000/api/supplier/logout");
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_type');
      navigate('/');
    } catch (e) {
      // todo: handle error
    }
  };
  return (
    <div>
      <header
        className="bg-blue-900 text-white flex items-center justify-between px-8 py-4 md:flex-row flex-col gap-0 gap-y-4 mx-auto"
      >
        <div className="text-2xl font-bold">Factory.io</div>

        {isUserLoggedIn ? (
          <div className="flex items-center justify-center md:justify-between w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4">
            {/* Dropdown Menu */}
            <div className="lg:flex hidden">
              <DropdownMenu />
            </div>

            {/* Logout Button */}
            <button
              className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-900"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-4">
            {/* Customer Login Button */}
            <button
              className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-900"
              onClick={() => navigate('/consumer-login')}
            >
              Customer Login
            </button>

            {/* Supplier Login Button */}
            <button
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => navigate('/supplier-login')}
            >
              Supplier Login
            </button>
          </div>
        )}
      </header>

      {isUserLoggedIn ? (
        <section
          className="flex justify-center text-center w-full">
          <div style={{ 'width': '1900px' }} className="max-w-screen-2xl bg-[url('/assets/hero-background.jpg')] py-20 ">
            <ContactSalesSection />
          </div>
        </section>
      ) : (
        <center><h1>Need To Login</h1></center>
      )}
    </div>
  );
};

export default HomePage;
