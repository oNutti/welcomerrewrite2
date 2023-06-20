const config = require("../../botConfig/config.json");

module.exports = {
  name: "test",
  description: "Test command!",
  cooldown: config.cooldown,
  memberPermissions: [],
  ownerOnly: false,
  blacklist: false,
  options: [],
  async execute(interaction, client, Discord, translation, ee, emo) {
    try {
      await interaction.reply({ content: `${await translation("Hi, my name is Shadow!")}` });
    } catch (error) { }
  }
};
