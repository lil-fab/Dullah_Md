const { zokou } = require("../framework/zokou")
//const { getGroupe } = require("../bdd/groupe")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../bdd/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../bdd/antibot")
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');
//const { uploadImageToImgur } = require('../framework/imgur');

zokou({ nomCom: "tagadmin", categorie: 'Group', reaction: "📣" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) {
    repondre("✋🏿 This command is reserved for groups ❌");
    return;
  }

  if (!verifAdmin && !superUser) {
    repondre('✋🏿 This command is reserved for group admins ❌');
    return;
  }

  let mess = arg && arg !== ' ' ? arg.join(' ') : 'Aucun Message';
  let adminsGroupe = verifGroupe ? infosGroupe.participants.filter(p => p.admin !== null) : [];
  
  if (adminsGroupe.length === 0) {
    repondre("❌ No admins found in this group.");
    return;
  }

  let tag = `
╭─────────────━┈⊷ 
│🔰 ᴅᴜʟʟᴀʜ ᴍᴅ 💂
╰─────────────━┈⊷ \n
│👥 *Group* : ${nomGroupe} 
│👤 *Hey😀* : *${nomAuteurMessage}* 
│📜 *Message* : *${mess}* 
╰─────────────━┈⊷\n\n`;

  let emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$','😟','🥵','🐅'];
  let random = Math.floor(Math.random() * (emoji.length - 1));

  for (const admin of adminsGroupe) {
    tag += `${emoji[random]}      @${admin.id.split("@")[0]}\n`;
  }

  zk.sendMessage(dest, { text: tag, mentions: adminsGroupe.map((i) => i.id) }, { quoted: ms });
});
