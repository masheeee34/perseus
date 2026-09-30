import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_ID = '40';
const CLIENT_SECRET = process.env.GTAW_CLIENT_SECRET;
const REDIRECT_URI = 'https://perseusshopp.duckdns.org/oauth/callback';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Code d\'autorisation manquant' }, { status: 400 });
    }

    let gtawUser: any = null;
    let characters: string[] = [];
    let activeCharacter: string = '';

    // 1. Echange du code d'autorisation contre le token OAuth GTA:World France
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('redirect_uri', REDIRECT_URI);
      params.append('code', code);

      const tokenRes = await fetch('https://ucp-fr.gta.world/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PerseusLuxury/1.0',
        },
        body: params.toString(),
      });

      if (tokenRes.ok) {
        const tokenData = await tokenRes.json();
        console.log('[GTAW Token Success]:', tokenData.token_type, tokenData.expires_in);

        // 2. Recuperation des donnees du compte et personnages in-game
        const userRes = await fetch('https://ucp-fr.gta.world/api/user', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PerseusLuxury/1.0',
          },
        });

        if (userRes.ok) {
          gtawUser = await userRes.json();
          console.log('[GTAW User Payload Keys]:', Object.keys(gtawUser));
        }

        // Fallback endpoint specifique /api/character si necessaire
        if (!gtawUser?.user?.character && !gtawUser?.character && !gtawUser?.characters) {
          try {
            const charRes = await fetch('https://ucp-fr.gta.world/api/character', {
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0',
              },
            });
            if (charRes.ok) {
              const charData = await charRes.json();
              if (Array.isArray(charData)) {
                for (const c of charData) {
                  const name = typeof c === 'string' ? c : (c.character_name || c.name || `${c.firstname || ''} ${c.lastname || ''}`.trim());
                  if (name && name.length > 2) characters.push(name);
                }
              }
            }
          } catch (cErr) {
            console.warn('[GTAW Char endpoint warning]:', cErr);
          }
        }
      } else {
        const errText = await tokenRes.text();
        console.warn('[GTAW Token Exchange Error]:', tokenRes.status, errText);
      }
    } catch (apiErr) {
      console.warn('[GTAW API Token Exchange Warning]:', apiErr);
    }

    // 3. Extraction robuste du compte GTA:World et des personnages (format Crush / GTAW officiel)
    const userData = gtawUser?.user || gtawUser || {};
    const rawChars = userData?.character || userData?.characters || gtawUser?.character || gtawUser?.characters || [];

    if (Array.isArray(rawChars)) {
      for (const c of rawChars) {
        if (typeof c === 'string' && c.trim().length > 1) {
          characters.push(c.trim());
        } else if (c && typeof c === 'object') {
          const fn = c.firstname || c.first_name || '';
          const ln = c.lastname || c.last_name || '';
          const fullName = `${fn} ${ln}`.trim();
          if (fullName && fullName.length > 2) {
            characters.push(fullName);
          } else if (c.character_name) {
            characters.push(c.character_name.trim());
          } else if (c.name) {
            characters.push(c.name.trim());
          }
        }
      }
    }

    if (userData?.character_name && !characters.includes(userData.character_name)) {
      characters.unshift(userData.character_name);
    }
    if (userData?.active_character && !characters.includes(userData.active_character)) {
      characters.unshift(userData.active_character);
    }

    // Deduplication
    characters = Array.from(new Set(characters)).filter(n => n && n.length > 2);

    const ucpUsername = userData?.username || userData?.name || 'Membre GTA:World';
    activeCharacter = characters[0] || '';
    const userId = userData?.id ? `gtaw-${userData.id}` : `gtaw-${Date.now()}`;
    const email = userData?.email || `${userId}@ucp-fr.gta.world`;

    const preferencesObj = {
      characters: characters,
      active_character: activeCharacter,
      ucp_username: ucpUsername
    };

    const cleanDisplayName = activeCharacter || ucpUsername || '';

    try {
      const db = await getDB();
      await db.execute({
        sql: `INSERT INTO users (id, email, name, password, role, preferences, vip_level, loyalty_points)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(email) DO UPDATE SET 
                name=excluded.name,
                preferences=excluded.preferences`,
        args: [
          userId, 
          email, 
          cleanDisplayName, 
          'OAUTH_GTAW', 
          'client', 
          JSON.stringify(preferencesObj), 
          'standard', 
          1250
        ],
      });
    } catch (dbErr) {
      console.warn('[DB User Insert]:', dbErr);
    }

    const token = jwt.sign(
      { id: userId, email, name: cleanDisplayName, role: 'client' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const userObj = {
      id: userId,
      email,
      name: cleanDisplayName,
      character_name: activeCharacter,
      characters: characters,
      ucp_username: ucpUsername,
      role: 'client',
      vip_level: 'standard',
      loyalty_points: 1250,
      orders: []
    };

    return NextResponse.json({ ok: true, token, user: userObj });
  } catch (error: any) {
    console.error('[GTAW Callback Error]:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
