import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
import User from '@/models/usermodel';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    await connectToDatabase();
    let blogs = await Blog.find().sort({ createdAt: -1 });
    const formattedBlogs = await Promise.all(
      blogs.map(async (blog) => {
        let authorObj = null;
        if (blog.author) {
          const author = await User.findById(blog.author);
          if (author) {
            authorObj = author.toObject();
          }
        }
        return {
          ...blog.toObject(),
          author: authorObj,
          tags: blog.relatedTo,
        };
      })
    );
    console.log(formattedBlogs);
    return res.status(200).json({ blogs: formattedBlogs, cache: false });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
