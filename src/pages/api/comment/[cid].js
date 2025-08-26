import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
import jwt from "jsonwebtoken"
import User from '@/models/usermodel';
import cookie from 'cookie';
import jwtDecode from 'jwt-decode';

connectToDatabase();

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { text, author, blogid } = req.body;


    try {
        const cookies = cookie.parse(req.headers.cookie || '');
        const tokenvalue = cookies.token;
        const blog = await Blog.findById(blogid);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        if (!tokenvalue) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        let decoded;
        try {
            decoded = jwtDecode(tokenvalue);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
            }
            const user = await User.findById(decoded.userId);

        const newComment = {
            text,
            userId: user._id,
            author: user.name,
            createdAt: new Date()
        };

        blog.comments.push(newComment);

        await blog.save();

        res.status(200).json({ message: 'Comment added successfully', blog });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
};
