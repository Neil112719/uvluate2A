import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyOtpOverlay = ({ userId, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/verify-otp.php', { id: userId, otp });
      console.log('Verify OTP response:', response.data); // Debugging log

      if (response.data.success) {
        const { session_token, usertype } = response.data;

        // Store the session token in localStorage
        localStorage.setItem('sessionToken', session_token);
        localStorage.setItem('userType', usertype);

        alert('OTP verified successfully!');
        onVerified(usertype); // Pass usertype to parent component
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error); // Debugging log
      setError('An error occurred while verifying the OTP.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/resend-otp.php', { id: userId });
      if (response.data.success) {
        alert('OTP resent successfully!');
        setResendDisabled(true);
        setCooldown(60); // Set cooldown to 60 seconds
      } else {
        alert(response.data.message || 'Could not resend OTP. Try again later.');
      }
    } catch (error) {
      console.error('Error during OTP resend:', error); // Debugging log
      alert('An error occurred while resending the OTP.');
    }
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setResendDisabled(false);
    }
  }, [cooldown]);

  return (
    <div className="otp-overlay">
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <button onClick={handleVerifyOtp}>Verify OTP</button>
      <button onClick={handleResendOtp} disabled={resendDisabled}>
        {resendDisabled ? `Resend OTP (${cooldown}s)` : 'Resend OTP'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default VerifyOtpOverlay;
