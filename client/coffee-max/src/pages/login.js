import React from 'react';
import Login from '../komponente/Login';
import { AuthContexProvider } from '../../context/AuthContext';
const LoginPage = () => {
  return (
    <AuthContexProvider><Login /></AuthContexProvider>
  );
};

export default LoginPage;