import { storage } from '../services/storage.service.js';

export const getDemoUsers = (req, res) => {
  try {
    const users = storage.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = (req, res) => {
  try {
    const { email, role } = req.body;
    let user = null;

    if (email) {
      user = storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else if (role) {
      user = storage.getUsers().find((u) => u.role === role);
      if (!user) {
        user = storage.getUsers()[0];
      }
    } else {
      return res.status(400).json({ success: false, message: 'Email or role required' });
    }

    res.json({
      success: true,
      data: {
        user,
        token: `mock_jwt_${user.id}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const signup = (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existing = storage.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = storage.createUser({ name, email, role });
    res.status(201).json({
      success: true,
      data: {
        user,
        token: `mock_jwt_${user.id}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCurrentUser = (req, res) => {
  try {
    // Returns default active assistant for demo simplicity
    const user = storage.getUsers()[0];
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
