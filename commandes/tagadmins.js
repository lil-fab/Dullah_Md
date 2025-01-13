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
      // Ensure the command is used only in groups
      if (!citel.isGroup) {
        return citel.reply("⚠️ This command can only be used in groups.");
      }

      // Ensure metadata is available
      if (!citel.metadata || !citel.metadata.participants) {
        return citel.reply("⚠️ No group data available.");
      }

      // Get group participants
      const participants = citel.metadata.participants;

      // Filter for group admins
      const admins = participants.filter((member) => member.admin);

      if (!admins.length) {
        return citel.reply("⚠️ There are no admins in this group.");
      }

      // Check if the sender is an admin
      const isAdmin = admins.find((member) => member.id === citel.sender);
      if (!isAdmin) {
        return citel.reply("⚠️ Only admins can use this command.");
      }

      // Create a message tagging all admins
      const mentions = admins.map((admin) => admin.id);
      let message = `*「 TAG ADMINS 」*\n\n`;
      for (let admin of admins) {
        message += `⭐ @${admin.id.split("@")[0]}\n`;
      }

      // Send the message tagging all admins
      await citel.reply(message.trim(), null, { mentions });
    } catch (e) {
      citel.error(`⚠️ Error in tagadmins command: ${e.message}`, e);
    }
  }
);
