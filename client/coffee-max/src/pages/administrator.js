import React from 'react'
import AdminPage from 'src/komponente/Admin'
import { AuthContexProvider } from '../../context/AuthContext';

const administrator = () => {
  return (
    <AuthContexProvider><AdminPage /></AuthContexProvider>
  )
}

export default administrator