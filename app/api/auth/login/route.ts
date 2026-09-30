import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { comparePassword, generateToken } from '../../../../lib/auth';
import PerseusLogger from '../../../../lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }

    const db = await getDB();
    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const user = result.rows[0] as any;

    const storedPassword = user.password as string;
    if (!storedPassword) {
      return NextResponse.json({ error: 'Erreur de configuration du compte' }, { status: 500 });
    }

    const validPassword = await comparePassword(password, storedPassword);
    if (!validPassword) {
      return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
    }

    const token = generateToken(user.id as string);

    PerseusLogger.auth(`Connexion réussie : ${user.email} (${user.name})`, { 
      id: user.id, 
      email: user.email, 
      vip: user.vip_level 
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar || '',
        vip_level: user.vip_level || 'standard',
        loyalty_points: user.loyalty_points || 0,
      },
    });
  } catch (error: any) {
    console.error('[Login] Error:', error?.message || error);
    PerseusLogger.error(`Échec critique lors de la connexion`, { error: error.message });
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? `Erreur: ${error.message}` : 'Erreur serveur' },
      { status: 500 }
    );
  }
}
