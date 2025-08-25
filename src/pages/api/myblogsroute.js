import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
const cookie = require('cookie');
import jwtDecode from "jwt-decode";

connectToDatabase();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const tokenvalue = cookies.token;

    if (!tokenvalue) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const decoded = jwtDecode(tokenvalue);
    const userId = decoded.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    console.log(blogs);
    return res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
