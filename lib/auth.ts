import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getDB } from './db';

const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserFromToken(authHeader: string | null) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '');
  const payload = verifyToken(token);
  if (!payload) return null;

  const db = await getDB();
  const result = await db.execute({
    // Real DB columns: id, email, name, role, avatar, vip_level, loyalty_points, preferences, createdAt
    sql: 'SELECT id, email, name, role, avatar, vip_level, loyalty_points, preferences FROM users WHERE id = ?',
    args: [payload.userId],
  });

  if (result.rows.length === 0) return null;
  return result.rows[0];
}
