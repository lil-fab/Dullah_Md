const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou(
  {
    nomCom: "getall",
    desc: "Get JIDs of all members of groups/PM chats/all groups.",
    type: "owner",
    fromMe: true,
    use: "[ members / user / groups ]",
    usage:
      "Get JIDs of groups, personal chats, and group members for further use in commands like forward.",
    filename: __filename,
    public: false,
  },
  async (citel, text, { store }) => {
    try {
      let str = "";
      let cd = text.split(" ")[0];

      if (cd === "members" || cd === "member") {
        if (!citel.isGroup) return citel.reply("This command is for group chats only.");

        // Check if the user is an admin
        const participants = citel.metadata.participants || [];
        const isAdmin = participants.find(
          (member) => member.id === citel.sender && member.admin
        );
        if (!isAdmin) return citel.reply("Only group admins can use this command.");

        for (let i of participants) {
          str += `📍 ${i.id}\n`;
        }
        str
          ? citel.reply(`*「 LIST OF GROUP MEMBER'S JID 」*\n\n` + str)
          : citel.reply("*Request Denied!*");
      } else if (cd == "user" || cd == "pm" || cd == "pc") {
        let anu = await store.chats
          .all()
          .filter((v) => v.id.endsWith(".net"))
          .map((v) => v);
        for (let i of anu) {
          str += `📍 ${i.id}\n`;
        }
        str
          ? citel.reply(
              `*「 LIST OF PERSONAL CHAT JIDS 」*\n\nTotal ${anu.length} users have texted in personal chat.\n\n` +
                str
            )
          : citel.reply("*Request Denied!*");
      } else if (cd == "group" || cd == "groups" || cd == "gc") {
        n = await citel.bot.groupFetchAllParticipating();
        const c = Object.entries(n)
          .slice(0)
          .map((t) => t[1]);
        for (var i of c.map((t) => t.id)) {
          str += `📍 ${i}\n`;
        }
        str
          ? citel.reply(`*「 LIST OF GROUP CHAT JIDS 」*\n\n` + str)
          : citel.reply("*Request Denied!*");
      } else {
        return await citel.reply(`*Use ${conf.prefix}getall pc | gc | member!*`);
      }
    } catch (e) {
      citel.error(`${e}\n\nnomCom getall`, e);
    }
  }
);
