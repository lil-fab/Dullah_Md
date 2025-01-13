const { zokou } = require("../framework/zokou");
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const { ajouterOuMettreAJourJid, mettreAJourAction, verifierEtatJid } = require("../bdd/antilien");
const { atbajouterOuMettreAJourJid, atbverifierEtatJid } = require("../bdd/antibot");
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');

zokou({ nomCom: "tagadmin", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  // Ensure command is used in a group
  if (!verifGroupe) {
    repondre("✋🏿 This command is reserved for groups ❌");
    return;
  }

  // Ensure the user is an admin
  if (!verifAdmin && !superUser) {
    repondre("❌ This command is reserved for group admins.");
    return;
  }

  // Handle message argument
  const mess = arg && arg !== ' ' ? arg.join(' ') : 'Aucun Message';

  // Get group admins
  const membresGroupe = verifGroupe ? await infosGroupe.participants : [];
  const admins = membresGroupe.filter(membre => membre.admin === 'admin' || membre.admin === 'superadmin');

  // Generate the message
  let tag = `
╭─────────────━┈⊷ 
│🔰 ᴅᴜʟʟᴀʜ ᴍᴅ 💂
╰─────────────━┈⊷ 
│👥 *Group* : ${nomGroupe} 
│👤 *Hey😀* : *${nomAuteurMessage}* 
│📜 *Message* : *${mess}* 
╰─────────────━┈⊷\n
\n`;

  let emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$', '😟', '🥵', '🐅'];
  let random = Math.floor(Math.random() * emoji.length);

  for (const admin of admins) {
    tag += `${emoji[random]}      @${admin.id.split("@")[0]}\n`;
  }

  // Send the message tagging only admins
  zk.sendMessage(dest, { text: tag, mentions: admins.map(admin => admin.id) }, { quoted: ms });
});
