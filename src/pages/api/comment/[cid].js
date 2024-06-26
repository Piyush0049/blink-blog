import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
import jwt from "jsonwebtoken"
import User from '@/models/usermodel';

connectToDatabase();

export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { text, author, blogid } = req.body;


    try {
        const blog = await Blog.findById(blogid);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const decoded = jwt.verify(author, process.env.JWT_SECRET);

        const userid = decoded.userId;

        const user = await User.findById(userid);

        const newComment = {
            text,
            author : user.name,
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
