
"use client";
import React from 'react';
import { AuthProvider } from './AuthContext';
import { DataProvider } from './DataContext';

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthProvider>
  );
};

export default AppProvider;
