import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types/enums';
import useDal from '../common/hooks/useDAL';
import useConsumerStore from '../stores/consumer';

interface IRoleBasedRoute {
  element: ReactNode;
  requiredRole: UserRole;
}

const RoleBasedRoute: React.FC<IRoleBasedRoute> = ({ element, requiredRole }) => {
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [isUserStatusLoading, setIsUserStatusLoading] = useState(true); // Start with loading state
  const dal = useDal();
  const { setConsumer } = useConsumerStore();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const userResponse = await dal.userAuth.checkStatus(requiredRole);
        setIsUserAllowed(true);
        if (requiredRole === UserRole.CONSUMER) {
          const { items: addresses } = await dal.address.getAddresses();
          setConsumer({
            ...userResponse,
            addresses
          });

        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setIsUserAllowed(false); // Deny access if there's an error
      } finally {
        setIsUserStatusLoading(false); // Stop loading
      }
    };

    fetchStatus();
  }, [requiredRole, dal]);

  // Render loading spinner while checking user status
  if (isUserStatusLoading) {
    return <div className="loading-spinner">Checking permissions...</div>;
  }

  // Render the element if the user is allowed
  if (isUserAllowed) {
    return element;
  }

  // Redirect to the home page if the user is not allowed
  return <Navigate to={`/${requiredRole}-login`} />;
};

export default RoleBasedRoute;
