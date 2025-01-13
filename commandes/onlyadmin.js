const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "tagadmins",
    desc: "Tag all group admins.",
    type: "group",
    fromMe: true,
    use: "",
    usage:
      "Tag all group admins in a single message. Only admins can use this command.",
    filename: __filename,
    public: false,
  },
  async (citel) => {
    try {
      if (!citel.isGroup)
        return citel.reply("This command can only be used in groups.");

      // Get group participants
      const participants = citel.metadata.participants || [];

      // Filter for admins only
      const admins = participants.filter((member) => member.admin);

      if (!admins.length)
        return citel.reply("This group has no admins to tag.");

      // Check if the user is an admin
      const isAdmin = admins.find((member) => member.id === citel.sender);
      if (!isAdmin)
        return citel.reply("Only group admins can use this command.");

      // Generate mentions for admins only
      let mentions = admins.map((admin) => admin.id);
      let message = `*「 TAG ADMINS 」*\n\n`;
      for (let admin of admins) {
        message += `⭐ @${admin.id.split("@")[0]}\n`;
      }

      // Send the message with mentions
      await citel.reply(message, null, { mentions });
    } catch (e) {
      citel.error(`Error in tagadmins command: ${e.message}`, e);
    }
  }
);
