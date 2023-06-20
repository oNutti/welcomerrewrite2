const config = require("../../botConfig/config.json");

const { Database } = require("st.db");
const lang_db = new Database("./src/db/languages.json", { pathOutsideTheProject: true });

const languages = [
  { name: "Arabic", value: "ar" },
  { name: "German", value: "de" },
  { name: "English", value: "en" },
  { name: "Spanish", value: "es" },
  { name: "French", value: "fr" },
  { name: "Italian", value: "it" },
  { name: "Russian", value: "ru" }
];

module.exports = {
  name: "setup",
  description: "Change bot responses to a selected language",
  cooldown: config.cooldown,
  memberPermissions: [],
  ownerOnly: true,
  blacklist: false,
  options: [
    {
      name: "language",
      description: "Select a language to change to",
      type: 1,
      options: [
        {
          name: "language",
          description: "Select a language to change to",
          type: 3,
          required: true,
          choices: languages
        },
      ]
    },
  ],
  async execute(interaction, client, Discord, translation, word, ee, emo) {
    const subCommand = interaction.options.getSubcommand();
    const languageCode = interaction.options.getString("language");
    const currentLanguage = lang_db.get(`language.${interaction.guild.id}`);

    try {
      if (subCommand === "language") {
        if (languageCode === currentLanguage) {
          const embed = new Discord.EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | The language of the bot is already set to \`${languages.find(lang => lang.value === languageCode).name}\``)}`);
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }

        lang_db.set(`language.${interaction.guild.id}`, languageCode);
        const embed = new Discord.EmbedBuilder()
          .setColor(ee.colors.success)
          .setTitle(`${await translation(`${emo.success} | The language of the bot has been changed to \`${languages.find(lang => lang.value === languageCode).name}\``)}`);
        await interaction.reply({ embeds: [embed] });
        return;
      }
    } catch (error) { }
  }
};
