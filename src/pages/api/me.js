import connectToDatabase from '@/config/db';
import User from '@/models/usermodel';
import cookie from 'cookie';
import jwtDecode from 'jwt-decode';

export default async function handler(req, res) {
  await connectToDatabase();

  const cookies = cookie.parse(req.headers.cookie || '');
  const tokenvalue = cookies.token;

  if (!tokenvalue) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  let userId;
  try {
    const decoded = jwtDecode(tokenvalue);
    userId = decoded.userId;
    if (req.method === 'GET') {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User Found!', user });
    }
    if (req.method === 'PUT') {
      const { name, email, image, bio, interests } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email }),
          ...(image !== undefined && { image }),
          ...(bio !== undefined && { bio }),
          ...(interests !== undefined && { interests }),
        },
        { new: true, runValidators: true, select: '-password' }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser,
      });
    }
    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
