import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../lib/db';
import { getUserFromToken, hashPassword } from '../../../../lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const db = await getDB();

    // Get orders — real DB column is "createdAt" not "created_at"
    const ordersResult = await db.execute({
      sql: 'SELECT * FROM orders WHERE user_id = ? ORDER BY createdAt DESC',
      args: [user.id as string],
    });

    const orders = ordersResult.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      total: row.total,
      status: row.status,
      items: (() => {
        try { return JSON.parse((row.items as string) || '[]'); }
        catch { return []; }
      })(),
      address: row.address,
      created_at: row.createdAt, // normalize to frontend expected field
    }));

    const isPlaceholder = (n?: string | null) => {
      if (!n) return true;
      const lower = n.toLowerCase().trim();
      return lower === '' || lower.startsWith('gtaw-') || lower.includes('@') || lower === 'membre gta:world' || lower === 'personnage non défini';
    };

    let characters: string[] = [];
    let character_name = '';
    let ucp_username = '';
    if (user.preferences) {
      try {
        const pref = JSON.parse(user.preferences as string);
        if (Array.isArray(pref.characters)) {
          characters = pref.characters.filter((c: string) => !isPlaceholder(c));
        }
        if (pref.active_character && !isPlaceholder(pref.active_character)) {
          character_name = pref.active_character;
        }
        if (pref.ucp_username && !isPlaceholder(pref.ucp_username)) {
          ucp_username = pref.ucp_username;
        }
      } catch {}
    }

    const userName = (user.name as string) || '';
    if (!character_name && !isPlaceholder(userName)) {
      character_name = userName;
    }
    if (character_name && !characters.includes(character_name)) {
      characters.unshift(character_name);
    }
    const cleanDisplayName = character_name || ucp_username || '';

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: cleanDisplayName,
      character_name: character_name,
      characters,
      ucp_username,
      role: user.role,
      avatar: user.avatar || '',
      vip_level: user.vip_level || 'standard',
      loyalty_points: user.loyalty_points || 0,
      orders,
    });
  } catch (error: any) {
    console.error('[Profile GET] Error:', error?.message || error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromToken(authHeader);

    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const db = await getDB();
    const updates: string[] = [];
    const args: any[] = [];

    // Extract or initialize preferences
    let existingPref: any = {};
    try {
      if (user.preferences) existingPref = JSON.parse(user.preferences as string);
    } catch {}

    let updatedCharacters = existingPref.characters || [];
    let updatedActiveChar = existingPref.active_character || user.name;

    if (body.character_name) {
      updatedActiveChar = body.character_name.trim();
      if (!updatedCharacters.includes(updatedActiveChar)) {
        updatedCharacters.push(updatedActiveChar);
      }
    }

    if (Array.isArray(body.characters)) {
      updatedCharacters = Array.from(new Set([...updatedCharacters, ...body.characters])).filter(Boolean);
    }

    if (body.character_name || body.characters) {
      existingPref.characters = updatedCharacters;
      existingPref.active_character = updatedActiveChar;
      updates.push('preferences = ?');
      args.push(JSON.stringify(existingPref));

      // Also sync user.name to active character
      updates.push('name = ?');
      args.push(updatedActiveChar);
    } else if (body.name) {
      updates.push('name = ?');
      args.push(body.name);
    }

    if (body.password) {
      const hash = await hashPassword(body.password);
      updates.push('password = ?');
      args.push(hash);
    }

    if (body.avatar !== undefined) {
      updates.push('avatar = ?');
      args.push(body.avatar);
    }

    if (updates.length > 0) {
      args.push(user.id);
      await db.execute({
        sql: `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        args,
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: updatedActiveChar || body.name || user.name,
        character_name: updatedActiveChar || body.name || user.name,
        characters: updatedCharacters,
        ucp_username: existingPref.ucp_username || '',
        role: user.role,
        avatar: body.avatar ?? user.avatar,
        vip_level: user.vip_level,
        loyalty_points: user.loyalty_points,
      },
    });
  } catch (error: any) {
    console.error('[Profile PUT] Error:', error?.message || error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
