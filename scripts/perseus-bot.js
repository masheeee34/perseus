const { 
  Client, 
  GatewayIntentBits, 
  Partials,
  ChannelType,
  ActivityType, 
  SlashCommandBuilder, 
  REST, 
  Routes, 
  EmbedBuilder
} = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = '1487801979395641354';
const GUILD_ID = '1186798156118241340';
const CONFECTION_CHANNEL_ID = '1189827396271079424';
const CMD_CHANNEL_ID = '1542105834987847732';
const VOICE_CHANNEL_ID = '1543311522929971240';

// Public/Free Imgur Client ID for GTA:W image hosting
const IMGUR_CLIENT_ID = '546c25a59c58ad7';
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

const ASSETS_DIR = path.join(__dirname, '../public/assets/bijoux/trier');
const CATALOG_PATH = path.join(__dirname, '../lib/catalog.ts');
const DB_JSON_PATH = path.join(__dirname, '../data/jewelry_db.json');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}
if (!fs.existsSync(path.dirname(DB_JSON_PATH))) {
  fs.mkdirSync(path.dirname(DB_JSON_PATH), { recursive: true });
}

let cachedJewelry = [];

function loadCachedJewelry() {
  if (fs.existsSync(DB_JSON_PATH)) {
    try {
      cachedJewelry = JSON.parse(fs.readFileSync(DB_JSON_PATH, 'utf-8'));
    } catch (e) {
      cachedJewelry = [];
    }
  }
}
loadCachedJewelry();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});

// Helper: Download image
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const clientHttp = url.startsWith('https') ? https : http;
    
    clientHttp.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return resolve(false);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', () => {
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

// Upload buffer to Imgur API
function uploadBufferToImgur(imageBuffer) {
  return new Promise((resolve) => {
    const base64Data = imageBuffer.toString('base64');
    const postData = JSON.stringify({ image: base64Data, type: 'base64' });

    const options = {
      hostname: 'api.imgur.com',
      path: '/3/image',
      method: 'POST',
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.success && parsed.data && parsed.data.link) {
            resolve(parsed.data.link);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}


// Upload buffer to ImgBB API (GTA:W Whitelisted i.ibb.co)
function uploadBufferToImgBB(imageBuffer, filename = 'perseus_marker') {
  return new Promise((resolve) => {
    const querystring = require('querystring');
    const postData = querystring.stringify({
      key: IMGBB_API_KEY,
      image: imageBuffer.toString('base64'),
      name: filename
    });

    const options = {
      hostname: 'api.imgbb.com',
      path: '/1/upload',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.success && parsed.data) {
            const link = (parsed.data.image && parsed.data.image.url) || parsed.data.display_url || parsed.data.url;
            resolve(link);
          } else {
            console.error('❌ [ImgBB] Erreur upload:', body);
            resolve(null);
          }
        } catch (e) {
          console.error('❌ [ImgBB] Parse error:', e.message);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ [ImgBB] Network error:', err.message);
      resolve(null);
    });
    req.write(postData);
    req.end();
  });
}

function normalizeStr(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function levenshtein(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function calculateSimilarity(s1, s2) {
  const norm1 = normalizeStr(s1);
  const norm2 = normalizeStr(s2);
  if (norm1 === norm2) return 1.0;
  if (norm1.includes(norm2) || norm2.includes(norm1)) return 0.9;
  const maxLen = Math.max(norm1.length, norm2.length);
  if (maxLen === 0) return 1.0;
  return 1 - (levenshtein(norm1, norm2) / maxLen);
}

// 🔍 Smart Search with Disambiguation & Category Hinting
function smartSearchJewelry(rawQuery) {
  if (!rawQuery || rawQuery.trim() === '') return { exactMatches: [], bestMatch: null, score: 0, suggestions: [] };
  
  const cleanQ = rawQuery.replace(/^Perseus\s+/i, '').trim();
  const qNorm = normalizeStr(cleanQ);
  const qLower = rawQuery.toLowerCase();
  if (!qNorm) return { exactMatches: [], bestMatch: null, score: 0, suggestions: [] };

  // Detect category keywords in user message
  const isLookingForWatch = qLower.includes('montre') || qLower.includes('horlogerie') || qLower.includes('rolex') || qLower.includes('cartier') || qLower.includes('chrono');
  const isLookingForRing = qLower.includes('bague') || qLower.includes('chevaliere') || qLower.includes('chevalière') || qLower.includes('alliance') || qLower.includes('anneau');
  const isLookingForNecklace = qLower.includes('collier') || qLower.includes('chaine') || qLower.includes('chaîne') || qLower.includes('pendentif') || qLower.includes('ras-du-cou');
  const isLookingForBracelet = qLower.includes('bracelet') || qLower.includes('gourmette') || qLower.includes('jonc');
  const isLookingForBag = qLower.includes('sac') || qLower.includes('maroquinerie') || qLower.includes('cabas') || qLower.includes('pochette') || qLower.includes('perkin');
  const isLookingForClothes = qLower.includes('robe') || qLower.includes('veste') || qLower.includes('costume') || qLower.includes('vetement') || qLower.includes('vêtement') || qLower.includes('kimono') || qLower.includes('pantalon');
  const isLookingForPerfume = qLower.includes('parfum') || qLower.includes('cologne') || qLower.includes('fragrance');
  const isLookingForGrillz = qLower.includes('grillz') || qLower.includes('dent');

  const scored = cachedJewelry.map(item => {
    const itemNorm = normalizeStr(item.name);
    let nameScore = calculateSimilarity(qNorm, item.name);
    
    // Exact word inside user query (e.g. "Orestis" in "Orestis c'est la montre")
    const words = cleanQ.split(/\s+/);
    let exactWordHit = false;
    for (const w of words) {
      if (normalizeStr(w) === itemNorm && itemNorm.length >= 3) {
        nameScore = 1.0;
        exactWordHit = true;
        break;
      }
    }

    const collScore = calculateSimilarity(qNorm, item.collection) * 0.8;
    const catScore = calculateSimilarity(qNorm, item.cat) * 0.7;

    let finalScore = Math.max(nameScore, collScore, catScore);

    // Apply category boost if user specified category
    const itemCatLower = (item.cat + ' ' + (item.desc || '')).toLowerCase();
    if (isLookingForWatch && (itemCatLower.includes('montre') || itemCatLower.includes('horlogerie'))) finalScore += 0.35;
    if (isLookingForRing && (itemCatLower.includes('bague') || itemCatLower.includes('chevalière') || itemCatLower.includes('anneau'))) finalScore += 0.35;
    if (isLookingForNecklace && (itemCatLower.includes('collier') || itemCatLower.includes('chaîne') || itemCatLower.includes('pendentif'))) finalScore += 0.35;
    if (isLookingForBracelet && (itemCatLower.includes('bracelet') || itemCatLower.includes('gourmette'))) finalScore += 0.35;
    if (isLookingForBag && (itemCatLower.includes('sac') || itemCatLower.includes('maroquinerie'))) finalScore += 0.35;
    if (isLookingForClothes && (itemCatLower.includes('couture') || itemCatLower.includes('robe') || itemCatLower.includes('veste') || itemCatLower.includes('vêtement'))) finalScore += 0.35;
    if (isLookingForPerfume && (itemCatLower.includes('parfum') || itemCatLower.includes('eau de'))) finalScore += 0.35;
    if (isLookingForGrillz && itemCatLower.includes('grillz')) finalScore += 0.35;

    return { item, score: finalScore, isExact: exactWordHit || itemNorm === qNorm };
  });

  scored.sort((a, b) => b.score - a.score);

  // Check for multiple exact / top matches with identical names across categories
  const topMatches = scored.filter(s => s.score >= 0.95);
  const distinctTop = [];
  const seenIds = new Set();
  for (const tm of topMatches) {
    if (!seenIds.has(tm.item.id)) {
      seenIds.add(tm.item.id);
      distinctTop.push(tm.item);
    }
  }

  const best = scored[0];
  const suggestions = scored.slice(0, 4).filter(s => s.score > 0.35).map(s => s.item);

  return {
    exactMatches: distinctTop,
    bestMatch: best ? best.item : null,
    score: best ? best.score : 0,
    suggestions: suggestions
  };
}

// ═════════════════════════════════════════════════════════════════════════
// 🍹 CARTE OFFICIELLE DU BEACH CLUB
// ═════════════════════════════════════════════════════════════════════════

const BEACH_CLUB_MENU = {
  spirits: [
    { name: "Don Julio 1942", desc: "Tequila Añejo, 4cl", price: "$350" },
    { name: "Grey Goose VX", desc: "Vodka d'exception avec une touche de Cognac, 4cl", price: "$350" },
    { name: "Johnny Walker Blue Label", desc: "Blended Scotch Whisky, Rare & Exclusive, 4cl", price: "$350" },
    { name: "Dom Pérignon Vintage", desc: "Champagne Brut, Icône de luxe, Coupe 12cl", price: "$800" },
    { name: "Deus Brut des Flandres", desc: "Bière d'exception, méthode champenoise, 75cl", price: "$200" },
  ],
  cocktails: [
    { name: "The Golden Sand", desc: "Champagne, Liqueur de fleur de sureau, Paillettes d'or", price: "$400" },
    { name: "Perseus Sunset", desc: "Gin Tanqueray Ten, Infusion hibiscus, Pamplemousse frais", price: "$400" },
    { name: "Midnight Swim", desc: "Vodka Belvedere, Mûre, Citron vert, Charbon actif", price: "$400" },
  ],
  softs: [
    { name: "Voss Artesian Water", desc: "Still or Sparkling, 80cl", price: "$150" },
    { name: "Alain Milliat Nectar", desc: "Jus de dégustation, Pêche de Vigne ou Yuzu, 33cl", price: "$150" },
    { name: "Seedlip Garden 108", desc: "Spiritueux sans alcool, Tonic Fever-Tree", price: "$150" },
  ]
};

// ═════════════════════════════════════════════════════════════════════════
// 🧠 MOTEUR CONVERSATIONNEL SMS & CONCIERGE NATUREL (HUMAN-LIKE EN MP)
// ═════════════════════════════════════════════════════════════════════════

const SMS_DICTIONARY = {
  'slt': 'salut',
  'cc': 'coucou',
  'wsh': 'salut',
  'yo': 'bonjour',
  'bjr': 'bonjour',
  'bsr': 'bonsoir',
  'cb': 'combien',
  'cbn': 'combien',
  'cmnt': 'comment',
  'jve': 'je veux',
  'jvx': 'je veux',
  'g': "j'ai",
  't': 'tu es',
  'pk': 'pourquoi',
  'pq': 'pourquoi',
  'pcq': 'parce que',
  'bcp': 'beaucoup',
  'stp': "s'il te plaît",
  'svp': "s'il vous plaît",
  'dsl': 'désolé',
  'cv': 'ça va',
  'tkt': "t'inquiète",
  'jsp': 'je ne sais pas',
  'trkl': 'tranquille',
  'frero': 'ami',
  'chef': 'responsable',
  'bg': 'ami',
  'c': "c'est",
  'ouvert': 'ouvert',
  'ferme': 'fermé',
  'bijou': 'bijoux',
  'chaine': 'chaîne',
  'montr': 'montre',
  'bag': 'bague',
  'cmd': 'commande',
  'cmds': 'commandes',
  'taf': 'travail',
  'job': 'recrutement',
  'beach': 'beach club',
  'plage': 'beach club',
  'bar': 'beach club',
  'boisson': 'boissons',
  'alcool': 'alcools',
  'carte': 'carte',
  'menu': 'carte',
  'soiree': 'soirée',
  'transat': 'transats',
  'vip': 'vip',
  'craft': 'confection',
  'creerobjet': 'creerobjet',
  'assignimage': 'assignimage',
  'prix': 'prix',
  'loc': 'localisation',
  'gps': 'localisation',
  'payer': 'paiement',
  'bpayer': 'bpayer',
  'pinv': 'pinv',
  'pub': 'publicité',
  'publicite': 'publicité'
};

function normalizeSMSInput(rawText) {
  if (!rawText) return '';
  const cleaned = rawText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?\!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ');
  const normalizedWords = words.map(w => SMS_DICTIONARY[w] || w);
  return normalizedWords.join(' ');
}

// Conversation generator without any embed, pure natural human tone
async function generateHumanConciergeResponse(userId, userMessage, userName) {
  const norm = normalizeSMSInput(userMessage);

  // 1. Check if user is searching for a jewelry/product item
  const searchResult = smartSearchJewelry(userMessage);

  // If multiple products share the exact same name across different categories (e.g. Orestis Montre vs Orestis Sac)
  if (searchResult.exactMatches && searchResult.exactMatches.length > 1) {
    const items = searchResult.exactMatches;
    let reply = `J'ai trouvé **${items.length} créations différentes** portant ce nom dans nos ateliers :\n\n`;
    
    items.forEach((it, idx) => {
      reply += `✨ **Option ${idx + 1} : ${it.name}** — **$${it.priceStr}**\n` +
        `• Catégorie : *${it.cat}* (${it.collection})\n` +
        `• Craft GTA:W : \`${it.gtawCmd}\`\n` +
        `• Image : \`${it.assignImgCmd}\`\n` +
        `• Fiche : https://perseusshop.duckdns.org/produit/${it.id}\n\n`;
    });

    reply += `Précise-moi si tu cherchais plutôt la montre, le sac, la bague ou le vêtement si tu souhaites plus de détails !`;
    return reply;
  }

  // Single strong match
  if (searchResult.bestMatch && searchResult.score > 0.65) {
    const item = searchResult.bestMatch;
    const greetings = ["Yes !", "Salut !", "Hello,", "Alors pour cette création :"];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    return `${greeting} La pièce **${item.name}** fait partie de notre collection *${item.collection}* (${item.cat}).\n\n` +
      `Elle est affichée à **$${item.priceStr}**.\n\n` +
      `Si tu travailles chez Perseus pour la fabriquer en jeu, voici la commande exacte :\n` +
      `\`${item.gtawCmd}\`\n\n` +
      `Et pour l'image sur l'inventaire :\n` +
      `\`${item.assignImgCmd}\`\n\n` +
      `Tu peux aussi la retrouver en ligne sur notre boutique : https://perseusshop.duckdns.org/produit/${item.id} !`;
  }

  // 2. Beach Club Staff Commands / Aide Employé Beach Club
  if ((norm.includes('beach') || norm.includes('bar')) && (norm.includes('commande') || norm.includes('cmd') || norm.includes('comment') || norm.includes('bpayer') || norm.includes('pinv') || norm.includes('viewmenu') || norm.includes('pub') || norm.includes('publicite'))) {
    return `Salut ! Voici les commandes in-game indispensables pour le service au **Perseus Beach Club** :\n\n` +
      `📋 **Voir la carte & les prix :** \`/viewmenu\`\n` +
      `💳 **Faire payer un client :** \`/bpayer [id] [montant]\`\n` +
      `🍾 **Accéder au stock d'alcools de la propriété :** \`/pinv\` *(si tu possèdes les clés de la prop)*\n` +
      `📢 **Lancer une annonce d'ouverture :** \`/publicite\`\n\n` +
      `Besoin d'aide supplémentaire ou d'une autorisation ? Vois directement avec **.jb11_**, **zineddine** ou moi-même !`;
  }

  // 3. Beach Club Menu & Drinks Details
  if (norm.includes('carte') || norm.includes('menu') || norm.includes('boisson') || norm.includes('cocktail') || norm.includes('dom perignon') || norm.includes('don julio') || norm.includes('grey goose') || norm.includes('whisky') || norm.includes('alcool') || (norm.includes('beach') && norm.includes('prix'))) {
    return `Voici la sélection officielle du **Perseus Beach Club** :\n\n` +
      `🍾 **SPIRITS & CHAMPAGNES :**\n` +
      `• Don Julio 1942 (Tequila Añejo, 4cl) — **$350**\n` +
      `• Grey Goose VX (Vodka d'exception, 4cl) — **$350**\n` +
      `• Johnny Walker Blue Label (Scotch Whisky Rare, 4cl) — **$350**\n` +
      `• Dom Pérignon Vintage (Champagne Brut, Coupe 12cl) — **$800**\n` +
      `• Deus Brut des Flandres (Bière méthode champenoise, 75cl) — **$200**\n\n` +
      `🍹 **SIGNATURE COCKTAILS ($400) :**\n` +
      `• *The Golden Sand* (Champagne, Fleur de sureau, Paillettes d'or)\n` +
      `• *Perseus Sunset* (Gin Tanqueray Ten, Hibiscus, Pamplemousse)\n` +
      `• *Midnight Swim* (Vodka Belvedere, Mûre, Citron vert, Charbon actif)\n\n` +
      `💧 **SOFTS & RAFRAÎCHISSEMENTS ($150) :**\n` +
      `• Voss Artesian Water (Plate ou Gazeuse, 80cl)\n` +
      `• Alain Milliat Nectar (Pêche de Vigne ou Yuzu, 33cl)\n` +
      `• Seedlip Garden 108 (Spiritueux sans alcool & Tonic)\n\n` +
      `En jeu, tape simplement \`/viewmenu\` pour consulter la carte en direct !`;
  }

  // 4. Employee / Staff / Crafting Bijouterie Help
  if (norm.includes('craft') || norm.includes('creerobjet') || norm.includes('assignimage') || norm.includes('confection') || (norm.includes('travaill') && norm.includes('comment'))) {
    return `Hello collègue ! Si tu es en service à la **Bijouterie de Portola Drive**, voici le récap pour t'aider :\n\n` +
      `1. **Création d'un bijou en jeu :**\n` +
      `   Tape \`/bijou <nom>\` dans le Discord pour obtenir instantanément la commande \`/creerobjet\` et le lien direct Imgur pour \`/assignimage\`.\n\n` +
      `2. **Paiement client :**\n` +
      `   Les règlements se font via notre terminal Fleeca ou virement sécurisé. Pense à bien remettre le certificat d'authenticité et le poinçon 24K.\n\n` +
      `3. **Catalogue complet :**\n` +
      `   Tu as les 435 pièces répertoriées en direct sur https://perseusshop.duckdns.org/boutique.\n\n` +
      `Si tu as une question sur un bijou sur-mesure non listé, contacte **.jb11_**, **zineddine** ou moi-même !`;
  }

  // 5. Beach Club General
  if (norm.includes('beach') || norm.includes('plage') || norm.includes('vespucci') || norm.includes('del perro') || norm.includes('cabane') || norm.includes('transat') || norm.includes('soiree')) {
    return `Hello ! Le **Perseus Beach Club** est notre spot exclusif situé sur le front de mer de Vespucci Beach.\n\n` +
      `On y propose cocktails signature, DJ sets, espace transats de luxe et cabanes VIP privatisables. On annonce toutes les dates d'ouverture et soirées directement ici et sur nos réseaux. Passe nous voir dès la prochaine session !`;
  }

  // 6. Recruitment / Job Application
  if (norm.includes('recrutement') || norm.includes('postuler') || norm.includes('travail') || norm.includes('embauche') || norm.includes('cv') || norm.includes('job') || norm.includes('rejoindre')) {
    return `Salut ! On est régulièrement à la recherche de profils soignés et motivés, que ce soit pour le service clientèle et l'orfèvrerie à la **Bijouterie de Portola Drive**, ou pour le service VIP, bar et sécurité au **Perseus Beach Club**.\n\n` +
      `Pour déposer ta candidature, envoie-moi une petite présentation de ton profil (expérience, disponibilités et ce qui te motive chez Perseus), ou contacte directement **.jb11_** ou **zineddine** sur Discord !`;
  }

  // 7. Location / GPS / Opening Hours
  if (norm.includes('ou') || norm.includes('localisation') || norm.includes('adresse') || norm.includes('gps') || norm.includes('situe') || norm.includes('horaire') || norm.includes('quand')) {
    return `La Maison **Perseus** se trouve au cœur du quartier du luxe sur **Portola Drive, Rockford Hills** (Los Santos).\n` +
      `Le **Perseus Beach Club** est quant à lui installé directement sur la plage de **Vespucci Beach**.\n\n` +
      `Pour les horaires d'ouverture des salons privés, les annonces sont publiées en temps réel sur notre serveur. La boutique en ligne reste accessible 24/7 sur https://perseusshop.duckdns.org !`;
  }

  // 8. Custom Orders / Sur-Mesure
  if (norm.includes('sur mesure') || norm.includes('personnalise') || norm.includes('custom') || norm.includes('grillz') || norm.includes('gravure')) {
    return `Bien sûr ! On réalise toutes sortes de créations sur-mesure : bagues uniques, chaînes massives en or 24K, grillz ajustés ou gravures personnalisées.\n\n` +
      `Tu peux nous décrire ton projet (matières, pierres souhaitées, budget approximatif) ou envoyer une photo de référence ici même, et nos maîtres joailliers étudieront la faisabilité !`;
  }

  // 9. General Greetings / Politeness
  if (norm.includes('bonjour') || norm.includes('salut') || norm.includes('coucou') || norm.includes('yo') || norm.includes('bonsoir') || norm.includes('ca va') || norm.includes('hello')) {
    const greetings = [
      `Bonjour ! Bienvenue à la Maison Perseus. Comment je peux t'aider aujourd'hui ? Que ce soit pour un bijou, une commande, le Beach Club ou une question sur la boutique, dis-moi tout !`,
      `Salut ! Je suis là pour répondre à toutes tes questions sur nos créations joaillières, nos collections, ou les événements du Beach Club. Qu'est-ce qui t'amène ?`,
      `Hello ! Très bien et toi ? Dis-moi ce dont tu as besoin et je t'oriente direct !`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 10. Thanks / Compliments
  if (norm.includes('merci') || norm.includes('parfait') || norm.includes('top') || norm.includes('super') || norm.includes('cimer')) {
    return `Avec grand plaisir ! N'hésite pas si tu as la moindre autre question. Passe une excellente journée et au plaisir de te voir chez Perseus !`;
  }

  // 11. Intelligent Fallback & Escalation to Leadership
  return `Je note bien ta demande ! Si ta question concerne un bijou sur-mesure non répertorié ou une demande particulière, n'hésite pas à contacter directement **.jb11_**, **zineddine** ou moi-même sur Discord pour qu'on s'en occupe personnellement !`;
}

// ═════════════════════════════════════════════════════════════════════════
// 🎙️ CONNEXION AUTOMATIQUE 24/7 AU SALON VOCAL (LOUNGE PERSEUS)
// ═════════════════════════════════════════════════════════════════════════

let voiceConnection = null;

async function connectToVoiceChannel() {
  try {
    const channel = await client.channels.fetch(VOICE_CHANNEL_ID).catch(() => null);
    if (!channel || !channel.isVoiceBased()) {
      console.log(`⚠️ [Perseus Voice] Salon vocal introuvable ou non-vocal: ${VOICE_CHANNEL_ID}`);
      return;
    }

    voiceConnection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: true,
    });

    console.log(`🎙️ [Perseus Voice] Connecté avec succès au salon vocal: "${channel.name}" (${channel.id})`);

    voiceConnection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(voiceConnection, VoiceConnectionStatus.Signalling, 5000),
          entersState(voiceConnection, VoiceConnectionStatus.Connecting, 5000),
        ]);
      } catch (error) {
        voiceConnection.destroy();
        console.log(`🔄 [Perseus Voice] Déconnecté du vocal, reconnexion dans 10 secondes...`);
        setTimeout(connectToVoiceChannel, 10000);
      }
    });

  } catch (err) {
    console.error("❌ Erreur lors de la connexion au salon vocal:", err);
    setTimeout(connectToVoiceChannel, 15000);
  }
}

// ═════════════════════════════════════════════════════════════════════════
// 📩 GESTIONNAIRE DES MESSAGES PRIVÉS (DM / MP) SANS EMBED
// ═════════════════════════════════════════════════════════════════════════

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const isDM = message.channel.type === ChannelType.DM || !message.guild;

  if (isDM) {
    try {
      // 🖼️ 1. Vérification si l'utilisateur envoie une image pour mettre à jour le /cim dynamique
      const imgAttachment = message.attachments.find(att => 
        (att.contentType && att.contentType.startsWith('image/')) ||
        /\.(png|jpe?g|webp|gif)$/i.test(att.name || '')
      );

      if (imgAttachment) {
        await message.channel.sendTyping();
        const markerPath = path.join(__dirname, '../public/marker.png');
        const success = await downloadImage(imgAttachment.url, markerPath);

        if (success) {
          const fileBuf = fs.readFileSync(markerPath);
          const directUrl = await uploadBufferToImgBB(fileBuf, 'perseus_marker');

          if (directUrl) {
            await message.reply({
              content: `🏛️ **AFFICHE GTA WORLD GÉNÉRÉE AVEC SUCCÈS !**\n\n` +
                `✨ Ton image a été enregistrée sur le VPS et uploadée en direct sur **ImgBB** (100% compatible avec la whitelist GTA:W).\n\n` +
                `🎮 **Commandes à taper en jeu (Copier / Coller) :**\n` +
                `\`\`\`bash\n/delinfomarker\n/cim 1 Perseus ${directUrl}\n\`\`\`\n` +
                `🔗 **Lien direct GTA:W :** \`${directUrl}\`\n\n` +
                `💡 *Tape simplement ces deux lignes en jeu, et ton nouveau visuel s'affichera instantanément dès que tu appuies sur K !*`,
              allowedMentions: { repliedUser: false }
            });
            console.log(`🖼️ [Perseus Bot] Image uploadée sur ImgBB par ${message.author.tag}: ${directUrl}`);
            return;
          } else {
            await message.reply("⚠️ Image sauvegardée sur le VPS, mais l'hébergement GTA:W a échoué. Réessaie dans un instant.");
            return;
          }
        } else {
          await message.reply("❌ Impossible de télécharger l'image, merci de réessayer.");
          return;
        }
      }

      // 2. Si le message texte demande de changer l'image sans pièce jointe
      const normText = normalizeStr(message.content);
      if (normText.includes('change') && (normText.includes('image') || normText.includes('affiche') || normText.includes('photo') || normText.includes('cim'))) {
        await message.reply({
          content: `📸 **Pour changer ton affiche GTA World :**\n\n` +
            `Envoie-moi simplement ta photo ou ton affiche en pièce jointe directement ici en message privé !\n` +
            `Je vais la remplacer instantanément sur ton lien dynamique sans que tu aies besoin de changer quoi que ce soit en jeu.`,
          allowedMentions: { repliedUser: false }
        });
        return;
      }
      await message.channel.sendTyping();
      await new Promise(r => setTimeout(r, 600 + Math.random() * 600));

      const replyText = await generateHumanConciergeResponse(
        message.author.id, 
        message.content, 
        message.author.displayName || message.author.username
      );

      await message.reply({
        content: replyText,
        allowedMentions: { repliedUser: false }
      });
      console.log(`💬 [Perseus DM] Répondu à ${message.author.tag}: "${message.content.slice(0, 40)}"`);
    } catch (err) {
      console.error("❌ Erreur lors de la réponse en DM:", err);
    }
  }
});

// ═════════════════════════════════════════════════════════════════════════
// 🔄 SLASH COMMANDS
// ═════════════════════════════════════════════════════════════════════════

async function registerSlashCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('bijou')
      .setDescription('Recherche un bijou Perseus et génère la commande /creerobjet GTA:W')
      .addStringOption(option =>
        option
          .setName('nom')
          .setDescription('Nom ou mot-clé du bijou (ex: Nerisya, Canthée, Rolex, Élysée...)')
          .setRequired(true)
          .setAutocomplete(true)
      ),
    new SlashCommandBuilder()
      .setName('sync-catalogue')
      .setDescription('Force la re-synchronisation complète de l\'Atelier Confection avec le site web'),
  ];

  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ [Perseus Bot] Commandes Slash enregistrées avec succès.");
  } catch (error) {
    console.error("❌ Erreur enregistrement slash:", error);
  }
}

client.on('interactionCreate', async (interaction) => {
  if (interaction.isAutocomplete()) {
    if (interaction.commandName === 'bijou') {
      const focusedValue = interaction.options.getFocused();
      const normFocus = normalizeStr(focusedValue);
      
      const filtered = cachedJewelry
        .filter(choice => normalizeStr(choice.name).includes(normFocus) || normalizeStr(choice.collection).includes(normFocus) || normalizeStr(choice.cat).includes(normFocus))
        .slice(0, 25);

      await interaction.respond(
        filtered.map(choice => ({
          name: `${choice.name} — $${choice.priceStr} [${choice.cat}]`,
          value: choice.id,
        }))
      );
    }
    return;
  }

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'bijou') {
      const selectedValue = interaction.options.getString('nom');
      let item = cachedJewelry.find(j => j.id === selectedValue);
      
      if (!item) {
        const search = smartSearchJewelry(selectedValue);
        item = search.bestMatch;
      }

      if (!item) {
        return interaction.reply({ 
          content: `❌ Aucun bijou trouvé pour \`${selectedValue}\`.`, 
          ephemeral: true 
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0xC5A044)
        .setTitle(`💎 Perseus · ${item.name.toUpperCase()}`)
        .setDescription(`*${item.desc}*`)
        .addFields(
          { name: '🏷️ Catégorie', value: `\`${item.cat}\``, inline: true },
          { name: '📦 Collection', value: `\`${item.collection}\``, inline: true },
          { name: '💵 Prix In-Game', value: `**$${item.priceStr}**`, inline: true },
          { 
            name: '🎮 Commande In-Game GTA:World', 
            value: `\`\`\`bash\n${item.gtawCmd}\n\`\`\``, 
            inline: false 
          },
          { 
            name: '🖼️ Assigner l\'Image GTA:W (Lien Imgur Direct)', 
            value: `\`\`\`bash\n${item.assignImgCmd}\n\`\`\``, 
            inline: false 
          }
        )
        .setImage(item.imageUrl)
        .setFooter({ 
          text: 'Maison Perseus · Portola Drive, Los Santos', 
          iconURL: 'https://perseusshop.duckdns.org/icon.png' 
        })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    }

    if (interaction.commandName === 'sync-catalogue') {
      await interaction.deferReply({ ephemeral: true });
      loadCachedJewelry();
      return interaction.editReply({ 
        content: `✅ Le catalogue du site web a été rechargé (${cachedJewelry.length} pièces actives).` 
      });
    }
  }
});


// ═════════════════════════════════════════════════════════════════════════
// 🔔 SERVEUR INTERNE DE NOTIFICATIONS DE COMMANDE (DM AUX DIRIGEANTS)
// ═════════════════════════════════════════════════════════════════════════

const DIRECTORS_IDS = ['257897203920666625', '282209931598364682'];
const NOTIFY_PORT = 3099;

async function sendOrderNotificationToDirectors(orderData) {
  const {
    orderId = 'ORD-XXXX',
    characterName = 'Client Anonyme',
    address = 'Portola Drive',
    items = [],
    total = 0,
    paymentMethod = 'Fleeca Bank',
    status = 'En attente'
  } = orderData;

  let itemsText = '';
  let gtawCommandsText = '';

  if (Array.isArray(items) && items.length > 0) {
    items.forEach((it, idx) => {
      const itName = it.name || it.title || 'Bijou Perseus';
      const itPrice = it.price ? (typeof it.price === 'number' ? it.price.toLocaleString('en-US') : it.price) : '0';
      const itQty = it.quantity || it.qty || 1;
      itemsText += `• **${itQty}x ${itName}** — **$${itPrice}**\n`;

      // Find item in catalog for exact GTAW command
      const foundInDb = cachedJewelry.find(j => 
        normalizeStr(j.name) === normalizeStr(itName) || j.id === it.id
      );
      if (foundInDb) {
        gtawCommandsText += `\n📦 **${itName} :**\n\`${foundInDb.gtawCmd}\`\n\`${foundInDb.assignImgCmd}\`\n`;
      } else {
        gtawCommandsText += `\n📦 **${itName} :**\n\`/creerobjet goods ${it.price || 25000} ${itQty} Perseus ${itName} | Commande #${orderId}\`\n`;
      }
    });
  } else {
    itemsText = '• Pièce personnalisée sur-mesure\n';
  }

  const formattedTotal = typeof total === 'number' ? total.toLocaleString('en-US') : total;

  const dmContent = `🏛️ **NOUVELLE COMMANDE PERSEUS SHOP !**\n\n` +
    `📦 **Référence :** \`${orderId}\`\n` +
    `👤 **Client :** **${characterName}**\n` +
    `📍 **Adresse de livraison :** ${address}\n` +
    `💵 **Montant Total :** **$${formattedTotal}**\n` +
    `💳 **Moyen de paiement :** ${paymentMethod} (${status})\n\n` +
    `💎 **Détail du Panier :**\n${itemsText}\n` +
    `🎮 **Commandes GTA:World pour le craft & livraison :**${gtawCommandsText}\n` +
    `✨ *Consultez le panneau d'administration sur le site si besoin.*`;

  for (const dirId of DIRECTORS_IDS) {
    try {
      const user = await client.users.fetch(dirId);
      if (user) {
        await user.send({ content: dmContent });
        console.log(`📨 [Perseus Bot] Notification de commande envoyée en DM à ${user.tag} (${dirId})`);
      }
    } catch (e) {
      console.error(`❌ Erreur envoi DM commande à ${dirId}:`, e.message);
    }
  }
}

// Internal HTTP Server for Next.js Webhook
const notifyServer = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/notify-order') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body);
        await sendOrderNotificationToDirectors(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Notification envoyée aux dirigeants.' }));
      } catch (err) {
        console.error('❌ Erreur parsing notification:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

notifyServer.listen(NOTIFY_PORT, '127.0.0.1', () => {
  console.log(`📡 [Perseus Bot] Serveur de notifications interne actif sur http://127.0.0.1:${NOTIFY_PORT}`);
});

client.once('clientReady', async () => {
  console.log(`👑 [Perseus Bot] Connecté en tant que ${client.user.tag}`);
  client.user.setActivity('Maison Perseus & Beach Club · DMs Ouverts', { type: ActivityType.Custom });
  await registerSlashCommands();
  await connectToVoiceChannel();
});

client.login(TOKEN);
