const config = require("../../botConfig/config.json");

const { Database } = require("st.db");
const blacklist_db = new Database("./src/db/blacklist.json", { pathOutsideTheProject: true });

module.exports = {
  name: "blacklist",
  description: "Add or remove a user from the blacklist or list all blacklisted users",
  cooldown: config.cooldown,
  memberPermissions: [],
  ownerOnly: true,
  blacklist: false,
  options: [
    {
      name: "add",
      description: "Add a user to the blacklist",
      type: 1,
      options: [
        {
          name: "user",
          description: "The user to blacklist",
          type: 6,
          required: true,
        },
        {
          name: "reason",
          description: "The reason for blacklisting the user",
          type: 3,
          required: true,
        },
      ],
    },

    {
      name: "remove",
      description: "Remove a user from the blacklist",
      type: 1,
      options: [
        {
          name: "user",
          description: "The user to blacklist",
          type: 6,
          required: true,
        },
      ],
    },

    {
      name: "list",
      description: "List all users on the blacklist",
      type: 1
    }
  ],
  async execute(interaction, client, Discord, translation, word, ee, emo) {
    try {
      const subCommand = interaction.options.getSubcommand();
      const user = interaction.options.getUser("user");
      const reason = interaction.options.getString("reason");

      if (subCommand === "add") {
        if (user.bot) {
          const embed = new Discord.EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | Bots cannot be blacklisted.`)}`);
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        if (blacklist_db.has(`blacklist.${user.id}`)) {
          const embed = new Discord.EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | User \`${user.tag}\` is already blacklisted.`)}`);
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        blacklist_db.set(`blacklist.${user.id}`, { reason, date: new Date().toISOString() });
        const embed = new Discord.EmbedBuilder()
          .setColor(ee.colors.success)
          .setTitle(`${await translation(`${emo.success} | User \`${user.tag}\` has been blacklisted.`)}`);
        await interaction.reply({ embeds: [embed] });
        return;
      }


      if (subCommand === "remove") {
        if (user.bot) {
          const embed = new Discord.EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | Bots cannot be blacklisted.`)}`);
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        if (!blacklist_db.has(`blacklist.${user.id}`)) {
          const embed = new Discord.EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | User \`${user.tag}\` is not blacklisted.`)}`);
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        blacklist_db.delete(`blacklist.${user.id}`);
        const embed = new Discord.EmbedBuilder()
          .setColor(ee.colors.success)
          .setTitle(`${await translation(`${emo.success} | User \`${user.tag}\` has been removed from the blacklist.`)}`);
        await interaction.reply({ embeds: [embed] });
        return;
      }


      if (subCommand === "list") {
        const blacklistedUsers = blacklist_db.all();
        if (!blacklistedUsers.length) {
          const embed = new Discord.EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | There are no users on the blacklist.`)}`);
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        const ascii = require("ascii-table");
        const table = new ascii().setHeading("#", "UserTag", "Reason", "Date");
        let index = 1;
        for (const { ID: rawId, data: { reason, date } } of blacklistedUsers) {
          const id = rawId.replace("blacklist.", "");
          const user = await client.users.fetch(id, { cache: true });
          table.addRow(index++, user.tag, reason, new Date(date).toLocaleDateString());
        }

        const response = `**\`\`\`${table.toString()}\`\`\`**`;
        const embed = new Discord.EmbedBuilder()
          .setColor(ee.colors.success)
          .setTitle(`${response}`);
        await interaction.reply({ embeds: [embed] });
        return;
      }
    } catch (error) { }
  }
};
