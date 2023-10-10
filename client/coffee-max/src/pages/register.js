import React from 'react';
import Register from '../komponente/Register';
import { AuthContexProvider } from '../../context/AuthContext';
const RegisterPage = () => {
  return (
    <AuthContexProvider><Register /></AuthContexProvider>
  );
};

export default RegisterPage;