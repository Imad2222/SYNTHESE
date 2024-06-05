// ForgotPassword.js

import  { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/password/email', { email });
      alert('Email sent successfully');
    } catch (error) {
      alert('Email could not be sent');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ForgotPassword;
