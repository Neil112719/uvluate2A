import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const withAuth = (WrappedComponent, requiredUserType) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const hasVerified = useRef(false);

    useEffect(() => {
      const verifySession = async () => {
        if (hasVerified.current) {
          console.log('Session already verified. Skipping verification.');
          return;
        }

        hasVerified.current = true; // Mark verification as done

        const sessionToken = localStorage.getItem('sessionToken');
        console.log('Retrieved session token from localStorage:', sessionToken);
        console.log('Required user type being sent:', requiredUserType);

        if (!sessionToken) {
          console.log('No session token found. Redirecting to login.');
          navigate('/', { replace: true });
          return;
        }

        try {
          const response = await axios.post(
            'http://localhost:8000/api/login/verify-session.php',
            {
              required_usertype: requiredUserType,
            },
            {
              headers: { Authorization: `Bearer ${sessionToken}` },
              withCredentials: true,
            }
          );

          console.log('Verification response:', response.data);

          if (response.data.success) {
            setIsAuthenticated(true);
          } else {
            console.log('Session verification failed:', response.data.message);
            setError(response.data.message || 'Session verification failed.');
            navigate('/', { replace: true });
          }
        } catch (error) {
          console.error('Error verifying session:', error);
          setError('An error occurred while verifying your session.');
          navigate('/', { replace: true });
        } finally {
          setIsVerifying(false);
        }
      };

      verifySession();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    if (isVerifying) {
      return (
        <div>
          {error ? <p className="error">{error}</p> : <p>Loading...</p>}
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
