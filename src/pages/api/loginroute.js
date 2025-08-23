import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/config/db';
import User from '@/models/usermodel';
import cookie from 'cookie';

connectToDatabase();

export default async function handler(req, res) {
  console.log("Login route hit");
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      maxAge: 3600, 
      sameSite: 'strict',
      path: '/', 
      secure: process.env.NODE_ENV === 'production'
    }));

    return res.status(200).json({ message: 'Login successful!', user: { name: user.name, email: user.email, token : token } });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
