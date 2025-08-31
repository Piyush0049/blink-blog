import connectToDatabase from '@/config/db';
import Blog from '@/models/blogmodel';
import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: process.env.REDIS_URL.startsWith("rediss://"),
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

let redisConnected = false;

async function connectRedis() {
  if (!redisConnected) {
    client.on("connect", () => console.log("✅ Redis connected"));
    client.on("error", (err) => console.error("❌ Redis Error", err));
    await client.connect();
    redisConnected = true;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectRedis();

    // 1. Try fetching from cache
    const cachedBlogs = await client.get("blogs");
    if (cachedBlogs) {
      return res.status(200).json({ blogs: JSON.parse(cachedBlogs), cache: true });
    }

    // 2. If not cached, fetch from MongoDB
    await connectToDatabase();
    const blogs = await Blog.find().sort({ createdAt: -1 });

    const formattedBlogs = blogs.map((blog) => ({
      ...blog._doc,
      tags: blog.relatedTo,
    }));
    await client.setEx("blogs", 3600, JSON.stringify(formattedBlogs));

    return res.status(200).json({ blogs: formattedBlogs, cache: false });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
