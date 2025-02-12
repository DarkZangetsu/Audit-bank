import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role?.roleName || 'USER'
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export async function verifyAuth(req) {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get('token');

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function getAuthUser(req) {
  try {
    const decoded = await verifyAuth(req);
    if (!decoded) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error('Get auth user error:', error);
    return null;
  }
}