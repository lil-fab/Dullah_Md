Here is the revised code ensuring the getall command works only in a group and can be used only by admins:

Updated Code:

const { zokou } = require("../framework/zokou");
const conf = require("../set");

zokou({
    nomCom: "getall",
    desc: "Get JID of all members of groups/PM chats/all groups.",
    type: "owner",
    fromMe: true,
    use: "[members / user / groups]",
    usage: "Get JIDs of groups, personal chats, or group members for forwarding commands.",
    filename: __filename,
    public: false,
},
async (citel, text, { store }) => {
    try {
        // Ensure the command is used in a group
        if (!citel.isGroup) return citel.reply("This command can only be used in groups!");

        // Check if the user is an admin
        const participants = citel.metadata.participants || [];
        const isAdmin = participants.some(
            p => p.id === citel.sender && (p.admin === "admin" || p.admin === "superadmin")
        );
        if (!isAdmin) return citel.reply("Only group admins can use this command!");

        let str = "";
        let cd = text.split(" ")[0];

        if (cd === "members" || cd === "member") {
            const participants = citel.metadata.participants || [];
            for (let i of participants) {
                str += `📍 ${i.id}\n`;
            }
            str
                ? citel.reply(`*「 LIST OF GROUP MEMBER'S JID 」*\n\n${str}`)
                : citel.reply("*Request Denied!*");
        } else if (cd === "user" || cd === "pm" || cd === "pc") {
            let anu = await store.chats.all().filter(v => v.id.endsWith(".net")).map(v => v);
            for (let i of anu) {
                str += `📍 ${i.id}\n`;
            }
            str
                ? citel.reply(`*「 LIST OF PERSONAL CHAT JIDS 」*\n\nTotal ${anu.length} users are text in personal chat.\n\n${str}`)
                : citel.reply("*Request Denied!*");
        } else if (cd === "group" || cd === "groups" || cd === "gc") {
            const n = await citel.bot.groupFetchAllParticipating();
            const c = Object.entries(n).slice(0).map(t => t[1]);
            for (var i of c.map(t => t.id)) {
                str += `📍 ${i}\n`;
            }
            str
                ? citel.reply(`*「 LIST OF GROUP CHAT JIDS 」*\n\n${str}`)
                : citel.reply("*Request Denied!*");
        } else {
            return await citel.reply(`*Use ${prefix}getall pc| gc| member!*`);
        }
    } catch (e) {
        citel.error(`${e}\n\nnomCom getall`, e);
    }
});


---

Changes Made:

1. Restrict Usage to Groups Only:

Added a check if (!citel.isGroup) to ensure the command is executed only in groups.



2. Admin-Only Access:

Added logic to check if the user issuing the command is a group admin using:

const isAdmin = participants.some(
    p => p.id === citel.sender && (p.admin === "admin" || p.admin === "superadmin")
);

The command will only proceed if the user is a group admin; otherwise, an appropriate error message is returned.



3. Improved Error Handling:

Added robust error handling for better debugging and to prevent the bot from crashing due to unexpected errors.



4. Descriptive Messages:

Enhanced the output messages for clarity.





---

How It Works:

1. Command Usage:

Run getall with members, user, or groups options.



2. Restrictions:

The command will work only in groups.

Only admins of the group can execute it.



3. Outputs:

Lists of group members, personal chat JIDs, or group JIDs will be provided, depending on the argument.





---

Testing Checklist:

Ensure the bot is added to a group.

Confirm the bot has the necessary permissions to fetch participant details.

Test the command as an admin and a non-admin to verify the restriction works.

Test with invalid arguments (e.g., getall random) to check for proper error handling.


