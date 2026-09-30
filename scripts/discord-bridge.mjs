import pkg from 'discord.js';
const { Client, GatewayIntentBits, Events, ChannelType, EmbedBuilder, ActivityType, REST, Routes, SlashCommandBuilder } = pkg;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const ORDER_CHANNEL_ID = process.env.ORDER_CHANNEL_ID || '1274826426629095435'; // Canal commandes principal
const LOGS_GUILD_ID = process.env.LOGS_GUILD_ID;
const MAIN_GUILD_ID = process.env.MAIN_GUILD_ID || '1186798156118241340'; // Serveur Perseus principal
const PORT = process.env.BRIDGE_PORT || 3001;
const APP_ID = process.env.DISCORD_APPLICATION_ID;
const BOT_SECRET = process.env.DISCORD_BOT_SECRET;

// En production sur Hugging Face, on pointe vers Render
const SITE_URL = process.env.SITE_URL || 'https://perseus-new-web-site.onrender.com';
const INTERNAL_API_URL = SITE_URL;
console.log(`🔗 API cible (Next.js) : ${INTERNAL_API_URL}`);

// --- IN-MEMORY PRODUCT CATALOG (16GB BOOST) ---
let PRODUCT_CATALOG = [];
let lastSync = 0;

async function syncCatalog() {
  try {
    console.log('🔄 [Catalog] Synchronisation du catalogue depuis Turso via API...');
    const res = await fetch(`${INTERNAL_API_URL}/api/products?no_cache=true`);
    if (res.ok) {
      PRODUCT_CATALOG = await res.json();
      lastSync = Date.now();
      console.log(`✅ [Catalog] ${PRODUCT_CATALOG.length} produits chargés dans la RAM de Hugging Face.`);
    }
  } catch (err) {
    console.error('❌ [Catalog] Échec de la synchronisation:', err.message);
  }
}

// Sync au démarrage et toutes les 5 minutes
setInterval(syncCatalog, 5 * 60 * 1000);

// --- KEEP-AWAKE PINGER ---
// Le bridge sur Hugging Face (16Go) va pinger Render toutes les 10 mins 
// pour éviter que le site ne s'endorme. Indispensable pour la fluidité.
async function startKeepAlive() {
  const ping = async () => {
    try {
      console.log(`⏱️ [Pulse] Ping Render pour le garder éveillé : ${INTERNAL_API_URL}`);
      const res = await fetch(INTERNAL_API_URL);
      if (res.ok) console.log('💓 [Pulse] Site réveillé et stable.');
    } catch (e) {
      console.warn('⚠️ [Pulse] Render ne répond pas pour le moment.');
    }
  };
  
  // Ping toutes les 10 minutes
  setInterval(ping, 10 * 60 * 1000);
  ping(); // Premier ping immédiat
}

startKeepAlive();


if (!TOKEN || !CHANNEL_ID) {
  if (!TOKEN) console.error('❌ DISCORD_BOT_TOKEN est manquant dans les variables d\'environnement.');
  if (!CHANNEL_ID) console.error('❌ DISCORD_CHANNEL_ID est manquant dans les variables d\'environnement.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

const app = express();
app.use(cors());
app.use(express.json());

// In-memory message store for polling (since we are on localhost)
const messageQueues = new Map(); // sessionId -> Message[]

client.once(Events.ClientReady, async (c) => {
  console.log(`✨ Perseus Support Bridge is Online — Logged in as ${c.user.tag}`);
  
  // DIAGNOSTIC DES SERVEURS
  const guilds = c.guilds.cache.map(g => `${g.name} (${g.id})`);
  console.log(`📡 Bot présent sur les serveurs : [${guilds.join(', ')}]`);
  
  if (LOGS_GUILD_ID) {
    const logGuild = c.guilds.cache.get(LOGS_GUILD_ID);
    if (!logGuild) {
      console.error(`❌ ERREUR : Le bot ne trouve pas le serveur de logs ${LOGS_GUILD_ID}. Vérifie qu'il est bien invité dessus !`);
    } else {
      console.log(`✅ Serveur de logs identifié : ${logGuild.name}`);
    }
  }

  c.user.setActivity('Maison Perseus', { type: ActivityType.Watching });
  
  // Enregistrer les slash commands sur le serveur Perseus principal (instantané)
  if (APP_ID) {
    try {
      const rest = new REST().setToken(TOKEN);
      const commands = [
        new SlashCommandBuilder()
          .setName('approuver')
          .setDescription('✅ Approuver une commande Perseus et créditer les points fidélité')
          .addStringOption(opt =>
            opt.setName('commande_id')
              .setDescription('ID de la commande (ex: ORD-XXXXXXXX)')
              .setRequired(true)
          ),
        new SlashCommandBuilder()
          .setName('refuser')
          .setDescription('❌ Refuser et annuler une commande Perseus')
          .addStringOption(opt =>
            opt.setName('commande_id')
              .setDescription('ID de la commande (ex: ORD-XXXXXXXX)')
              .setRequired(true)
          ),
        new SlashCommandBuilder()
          .setName('ajouter-produit')
          .setDescription('💎 Ajouter une nouvelle pièce au catalogue Perseus')
          .addStringOption(o => o.setName('id').setDescription('ID unique (ex: riv_01)').setRequired(true))
          .addStringOption(o => o.setName('nom').setDescription('Nom du bijou').setRequired(true))
          .addNumberOption(o => o.setName('prix').setDescription('Prix en $').setRequired(true))
          .addStringOption(o => o.setName('categorie').setDescription('ex: Joaillerie - Colliers').setRequired(true))
          .addStringOption(o => o.setName('image').setDescription('Nom du fichier (ex: diamant.png)').setRequired(true))
          .addStringOption(o => o.setName('desc').setDescription('Description luxueuse').setRequired(false)),
        new SlashCommandBuilder()
          .setName('modifier-prix')
          .setDescription('💰 Modifier le prix d\'un bijou')
          .addStringOption(o => o.setName('id').setDescription('ID du produit').setRequired(true))
          .addNumberOption(o => o.setName('prix').setDescription('Nouveau prix en $').setRequired(true)),
        new SlashCommandBuilder()
          .setName('supprimer-produit')
          .setDescription('🗑️ Retirer un bijou du catalogue')
          .addStringOption(o => o.setName('id').setDescription('ID du produit').setRequired(true)),
      ].map(cmd => cmd.toJSON());

      await rest.put(Routes.applicationGuildCommands(APP_ID, MAIN_GUILD_ID), { body: commands });
      console.log(`✅ Slash commands (Stats, Stock & Commandes) enregistrées sur le serveur Perseus (${MAIN_GUILD_ID})`);
    } catch (err) {
      console.error('❌ Erreur enregistrement slash commands:', err.message);
    }
  }
  
  // Initialisation du salon de stats
  await ensureStatsChannel();

  // Démarrer les schedulers
  startDailyReportScheduler();
  startAbandonedCartScheduler();
  startKeepAlive();
  syncCatalog(); // Premier sync
  
  
  // Log de démarrage système
  setTimeout(() => {
    internalLog('system', '🚀 Le système Perseus-Bot est opérationnel (Hugging Face)', { 
      guilds_count: c.guilds.cache.size,
      site_url: SITE_URL,
      time: new Date().toISOString()
    });
  }, 10000);
});

// ─── GESTION DES SLASH COMMANDS ───
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'approuver' || interaction.commandName === 'refuser') {
    const orderId = interaction.options.getString('commande_id', true).toUpperCase().trim();
    const action = interaction.commandName === 'approuver' ? 'approve' : 'reject';

    await interaction.deferReply();

    try {
      const response = await fetch(`${INTERNAL_API_URL}/api/orders/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-bot-secret': BOT_SECRET },
        body: JSON.stringify({ orderId, action }),
      });

      const data = await response.json();
      if (!response.ok) {
        return interaction.editReply({ embeds: [new EmbedBuilder().setTitle('⚠️ Erreur').setDescription(`\`\`\`${data.error}\`\`\``).setColor(0xe74c3c)] });
      }

      const embed = new EmbedBuilder()
        .setTitle(action === 'approve' ? '✅ Commande Approuvée' : '❌ Commande Refusée')
        .setColor(action === 'approve' ? 0x2ecc71 : 0xe74c3c)
        .addFields({ name: 'Référence', value: `\`${orderId}\`` });
      if (data.points_credited) embed.addFields({ name: 'Points', value: `+${data.points_credited}` });
      
      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      await interaction.editReply({ content: `❌ Erreur API: ${err.message}` });
    }
  }

  // --- PRODUCT MANAGEMENT ---
  if (interaction.commandName === 'ajouter-produit') {
    await interaction.deferReply();
    const id = interaction.options.getString('id');
    const name = interaction.options.getString('nom');
    const price = interaction.options.getNumber('prix');
    const cat = interaction.options.getString('categorie');
    const file = interaction.options.getString('image');
    const desc = interaction.options.getString('desc') || '';

    try {
      const dbUrl = `${INTERNAL_API_URL}/api/products`; // Public products read, but we need admin write.
      // Since we are same container, we can talk to admin API if we bypass auth or use a special internal token
      const res = await fetch(`${INTERNAL_API_URL}/api/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Internal ${BOT_SECRET}` }, // Use BOT_SECRET as internal auth
        body: JSON.stringify({ id, name, price, cat, file, desc, categoryAttr: 'cat-bagues' }) // Default attr
      });
      const data = await res.json();
      if (res.ok) {
        await interaction.editReply({ content: `✅ **${name}** a été ajouté au catalogue !` });
      } else {
        await interaction.editReply({ content: `❌ Erreur: ${data.error}` });
      }
    } catch (err) {
      await interaction.editReply({ content: `❌ Erreur API: ${err.message}` });
    }
  }

  if (interaction.commandName === 'modifier-prix') {
    await interaction.deferReply();
    const id = interaction.options.getString('id');
    const price = interaction.options.getNumber('prix');
    try {
      const res = await fetch(`${INTERNAL_API_URL}/api/admin/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Internal ${BOT_SECRET}` },
        body: JSON.stringify({ id, price, priceStr: price.toLocaleString() })
      });
      if (res.ok) await interaction.editReply({ content: `💰 Nouveau prix pour \`${id}\` : **${price}$**` });
      else await interaction.editReply({ content: `❌ Échec.` });
    } catch (err) {
      await interaction.editReply({ content: `❌ Erreur.` });
    }
  }

  if (interaction.commandName === 'supprimer-produit') {
    await interaction.deferReply();
    const id = interaction.options.getString('id');
    try {
      const res = await fetch(`${INTERNAL_API_URL}/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Internal ${BOT_SECRET}` }
      });
      if (res.ok) await interaction.editReply({ content: `🗑️ Produit \`${id}\` supprimé.` });
      else await interaction.editReply({ content: `❌ Échec.` });
    } catch (err) {
      await interaction.editReply({ content: `❌ Erreur.` });
    }
  }
});

// Reusable internal logging logic
async function internalLog(category, message, data = null) {
  // 🛡️ FAIL-SAFE: Si LOGS_GUILD_ID n'est pas défini, on envoie sur le serveur principal
  const targetGuildId = LOGS_GUILD_ID || MAIN_GUILD_ID;
  
  if (!client.isReady()) {
    console.warn('Logger: Client not ready yet, skipping log.');
    return;
  }

  try {
    const guild = await client.guilds.fetch(targetGuildId).catch(() => null);
    if (!guild) {
      console.error(`Logger: Guild ${targetGuildId} not found.`);
      return;
    }

    const channelName = `📊-${category}-logs`;
    // Sync cache first
    await guild.channels.fetch();
    let channel = guild.channels.cache.find(c => c.name === channelName);

    if (!channel) {
      console.log(`📡 Création du salon : ${channelName}...`);
      channel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        reason: 'Automated Logs'
      });
    }

    const colorMap = { 
      auth: 0x3498db,    // Blue
      order: 0x2ecc71,   // Green
      error: 0xe74c3c,   // Red
      system: 0xf1c40f,  // Gold
      chat: 0x9b59b6,    // Purple
      cart: 0x1abc9c,    // Teal
      changelog: 0xD4AF37 // Deep Gold
    };

    const emojiMap = {
      auth: '🔐',
      order: '💎',
      error: '🚨',
      system: '⚙️',
      chat: '💬',
      cart: '🛒',
      changelog: '📣'
    };

    const embed = new EmbedBuilder()
      .setTitle(`${emojiMap[category] || '🗒️'} [PERSEUS] ${category.toUpperCase()}`)
      .setDescription(`**${message}**`)
      .setColor(colorMap[category] || 0xD4AF37)
      .setTimestamp()
      .setFooter({ 
        text: 'Perseus Security & Operations Audit • Los Santos 2026',
        iconURL: 'https://i.imgur.com/8Qp2I3X.png' // Optional: Perseus logo URL
      });

    if (data) {
      // If data is simple, add as fields, otherwise JSON
      if (typeof data === 'object' && Object.keys(data).length <= 5 && !Array.isArray(data)) {
        Object.entries(data).forEach(([key, val]) => {
          embed.addFields([{ 
            name: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '), 
            value: `\`${typeof val === 'object' ? JSON.stringify(val) : val}\``, 
            inline: true 
          }]);
        });
      } else {
        const jsonStr = JSON.stringify(data, null, 2).substring(0, 1000);
        embed.addFields([{ name: 'Détails techniques', value: `\`\`\`json\n${jsonStr}\n\`\`\`` }]);
      }
    }

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error('❌ Internal log CRITICAL error:', err.message);
  }
}

// Sync bot activity with your Spotify
client.on(Events.PresenceUpdate, (oldPresence, newPresence) => {
  if (!newPresence || !newPresence.member) return;
  
  // LOG for debug: see who's updating presence
  console.log(`Presence update: ${newPresence.member.user.tag}`);

  const spotify = newPresence.activities.find(a => a.name === 'Spotify');
  if (spotify) {
    const trackInfo = `${spotify.details} - ${spotify.state}`;
    console.log(`🎵 Spotify detected: ${trackInfo}`);
    client.user.setActivity(trackInfo, { type: ActivityType.Listening });
  } else {
    // Check if it was me who stopped listening
    client.user.setActivity('Maison Perseus', { type: ActivityType.Watching });
  }
});

// Create or find a thread for a user session
async function getThreadForSession(sessionId, userName) {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel || channel.type !== ChannelType.GuildText) {
    throw new Error('Support channel not found or is not a text channel');
  }

  // Search for an active or archived thread containing the sessionId
  const threadResults = await channel.threads.fetch({ active: true });
  const archivedResults = await channel.threads.fetch({ archived: { type: 'public', fetchAll: true } });
  
  let thread = threadResults.threads.find(t => t.name.includes(sessionId)) || 
               archivedResults.threads.find(t => t.name.includes(sessionId));

  if (thread && thread.archived) {
    await thread.setArchived(false); // Re-open if archived
    console.log(`🔓 Thread réouvert: ${thread.name}`);
  }

  if (!thread) {
    thread = await channel.threads.create({
      name: `👑 Support: ${userName || 'Client VIP'} — (${sessionId})`,
      autoArchiveDuration: 60,
      reason: 'Support client Perseus',
    });
    console.log(`🆕 Nouveau thread créé: ${thread.name}`);
    
    await thread.send(`📢 **Nouvelle session de chat ouverte**\nClient: \`${userName || 'Anonyme'}\`\nSession: \`${sessionId}\``);
  }

  return thread;
}

// Replaced empty event listener

// ThreadID -> SessionID mapping
const threadToSession = new Map();

// REST API for the website
app.post('/send', async (req, res) => {
  const { sessionId, userName, message } = req.body;
  console.log(`📩 Reçu du site: [${userName}] ${message} (Session: ${sessionId})`);
  
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || channel.type !== ChannelType.GuildText) {
      throw new Error('Support channel not found');
    }

    const thread = await getThreadForSession(sessionId, userName);
    threadToSession.set(thread.id, sessionId);
    
    console.log(`🧵 Envoi vers le fil Discord: ${thread.name}`);

    // Notification in the main channel to make the thread clickable/visible
    await channel.send(`👑 **Nouveau message de ${userName || 'Client VIP'}**\nClique ici pour répondre: <#${thread.id}>`);

    const embed = new EmbedBuilder()
      .setColor(0xD4AF37)
      .setAuthor({ name: `💎 Client VIP — ${userName || 'Session Active'}` })
      .setDescription(`${message}`)
      .setTimestamp()
      .setFooter({ text: `Session: ${sessionId}` });

    await thread.send({
      embeds: [embed]
    });
    
    res.json({ success: true });
    console.log(`✅ Message envoyé avec succès dans le fil.`);
  } catch (error) {
    console.error('❌ Erreur envoi Discord:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/poll/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const queue = messageQueues.get(sessionId) || [];
  messageQueues.set(sessionId, []); // Clear queue
  res.json({ messages: queue });
});

// ─── PERSEUS RAM-BOOST ENGINE (Optimized for 16GB RAM) ───
// Sert les produits instantanément depuis la RAM de Hugging Face
app.get('/products', (req, res) => {
  const { category, q, sort } = req.query;
  let products = [...PRODUCT_CATALOG];

  if (category) {
    const c = String(category).toLowerCase();
    products = products.filter(p => 
      (p.categoryAttr && p.categoryAttr.toLowerCase().includes(c)) || 
      (p.cat && p.cat.toLowerCase().includes(c)) ||
      (p.tags && p.tags.toLowerCase().includes(c))
    );
  }

  if (q) {
    const search = String(q).toLowerCase();
    products = products.filter(p => 
      p.name?.toLowerCase().includes(search) || 
      p.cat?.toLowerCase().includes(search) || 
      p.desc?.toLowerCase().includes(search) || 
      p.id?.toLowerCase().includes(search) ||
      p.tags?.toLowerCase().includes(search)
    );
  }

  // Sorting logic
  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  else if (sort === 'newest') products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else products.sort((a, b) => a.id.localeCompare(b.id));

  res.json(products);
});

// Endpoint pour un produit spécifique (RAM access)
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = PRODUCT_CATALOG.find(p => p.id === id);
  if (!product) return res.status(404).json({ error: 'Produit introuvable dans la RAM.' });
  res.json(product);
});

// engine de recommandations RAM-BOOST
app.get('/recommendations', (req, res) => {
  const { owned_cats } = req.query; // Les catégories déjà possédées (pour cross-sell)
  let products = [...PRODUCT_CATALOG];
  const catsArr = owned_cats ? String(owned_cats).split(',') : [];

  // 1. Priorité aux pièces exclusives/premium ($$$)
  const premium = products.filter(p => p.is_exclusive === 1 || p.price > 15000);
  
  // 2. Si l'utilisateur a déjà des catégories, on suggère celles qu'il n'a PAS
  let suggested = products.filter(p => 
    !catsArr.includes(p.cat) && !catsArr.includes(p.categoryAttr)
  );
  
  // Mix : 2 premium, 4 suggérés ou aléatoires
  let finalSelection = [];
  
  // On mélange un peu
  const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
  
  finalSelection = [
    ...shuffle(premium).slice(0, 2),
    ...shuffle(suggested).slice(0, 4)
  ];
  
  // Fallback si pas assez de suggérés
  if (finalSelection.length < 6) {
    const remaining = products.filter(p => !finalSelection.find(fs => fs.id === p.id));
    finalSelection = [...finalSelection, ...shuffle(remaining).slice(0, 6 - finalSelection.length)];
  }

  res.json(finalSelection.slice(0, 6)); // Top 6 recommendations
});

// ─── NOTIFICATION DE COMMANDE DANS LE CANAL PRINCIPAL ───
async function sendOrderNotification(data) {
  if (!client.isReady()) {
    console.warn('[Order] Client not ready, skipping order notification.');
    return;
  }
  try {
    let channel = await client.channels.fetch(ORDER_CHANNEL_ID).catch(() => null);
    
    // Auto-discovery if channel not found or unauthorized
    if (!channel) {
      console.warn(`[Order] Canal ID ${ORDER_CHANNEL_ID} introuvable. Recherche par nom...`);
      const guild = client.guilds.cache.get(MAIN_GUILD_ID);
      if (guild) {
        await guild.channels.fetch();
        channel = guild.channels.cache.find(c => 
          c.name.includes('commande') || c.name.includes('order') || c.name.includes('perseus-log')
        );
      }
    }

    if (!channel) {
      console.error(`[Order] ❌ Aucun canal de commande trouvé sur le serveur ${MAIN_GUILD_ID}`);
      return;
    }

    const d = data || {};
    const embed = new EmbedBuilder()
      .setTitle('👑 NOUVELLE ACQUISITION — Perseus')
      .setColor(0xD4AF37)
      .setDescription(`Une nouvelle commande vient d'être enregistrée et attend votre validation.`)
      .addFields(
        { name: '📋 Référence', value: `\`${d.reference || 'N/A'}\``, inline: true },
        { name: '👤 Client', value: d.client || 'Inconnu', inline: true },
        { name: '💰 Montant', value: `**${d.total || '0 $'}**`, inline: true },
        { name: '📦 Articles', value: d.articles || 'Aucun article', inline: false },
        { name: '🏠 Adresse', value: d.adresse || 'Non renseignée', inline: false },
        { name: '⭐ Points en attente', value: d.points_pending || '+0 pts', inline: true },
        { name: '🏷️ Code promo', value: d.coupon || 'Aucun', inline: true },
      )
      .setFooter({ text: `Utilisez /approuver ${d.reference} ou /refuser ${d.reference}` })
      .setTimestamp();

    if (d.image) {
      embed.setThumbnail(d.image);
    }

    const content = `🔔 **Nouvelle commande Perseus à valider !**\n> Tapez \`/approuver ${d.reference || 'ORD-???'}\` pour approuver ou \`/refuser ${d.reference || 'ORD-???'}\` pour refuser.`;


    await channel.send({ content, embeds: [embed] });
    console.log(`✅ [Order] Notification envoyée dans le canal ${ORDER_CHANNEL_ID} pour la commande ${d.reference}`);
  } catch (err) {
    console.error('[Order] ❌ Erreur envoi notification commande:', err.message);
  }
}

// Endpoint dédié pour les nouvelles commandes
app.post('/order', async (req, res) => {
  const { data } = req.body;
  await sendOrderNotification(data);
  res.json({ success: true });
});

// AUTO-LOGGING TO SECOND SERVER
app.post('/log', async (req, res) => {
  const { category, message, data } = req.body;
  
  // Si c'est une commande, envoyer aussi dans le canal dédié
  if (category === 'order' && data && data.reference) {
    await sendOrderNotification(data);
  }
  
  await internalLog(category, message, data);
  res.json({ success: true });
});

// Update client side polling when message arrives from Discord
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  
  console.log(`🔍 Message détecté de ${message.author.tag} dans le salon: ${message.channel.name}`);

  if (!message.channel.isThread()) {
    console.log(`⚠️ Ignoré : ce n'est pas un fil de discussion.`);
    return;
  }

  let sessionId = threadToSession.get(message.channel.id);

  // Fallback: extract from thread name if server restarted and memory map is cleared
  if (!sessionId) {
    const sessionIdMatch = message.channel.name.match(/\(([^)]+)\)/);
    if (sessionIdMatch) {
      sessionId = sessionIdMatch[1];
      threadToSession.set(message.channel.id, sessionId);
    }
  }

  if (sessionId) {
    console.log(`💬 Message capturé pour session ${sessionId}: "${message.content}"`);
    const queue = messageQueues.get(sessionId) || [];
    queue.push({
      author: 'PERSEUS Support',
      text: message.content,
      timestamp: new Date().toISOString()
    });
    messageQueues.set(sessionId, queue);
  } else {
    console.log(`❌ Impossible de trouver une Session ID pour ce fil: ${message.channel.name}`);
  }
});

// ─── ANALYTICS & STATS ENGINE ───
let statsChannelId = null;

async function ensureStatsChannel() {
  try {
    const guild = await client.guilds.fetch(MAIN_GUILD_ID);
    await guild.channels.fetch();
    let channel = guild.channels.cache.find(c => c.name === '📊-stats-perseus');

    if (!channel) {
      console.log('📡 Salon 📊-stats-perseus introuvable, création...');
      channel = await guild.channels.create({
        name: '📊-stats-perseus',
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.id, deny: ['ViewChannel'] }, // Private by default
        ]
      });
    }
    statsChannelId = channel.id;
    console.log(`✅ Salon stats prêt : ${channel.id}`);
  } catch (err) {
    console.error('❌ Erreur lors de la création du salon stats:', err.message);
  }
}

async function sendDailyReport() {
  if (!statsChannelId) await ensureStatsChannel();
  try {
    // Fetch stats from internal API
    const res = await fetch(`${INTERNAL_API_URL}/api/admin/stats/daily`);
    const stats = await res.json();

    const channel = await client.channels.fetch(statsChannelId);
    const embed = new EmbedBuilder()
      .setTitle('📊 RAPPORT EXÉCUTIF — Perseus')
      .setColor(0xD4AF37)
      .setDescription(`Résumé des performances des dernières 24 heures.`)
      .addFields(
        { name: '💰 Ventes totales', value: `**${stats.totalSales || 0} $**`, inline: true },
        { name: '📅 Commandes', value: `${stats.orderCount || 0}`, inline: true },
        { name: '✨ Nouveaux VIP', value: `${stats.newVips || 0}`, inline: true },
        { name: '💎 Top Produit', value: stats.topProduct || 'N/A', inline: false },
        { name: '🛒 Paniers Abandonnés', value: `${stats.abandonedCarts || 0}`, inline: true },
        { name: '👥 Visiteurs uniques', value: `${stats.visitors || 0}`, inline: true },
      )
      .setFooter({ text: 'Perseus Intelligence Unit' })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
    console.log('✅ Rapport quotidien envoyé.');
  } catch (err) {
    console.error('❌ Échec du rapport quotidien:', err.message);
  }
}

function startDailyReportScheduler() {
  // Check every hour if it's midnight
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
      sendDailyReport();
    }
  }, 60000); // Check every minute
}

let notifiedCarts = new Set(); // Keep track for the session to avoid duplicate spam

async function checkAbandonedCarts() {
  if (!statsChannelId) await ensureStatsChannel();
  try {
    const res = await fetch(`${INTERNAL_API_URL}/api/admin/stats/abandoned-details`);
    if (!res.ok) return;
    const abandoned = await res.json(); // Array of { user_id, name, total, items_summary }

    const channel = await client.channels.fetch(statsChannelId);
    
    for (const cart of abandoned) {
      const lockKey = `${cart.user_id}_${cart.last_update}`;
      if (notifiedCarts.has(lockKey)) continue;

      const embed = new EmbedBuilder()
        .setTitle('🛒 PANIER ABANDONNÉ')
        .setColor(0xe67e22)
        .setDescription(`Un client a laissé des articles dans son panier depuis 30 min.`)
        .addFields(
          { name: '👤 Client', value: cart.name || 'Visiteur', inline: true },
          { name: '💰 Valeur Est.', value: `**${cart.total || 0} $**`, inline: true },
          { name: '📦 Articles', value: cart.items_summary || 'Non listés' },
        )
        .setTimestamp();
      
      await channel.send({ embeds: [embed] });
      notifiedCarts.add(lockKey);
    }
  } catch (err) {
    console.error('❌ Abandoned cart checker err:', err.message);
  }
}

function startAbandonedCartScheduler() {
  setInterval(checkAbandonedCarts, 1800000); // Every 30 minutes
}

// In client.once Ready:
// startAbandonedCartScheduler() is called via startDailyReportScheduler() wrapper or directly

app.get('/diag', (req, res) => {
  if (!client.isReady()) return res.json({ status: 'offline' });
  
  const guilds = client.guilds.cache.map(g => ({
    name: g.name,
    id: g.id,
    channels: g.channels.cache.filter(c => c.type === ChannelType.GuildText).map(c => ({ name: c.name, id: c.id }))
  }));

  res.json({
    status: 'online',
    user: client.user.tag,
    guilds_count: client.guilds.cache.size,
    guilds,
    env: {
      MAIN_GUILD_ID,
      LOGS_GUILD_ID,
      ORDER_CHANNEL_ID,
      SUPPORT_CHANNEL_ID: CHANNEL_ID
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Bridge API listening on port ${PORT}`);
});

client.login(TOKEN);
