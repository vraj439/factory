import React from 'react';
import { companyType, CountryCodes, industriesType } from './constants';
import useDal from '../../common/hooks/useDAL';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserRole } from '../../types/enums';

const RegistrationPage = () => {
  const registrationEmptyState = {
    name: '',
    company: '',
    email: '',
    password: '',
    phone_number: '',
    industry: '',
    company_type: '',
    marketing_consent: false
  };
  const errorsEmptyState = {
    name: '',
    company: '',
    email: '',
    password: '',
    phone_number: '',
    industry: '',
    company_type: '',
    marketing_consent: '',
    country_code: ''
  };
  const [registration, setRegistration] = React.useState({ ...registrationEmptyState });
  const dal = useDal();
  const [errors, setErrors] = React.useState({ ...errorsEmptyState });
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: any = {};
    if (!registration.name) newErrors.name = 'Name is required.';
    if (!registration.company) newErrors.company = 'Company name is required.';
    if (!registration.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(registration.email))
      newErrors.email = 'Invalid email format.';
    if (!registration.password) newErrors.password = 'Password is required.';
    if (!registration.phone_number)
      newErrors.phone_number = 'Phone number is required.';
    if (!registration.industry)
      newErrors.industry = 'Industry selection is required.';
    if (!registration.company_type)
      newErrors.company_type = 'Company Type selection is required.';
    if (!registration.marketing_consent)
      newErrors.marketing_consent = 'You must agree to terms & conditions.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns `true` if no errors
  };

  const registerUser = async (e) => {
    e.preventDefault(); // Prevent form submission
    if (!validateForm()) return;
    let onRegistrationSuccessRoute = '/dashboard';
    const userType = pathname.includes('customer') ? UserRole.CONSUMER : UserRole.SUPPLIER;
    let response;
    try {
      if (userType === UserRole.CONSUMER) {
        response = await dal.registrationAccess.registerCostumer(registration);
      } else {
        response = await dal.registrationAccess.registerSupplier(registration);
        onRegistrationSuccessRoute = '/';
      }
      navigate(onRegistrationSuccessRoute);
      localStorage.setItem('access_token', response.token);
      localStorage.setItem('user_type', userType);
    } catch (err) {
      //todo: show error on modal or as a toaster
    }

  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/2 bg-blue-900 text-white flex flex-col justify-center px-16">
        <h1 className="text-3xl font-bold mb-4">Factory.IO</h1>
        <p className="text-2xl font-semibold mb-10">
          Manufacturing is easy with Factory.io
        </p>
        <div className="space-y-6">
          <div className="flex items-center">
            <span className="bg-white text-blue-900 rounded-full p-2 mr-4">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 9V7a4 4 0 00-8 0v2m-3 0a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"
                />
              </svg>
            </span>
            <p className="text-lg font-medium">Fair Pricing</p>
          </div>
          <div className="flex items-center">
            <span className="bg-white text-blue-900 rounded-full p-2 mr-4">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-3.866 0-7 2.91-7 6.5s3.134 6.5 7 6.5 7-2.91 7-6.5-3.134-6.5-7-6.5z"
                />
              </svg>
            </span>
            <p className="text-lg font-medium">Quality Assurance</p>
          </div>
          <div className="flex items-center">
            <span className="bg-white text-blue-900 rounded-full p-2 mr-4">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a1 1 0 001 1h3m10-6l3 3m-4-3a1 1 0 00-1 1v3m0-4a1 1 0 011-1h3M4 4v5h.01M4 10h.01"
                />
              </svg>
            </span>
            <p className="text-lg font-medium">Build Fast. Learn Fast</p>
          </div>
          <div className="flex items-center">
            <span className="bg-white text-blue-900 rounded-full p-2 mr-4">
              {/* Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v2a1 1 0 001 1h4a1 1 0 001-1v-2m1 0a3 3 0 00-3-3H9a3 3 0 00-3 3v2m4-10h4"
                />
              </svg>
            </span>
            <p className="text-lg font-medium">
              Massive Manufacturing Capacity
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-gray-50 flex justify-center items-center">
        <div className="w-full max-w-lg px-8 py-10 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            Sign up for an account
          </h2>
          <form className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                required
                onChange={(e) =>
                  setRegistration((prevValue) => ({
                    ...prevValue,
                    name: e.target.value
                  }))
                }
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company *
              </label>
              <input
                type="text"
                placeholder="Company name"
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                required
                onChange={(e) =>
                  setRegistration((prevValue) => ({
                    ...prevValue,
                    company: e.target.value
                  }))
                }
              />
              {errors.company && (
                <p className="text-red-500 text-sm">{errors.company}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Email *
              </label>
              <input
                type="email"
                placeholder="Enter Company Email"
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                required
                onChange={(e) =>
                  setRegistration((prevValue) => ({
                    ...prevValue,
                    email: e.target.value
                  }))
                }
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                type="password"
                placeholder="Password"
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                required
                onChange={(e) =>
                  setRegistration((prevValue) => ({
                    ...prevValue,
                    password: e.target.value
                  }))
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Phone Number with Country Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone number *
              </label>
              <div className="flex">
                {/* Country Code Dropdown */}
                <select
                  className="w-1/3 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  onChange={(e) =>
                    setRegistration((prevValue) => ({
                      ...prevValue,
                      country_code: e.target.value
                    }))
                  }
                >
                  <option value="">Code</option>
                  {CountryCodes.map((country, index) => (
                    <option key={`${country.code}-${index}`} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>

                {/* Phone Number Input */}
                <input
                  type="text"
                  placeholder="Phone number"
                  className="w-2/3 ml-2 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  required
                  onChange={(e) =>
                    setRegistration((prevValue) => ({
                      ...prevValue,
                      phone_number: e.target.value
                    }))
                  }
                />
              </div>
              {errors.country_code && (
                <p className="text-red-500 text-sm">{errors.country_code}</p>
              )}
              {errors.phone_number && (
                <p className="text-red-500 text-sm">{errors.phone_number}</p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <select
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                onChange={(e) =>
                  setRegistration((prevValue) => ({
                    ...prevValue,
                    industry: e.target.value
                  }))
                }
              >
                <option value="">Select</option>
                {industriesType.map((type, index) => (
                  <option key={`${type}-${index}`} value={type}>{type}</option>
                ))}
              </select>
              {errors.industry && (
                <p className="text-red-500 text-sm">{errors.industry}</p>
              )}
            </div>

            {/* Company Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
              Company Type
              </label>
              <select
                className="w-full mt-1 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                onChange={(e) =>
                  setRegistration((prevValue) => ({
                    ...prevValue,
                    company_type: e.target.value
                  }))
                }
              >
                <option value="">Select</option>
                {companyType.map((type, index) => (
                  <option key={`${type}-${index}`} value={type}>{type}</option>
                ))}
              </select>
              {errors.company_type && (
                <p className="text-red-500 text-sm">{errors.company_type}</p>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 border-gray-300 rounded text-black"
                onChange={(e) =>
                  setRegistration((prevValue) => ({
                    ...prevValue,
                    marketing_consent: e.target.checked
                  }))
                }
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-blue-600 underline">
                  terms & conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={registerUser}
            >
              Sign up
            </button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <a
              onClick={() => {
                if (pathname.includes('customer')) {
                  navigate('/consumer-login');
                } else {
                  navigate('/supplier-login');
                }
              }}
              className="text-blue-600 underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
