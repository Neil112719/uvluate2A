import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import VerifyOtpOverlay from '../components/logincopomponents/VerifyOtpOverlay';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isOtpOverlayVisible, setIsOtpOverlayVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/login/login.php', { id, password });
      if (response.data.success) {
        setMessage('OTP sent to your email. Please check your inbox.');
        setIsOtpOverlayVisible(true); // Show OTP overlay
      } else {
        setError(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred while trying to log in. Please try again.');
    }
  };

  const handleOtpVerified = (usertype) => {
    switch (usertype) {
      case 1:
        navigate('/admin');
        break;
      case 2:
        navigate('/dean-dashboard');
        break;
      case 3:
        navigate('/coordinator');
        break;
      case 4:
        navigate('/instructor');
        break;
      case 5:
        navigate('/student');
        break;
      default:
        setError('User type not recognized.');
        setIsOtpOverlayVisible(false); // Close OTP overlay
        break;
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {!isOtpOverlayVisible ? (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="user-id">User ID</label>
            <input
              id="user-id"
              type="text"
              placeholder="Enter your User ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      ) : (
        <VerifyOtpOverlay userId={id} onVerified={handleOtpVerified} />
      )}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LoginPage;
