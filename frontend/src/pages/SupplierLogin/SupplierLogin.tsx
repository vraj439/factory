import React from "react";
import { useNavigate } from "react-router-dom";
import useDal from '../../common/hooks/useDAL';
import { UserRole } from "../../types/enums";
import axios from "axios";

const SupplierLoginPage = () => {
  const navigate = useNavigate()
  const dal = useDal();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const supplierUserLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    console.log("Attempting login...");
    if (email && password) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/supplier/login", { email, password });
        console.log("Login Response: ", response.data);
  
        if (response.data && response.data.token) {
          // Save the token and user type to local storage
          localStorage.setItem("access_token", response.data.token);
          localStorage.setItem("user_type", UserRole.SUPPLIER);
  
          // Navigate to the home page
          navigate("/");
        } else {
          alert("Invalid login response. Please try again.");
        }
      } catch (err) {
        alert("Error during login. Please check your credentials.");
        console.error(err);
      }
    } else {
      alert("Please enter email and password.");
    }
  };
  
  

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2  bg-green-100 flex flex-col justify-center items-start p-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-green-700 mb-6">
            Grow Your Business With Kkonnect.io
          </h1>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="text-green-600 text-xl mr-3">📦</span>
              <span className="text-lg">Get New Orders</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-600 text-xl mr-3">💰</span>
              <span className="text-lg">Receive Timely Payment</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-600 text-xl mr-3">🌍</span>
              <span className="text-lg">Access to Global Customer Base</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-600 text-xl mr-3">📝</span>
              <span className="text-lg">Create Instant Quotations</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-600 text-xl mr-3">👥</span>
              <span className="text-lg">Easily Manage Customers</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <p className="text-gray-600 mb-6 text-center">Welcome back!</p>
          <form className="space-y-4" onSubmit={supplierUserLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email ID *
              </label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  👁️
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="/" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4" onClick={() => {
            navigate('/registration')
          }}>
            Don’t have an account?{" "}
            <a href="/" className="text-green-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupplierLoginPage;
