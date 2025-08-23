import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
const cookie = require('cookie');
import jwtDecode from "jwt-decode";

connectToDatabase();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const cookies = cookie.parse(req.headers.cookie || '');

  const tokenvalue = cookies.token;
  console.log(tokenvalue);

  const { title, blogText, url, type } = req.body;

  const decoded = jwtDecode(tokenvalue);
  console.log(decoded);
  if (!title || !decoded.userId || !blogText) {
    return res.status(400).json({ message: 'Please provide title, author, and blog text' });
  }

  try {

    const newBlog = new Blog({
      title,
      author: decoded.userId,
      blogText,
      media: {
        url: url,
        type: type
      },
    });

    const savedBlog = await newBlog.save();

    return res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
