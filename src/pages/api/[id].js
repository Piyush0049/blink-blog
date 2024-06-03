import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
import User from '@/models/usermodel';

connectToDatabase();

export default async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const { id } = req.query;
    try {
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        const user = await User.findById(blog.author);

        res.status(200).json({blogdet : blog, userdet : user});
        console.log(blog, user)
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Error fetching blog' });
    }
};



