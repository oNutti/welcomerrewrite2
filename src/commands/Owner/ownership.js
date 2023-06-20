const config = require("../../botConfig/config.json");

const { Database } = require("st.db");
const owner_db = new Database("./src/db/ownership.json", { pathOutsideTheProject: true });

module.exports = {
  name: "ownership",
  description: "Transfer ownership of the bot to a new member",
  cooldown: config.cooldown,
  memberPermissions: [],
  ownerOnly: true,
  blacklist: false,
  options: [
    {
      name: "new_owner",
      description: "The new owner of the bot",
      type: 6,
      required: true
    }
  ],
  async execute(interaction, client, Discord, translation, word, ee, emo) {
    try {
      const user = interaction.options.getUser("new_owner");
      const currentOwnerId = owner_db.has(`owner.${interaction.guild.id}`) ? owner_db.get(`owner.${interaction.guild.id}`) : config.devId;

      if (user.bot) {
        const embed = new Discord.EmbedBuilder()
          .setColor(ee.colors.error)
          .setTitle(`${await translation(`${emo.error} | Bots can't be the owner.`)}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      if (user.id === currentOwnerId) {
        const embed = new Discord.EmbedBuilder()
          .setColor(ee.colors.error)
          .setTitle(`${await translation(`${emo.error} | The new owner \`${user.tag}\` is already the current owner.`)}`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
      }

      owner_db.set(`owner.${interaction.guild.id}`, user.id);
      const embed = new Discord.EmbedBuilder()
        .setColor(ee.colors.success)
        .setTitle(`${await translation(`${emo.success} | The ownership of this bot has been transferred to \`${user.tag}\`.`)}`);
      await interaction.reply({ embeds: [embed] });
      return;
    } catch (error) { }
  },
};
