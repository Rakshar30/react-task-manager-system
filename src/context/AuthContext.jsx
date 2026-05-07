import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const USERS = [
  { id: 1, name: 'Admin User', role: 'admin', email: 'admin@task.com' },
  { id: 2, name: 'Standard User', role: 'user', email: 'user@task.com' }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (id) => {
    const user = USERS.find(u => u.id === id);
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);