import connectToDatabase from '@/config/db';
import User from '@/models/usermodel';
import cookie from 'cookie';
import jwtDecode from 'jwt-decode';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const cookies = cookie.parse(req.headers.cookie || '');
      const tokenvalue = cookies.token;

      if (!tokenvalue) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }

      let decoded;
      try {
        decoded = jwtDecode(tokenvalue);
      } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // ✅ Fetch public profile details only
      const otherUser = await User.findById(id).select("_id name image bio interests createdAt");

      if (!otherUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        message: "User details fetched successfully",
        user: otherUser,
      });
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
