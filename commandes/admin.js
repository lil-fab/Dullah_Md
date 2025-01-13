const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "tagadmins",
    desc: "Tag all group admins.",
    type: "group",
    fromMe: true,
    use: "",
    usage: "Tags all group admins in a single message. Only admins can use this command.",
    filename: __filename,
    public: false,
  },
  async (citel) => {
    try {
      // Ensure the command is used in a group
      if (!citel.isGroup) {
        return citel.reply("⚠️ This command can only be used in groups.");
      }

      // Ensure metadata is available
      if (!citel.metadata || !citel.metadata.participants) {
        return citel.reply("⚠️ No group data available.");
      }

      // Get group participants
      const participants = citel.metadata.participants;

      // Filter admins from participants
      const admins = participants.filter(
        (member) => member.admin === "admin" || member.admin === "superadmin"
      );

      // Check if there are admins
      if (admins.length === 0) {
        return citel.reply("⚠️ There are no admins in this group.");
      }

      // Check if the command sender is an admin
      const isSenderAdmin = admins.some((admin) => admin.id === citel.sender);
      if (!isSenderAdmin) {
        return citel.reply("⚠️ Only admins can use this command.");
      }

      // Generate a message tagging all admins
      const mentions = admins.map((admin) => admin.id);
      let message = `*「 TAGGING ALL ADMINS 」*\n\n`;
      admins.forEach((admin, index) => {
        message += `${index + 1}. @${admin.id.split("@")[0]}\n`;
      });

      // Send the message tagging all admins
      await citel.reply(message.trim(), null, { mentions });
    } catch (error) {
      console.error(error); // Log the error for debugging
      citel.reply(`⚠️ An error occurred: ${error.message}`);
    }
  }
);
