const { zokou } = require("../framework/zokou");

zokou(
  {
    nomCom: "tagadmins",
    desc: "Tag all group admins.",
    type: "group",
    fromMe: true,
    use: "",
    usage: "Tags all group admins in a single message. Only admins will be tagged.",
    filename: __filename,
    public: false,
  },
  async (citel) => {
    try {
      // Check if the command is used in a group
      if (!citel.isGroup) {
        return citel.reply("⚠️ This command can only be used in groups.");
      }

      // Check if group metadata and participants are available
      if (!citel.metadata || !citel.metadata.participants) {
        return citel.reply("⚠️ Group data is not available.");
      }

      // Get all group participants
      const participants = citel.metadata.participants;

      // Filter group admins from participants
      const admins = participants.filter(
        (member) => member.admin === "admin" || member.admin === "superadmin"
      );

      // Check if there are any admins in the group
      if (admins.length === 0) {
        return citel.reply("⚠️ There are no admins in this group.");
      }

      // Create a message tagging all admins
      const mentions = admins.map((admin) => admin.id);
      let message = `*「 TAGGING ALL ADMINS 」*\n\n`;
      admins.forEach((admin, index) => {
        message += `${index + 1}. @${admin.id.split("@")[0]}\n`;
      });

      // Send the message with admin mentions
      await citel.reply(message.trim(), null, { mentions });
    } catch (error) {
      console.error(error); // Log errors for debugging
      citel.reply(`⚠️ An error occurred while processing the command: ${error.message}`);
    }
  }
);
