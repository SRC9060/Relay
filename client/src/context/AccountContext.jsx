import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await api.getAccounts();
      setAccounts(data);
    } catch (e) {
      console.error('Failed to load accounts', e);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const syncAll = async () => {
    setIsSyncing(true);
    try {
      // Simulate sync with realistic network latency
      await new Promise((r) => setTimeout(r, 900));
      for (const acc of accounts) {
        await api.syncAccount(acc.id);
      }
      await fetchAccounts();
      setLastSyncTime(new Date());
    } finally {
      setIsSyncing(false);
    }
  };

  const connectAccount = async (accountData) => {
    const newAcc = await api.connectAccount(accountData);
    await fetchAccounts();
    return newAcc;
  };

  const disconnectAccount = async (id) => {
    await api.disconnectAccount(id);
    if (selectedAccountId === id) {
      setSelectedAccountId('all');
    }
    await fetchAccounts();
  };

  const selectedAccount =
    selectedAccountId === 'all'
      ? null
      : accounts.find((a) => a.id === selectedAccountId) || null;

  return (
    <AccountContext.Provider
      value={{
        accounts,
        selectedAccountId,
        setSelectedAccountId,
        selectedAccount,
        isSyncing,
        lastSyncTime,
        syncAll,
        connectAccount,
        disconnectAccount,
        refreshAccounts: fetchAccounts
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccounts() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
}
