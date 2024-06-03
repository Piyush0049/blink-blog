// pages/api/getAllBlogs.js

import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';

connectToDatabase();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const blogs = await Blog.find();

    return res.status(200).json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
