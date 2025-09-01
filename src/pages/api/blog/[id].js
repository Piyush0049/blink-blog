import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
import cookie from 'cookie';
import jwtDecode from 'jwt-decode';

export default async function handler(req, res) {
  await connectToDatabase();

  const {
    query: { id },
    method,
  } = req;

  const cookies = cookie.parse(req.headers.cookie || '');
  const tokenvalue = cookies.token;

  if (!tokenvalue) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  let userId;
  try {
    const decoded = jwtDecode(tokenvalue);
    userId = decoded.userId;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  switch (method) {
    case "GET":
      try {
        const blog = await Blog.findById(id);
        if (!blog) {
          return res.status(404).json({ error: "Blog not found" });
        }
        if (blog.author.toString() !== userId) {
          return res.status(403).json({ error: "Forbidden - Not your blog" });
        }
        return res.status(200).json(blog);
      } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }

    case "PUT":
      try {
        const { title, blogText, url, type } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.author.toString() !== userId) {
          return res.status(403).json({ message: "Not allowed to edit this blog" });
        }

        blog.title = title || blog.title;
        blog.blogText = blogText || blog.blogText;
        blog.media = url ? { url, type: type || "image" } : blog.media;

        await blog.save();

        return res.status(200).json({ message: "Blog updated successfully", blog });
      } catch (error) {
        console.error("Error updating blog:", error);
        return res.status(500).json({ message: "Server error" });
      }

    case "DELETE":
      try {
        const blog = await Blog.findById(id);
        if (!blog) {
          return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.author.toString() !== userId) {
          return res.status(403).json({ message: "Not allowed to delete this blog" });
        }

        await blog.deleteOne();

        return res.status(200).json({ message: "Blog deleted successfully" });
      } catch (error) {
        console.error("Error deleting blog:", error);
        return res.status(500).json({ message: "Server error" });
      }

    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}
