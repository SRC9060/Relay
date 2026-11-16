import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const demoRole = params?.get('demo');
    if (demoRole) {
      const demoUser =
        demoRole === 'client'
          ? {
              id: 'user_client_01',
              name: 'Marcus Vance',
              email: 'marcus.vance@vancetech.io',
              role: 'client',
              title: 'Founder & Managing Partner',
              avatar: 'MV',
              assistantName: 'Elena Rostova',
              assistantId: 'user_assistant_01'
            }
          : {
              id: 'user_assistant_01',
              name: 'Elena Rostova',
              email: 'elena.rostova@relay-assistant.io',
              role: 'assistant',
              title: 'Senior Executive Assistant',
              avatar: 'ER',
              clientName: 'Marcus Vance',
              clientId: 'user_client_01'
            };
      localStorage.setItem('relay_auth_user', JSON.stringify(demoUser));
      localStorage.setItem('relay_auth_token', `mock_token_${demoUser.id}`);
      return demoUser;
    }
    const cached = localStorage.getItem('relay_auth_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('relay_auth_token'));
  const [loading, setLoading] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);

  useEffect(() => {
    api.getDemoUsers().then(setDemoUsers).catch(console.error);
  }, []);

  const login = async ({ email, role }) => {
    setLoading(true);
    try {
      const data = await api.login({ email, role });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('relay_auth_user', JSON.stringify(data.user));
      localStorage.setItem('relay_auth_token', data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ name, email, role }) => {
    setLoading(true);
    try {
      const data = await api.signup({ name, email, role });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('relay_auth_user', JSON.stringify(data.user));
      localStorage.setItem('relay_auth_token', data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = async (targetRole) => {
    return login({ role: targetRole });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('relay_auth_user');
    localStorage.removeItem('relay_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoUsers,
        login,
        signup,
        switchRole,
        logout,
        isAuthenticated: !!user,
        isAssistant: user?.role === 'assistant',
        isClient: user?.role === 'client'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
