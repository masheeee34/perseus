// Using global fetch (Node 18+)

const updates = [
  "💎 **Hero Section Transformation**: Nouveau split-screen vidéo avec les collections Perseus & Poppin Southside.",
  "🎥 **Expérience Immersive**: Passage à une vidéo background fluide avec logo brandé et typographie 'Down Below'.",
  "📸 **Editorial Gallery**: Les carrés de collection utilisent maintenant des visuels haute définition Portola Drive.",
  "📊 **Discord Logs Upgrade**: Nouveau système d'embeds colorés avec emojis et détails techniques structurés.",
  "🛒 **Real-time Cart Tracking**: Les ajouts et retraits du panier sont maintenant loggués en direct sur Discord.",
  "⚙️ **System Fixes**: Correction des erreurs de catégorie dans l'API et optimisation des pointer-events sur mobile."
];

async function sendChangelog() {
  console.log("📣 Sending changelog to Discord bridge...");
  
  for (const update of updates) {
    try {
      await fetch('http://127.0.0.1:3001/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'changelog',
          message: update
        })
      });
      // Small delay to ensure order in Discord
      await new Promise(r => setTimeout(r, 800));
    } catch (e) {
      console.error("Failed to send update:", update, e.message);
    }
  }
  
  console.log("✅ Changelog sent successfully.");
}

sendChangelog();
