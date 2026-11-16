import { storage } from '../services/storage.service.js';

export const getAccounts = (req, res) => {
  try {
    const accounts = storage.getAccounts();
    res.json({ success: true, data: accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const connectAccount = (req, res) => {
  try {
    const { provider, emailAddress, name } = req.body;
    if (!provider || !emailAddress) {
      return res.status(400).json({ success: false, message: 'Provider and emailAddress are required' });
    }

    const account = storage.connectAccount({ provider, emailAddress, name });
    res.status(201).json({
      success: true,
      message: 'Simulated account connected successfully',
      data: account
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const syncAccount = (req, res) => {
  try {
    const { id } = req.params;
    const account = storage.updateAccountSync(id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({
      success: true,
      message: 'Account synchronization completed (simulated)',
      data: account
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const disconnectAccount = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = storage.disconnectAccount(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.json({
      success: true,
      message: 'Account disconnected successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
