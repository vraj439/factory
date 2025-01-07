import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Welcome from '../pages/Welcome';
import CustomerLoginPage from '../pages/CustomerLogin/CustomerLogin';
import SupplierLoginPage from '../pages/SupplierLogin/SupplierLogin';
import Dashboard from '../pages/Dashboard/Dashboard';
import InstantQuote from '../pages/InstantQuote/InstantQuote';
import RegistrationPage from '../pages/Registration';
import QuotesPage from '../pages/Quotes';
import RoleBasedRoute from './RoleBasedRoute';
import { UserRole } from '../types/enums';
import LeftMenu from '../common/menu';
import Items from '../pages/Items';
import OrdersPage from '../pages/Orders';
import QuotesSummary from '../common/components/QuotesSummary';
import Header from '../common/components/Header';
import ItemDetails from '../common/components/ItemDetails';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/consumer-login" element={<CustomerLoginPage />} />
      <Route path="/supplier-login" element={<SupplierLoginPage />} />
      <Route path="/supplier-registration" element={<RegistrationPage />} />
      <Route path="/consumer-registration" element={<RegistrationPage />} />

      // protected routes
      <Route path="/dashboard"
             element={<RoleBasedRoute element={<Dashboard />} requiredRole={UserRole.CONSUMER} />} />

      <Route
        path="/dashboard"
        element={
          <RoleBasedRoute
            element={<Dashboard />}
            requiredRole={UserRole.CONSUMER}
          />
        }
      />
      <Route
        path="/instant-quote"
        element={
          <RoleBasedRoute
            element={
              <div className="flex">
                <LeftMenu />
                <div className="flex-grow">
                  <Header headerTitle="Instant Quote" userRole={UserRole.CONSUMER} />
                  <InstantQuote />
                </div>
              </div>
            }
            requiredRole={UserRole.CONSUMER}
          />
        }
      />
      <Route
        path="/quotes"
        element={
          <RoleBasedRoute
            element={
              <div className="flex">
                <LeftMenu />
                <div className="flex-grow">
                  <Header headerTitle="Quotes" userRole={UserRole.CONSUMER} />
                  <QuotesPage />
                </div>
              </div>
            }
            requiredRole={UserRole.CONSUMER}
          />
        }
      />
      <Route
        path="/quotes/:quoteId"
        element={
          <RoleBasedRoute
            element={
              <div className="flex">
                <LeftMenu />
                <div className="flex-grow">
                  <Header headerTitle="Quotes" userRole={UserRole.CONSUMER} />
                  <QuotesSummary />
                </div>
              </div>
            }
            requiredRole={UserRole.CONSUMER}
          />
        }
      />
      <Route
        path="/items"
        element={
          <RoleBasedRoute
            element={
              <div className="flex">
                <LeftMenu />
                <div className="flex-grow">
                  <Header headerTitle="Items" userRole={UserRole.CONSUMER} />
                  <Items />
                </div>
              </div>
            }
            requiredRole={UserRole.CONSUMER}
          />
        }
      />
      <Route
        path="/orders"
        element={
          <RoleBasedRoute
            element={
              <div className="flex">
                <LeftMenu />
                <div className="flex-grow">
                  <Header headerTitle="Orders" userRole={UserRole.CONSUMER} />
                  <OrdersPage />
                </div>
              </div>
            }
            requiredRole={UserRole.CONSUMER}
          />
        }
      />
    </Routes>
  );
}
