import User from '../models/user.model.js';
import { generateToken } from '../utils/jwt.util.js';

export const registerUser = async (userData) => {
  const userExists = await User.findOne({ email: userData.email });
  if (userExists) throw new Error('User already exists');

  const user = await User.create(userData);
  const token = generateToken(user._id, user.role);

  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) throw new Error('Invalid credentials or inactive account');

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = generateToken(user._id, user.role);

  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};
