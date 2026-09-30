import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { hashPassword, generateToken } from '../../../../lib/auth';
import { v4 as uuidv4 } from 'uuid';
import PerseusLogger from '../../../../lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    const db = await getDB();

    // Check if email already exists
    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà' }, { status: 409 });
    }

    const userId = uuidv4();
    const passwordHash = await hashPassword(password);

    // Real DB column is "password" (not "password_hash")
    await db.execute({
      sql: 'INSERT INTO users (id, email, password, name, role, vip_level, loyalty_points) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [userId, email, passwordHash, name, 'customer', 'standard', 0],
    });

    PerseusLogger.auth(`Nouvelle inscription : ${email} (${name})`, { 
      id: userId, 
      email, 
      name 
    });

    const token = generateToken(userId);

    return NextResponse.json({
      token,
      user: {
        id: userId,
        email,
        name,
        role: 'customer',
        avatar: '',
        vip_level: 'standard',
        loyalty_points: 0,
      },
    });
  } catch (error: any) {
    console.error('[Register] Error:', error?.message || 'Unknown error');
    PerseusLogger.error(`Échec Inscription`, { error: error?.message || 'Unknown error' });
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
