import { storage } from '../services/storage.service.js';

export const getDemoUsers = async (req, res) => {
  try {
    const users = await storage.getUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, role } = req.body;
    let user = null;

    if (email) {
      user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    } else if (role) {
      const users = await storage.getUsers();
      user = users.find((u) => u.role === role);
      if (!user) {
        user = users[0];
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

export const signup = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existing = await storage.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const user = await storage.createUser({ name, email, role });
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

export const getCurrentUser = async (req, res) => {
  try {
    const users = await storage.getUsers();
    const user = users[0] || null;
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
