import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDal from '../../common/hooks/useDAL';
import { UserRole } from '../../types/enums';

function CustomerLoginPage() {
  const navigate = useNavigate();
  const defaultState = { email: '', password: '' };
  const dal = useDal();
  const [userCreds, setUserCreds] = useState({ ...defaultState });
  const signInUser = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      const response = await dal.userAuth.login(userCreds, UserRole.CONSUMER);
      localStorage.setItem('access_token', response.token);
      localStorage.setItem('user_type', UserRole.CONSUMER);
      let onRegistrationSuccessRoute = '/instant-quote';
      navigate(onRegistrationSuccessRoute);
    } catch (err) {
      //todo: show error on modal or as a toaster
      alert('Invalid consumer credentials');
    }

  };
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-center items-start p-10">
        <h1 className="text-4xl font-bold mb-6">
          Manufacturing is easy with Karkhana.io
        </h1>
        <ul className="space-y-4">
          <li className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-white text-blue-900 rounded-full mr-4">
              💵
            </div>
            <span>Fair Pricing</span>
          </li>
          <li className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-white text-blue-900 rounded-full mr-4">
              ✅
            </div>
            <span>Quality Assurance</span>
          </li>
          <li className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-white text-blue-900 rounded-full mr-4">
              ⚡
            </div>
            <span>Build Fast. Learn Fast</span>
          </li>
          <li className="flex items-center">
            <div className="w-8 h-8 flex items-center justify-center bg-white text-blue-900 rounded-full mr-4">
              🏭
            </div>
            <span>Massive Manufacturing Capacity</span>
          </li>
        </ul>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white">
        <div className="w-3/4 max-w-md">
          <h2 className="text-2xl font-semibold mb-6">Log In</h2>
          <p className="mb-6 text-gray-600">Welcome back!</p>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter your email"
                onChange={(e) =>
                  setUserCreds((prevState) => ({
                    ...prevState,
                    email: e.target.value
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    setUserCreds((prevState) => ({
                      ...prevState,
                      password: e.target.value
                    }))
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
                >
                  Show
                </button>
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>Remember me</span>
              </label>
              <a
                onClick={() => {
                  navigate('/consumer-registration');
                }}
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800"
              onClick={signInUser}
            >
              Log In
            </button>
          </form>
          <p className="mt-6 text-gray-600">
            Don’t have an account?{' '}
            <a
              onClick={() => {
                navigate('/consumer-registration');
              }}
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomerLoginPage;
