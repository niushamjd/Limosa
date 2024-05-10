import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from "../utils/config";
import "../styles/update-password.css";

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: password }),
      });
      if (!response.ok) throw new Error('Failed to reset password');
      alert('Password reset successfully');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login__container">
    <form onSubmit={handleSubmit} className="login__form">
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit" className="auth__btn">Reset Password</button>
    </form>
  </div>
  );
};

export default UpdatePassword;
