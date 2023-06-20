// Imports configuration files and modules
const config = require("../../botConfig/config.json");
const ee = require("../../botConfig/embed.json");
const emo = require("../../botConfig/emojis.json");

// Imports necessary modules from the discord.js library
const Discord = require("discord.js");
const { Collection, EmbedBuilder, Events, PermissionFlagsBits } = require("discord.js");

// Creates a new collection for cooldowns
const cooldowns = new Collection();

// Imports the red function from the chalk library
const { red } = require("chalk");

// Imports the translation module and language codes from the translation library
const translate = require("@vitalets/google-translate-api");
const langCodes = config.langCodes;

// Imports the Database module and creates instances for ownership, blacklist, and languages databases
const { Database } = require("st.db");
const owner_db = new Database("./src/db/ownership.json", { pathOutsideTheProject: true });
const blacklist_db = new Database("./src/db/blacklist.json", { pathOutsideTheProject: true });
const lang_db = new Database("./src/db/languages.json", { pathOutsideTheProject: true });

// Exports an object with an "execute" function
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    try {

      // Checks if the interaction is a chat input command
      if (!interaction.isChatInputCommand()) return;

      // Retrieves the command object from the client commands collection
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Defines a translation function
      async function translation(text) {
        const lang = langCodes.includes(lang_db.get(`language.${interaction.guild.id}`)) ? lang_db.get(`language.${interaction.guild.id}`) : "en";
        if (lang === "en") {
          return text;
        } else {
          const res = await translate(text, { from: "en", to: lang });
          return res.text;
        }
      }

      // Handles command cooldowns
      if (command.cooldown) {
        const cooldownKey = `${command.name}-${interaction.user.id}`;
        let remainingTime = cooldowns.has(cooldownKey) ? Math.ceil((cooldowns.get(cooldownKey) - Date.now()) / 1000) : 0;
        if (remainingTime > 0) {
          const embed = new EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | Slow down!`)}`)
            .setDescription(`${await translation(`You can use this command again in ${remainingTime} second${remainingTime > 1 ? "s" : ""}.`)}`);
          try {
            const reply = await interaction.reply({ embeds: [embed], ephemeral: true });
            const interval = setInterval(async () => {
              remainingTime--;
              if (remainingTime > 0) {
                embed.setDescription(`${await translation(`You can use this command again in ${remainingTime} second${remainingTime > 1 ? "s" : ""}.`)}`);
                try {
                  await reply.edit({ embeds: [embed], ephemeral: true });
                } catch (error) {
                  clearInterval(interval);
                }
              } else {
                clearInterval(interval);
                try {
                  await reply.delete();
                } catch (error) { }
              }
            }, 2000);
          } catch (error) { }
          return;
        }
        cooldowns.set(`${command.name}-${interaction.user.id}`, Date.now() + (command.cooldown * 1000));
        setTimeout(() => {
          cooldowns.delete(`${command.name}-${interaction.user.id}`);
        }, command.cooldown * 1000);
      }

      // Handles member permissions commands
      if (command.memberPermissions.length > 0) {
        const member = interaction.member;
        const missingPermissions = [];

        for (const permission of command.memberPermissions) {
          if (!member.permissions.has(PermissionFlagsBits[permission])) {
            missingPermissions.push(permission);
          }
        }

        if (missingPermissions.length > 0) {
          const embed = new EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | Insufficient Permissions`)}`)
            .setDescription(`${await translation(`You are missing the following permissions to run this command:`)}\n> ${missingPermissions.join("\n- ")}`);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }

      // Handles owner-only commands
      const ownerId = owner_db.has(`owner.${interaction.guild.id}`) ? owner_db.get(`owner.${interaction.guild.id}`) : config.devId;
      if (command.ownerOnly && interaction.user.id !== ownerId) {
        const embed = new EmbedBuilder()
          .setColor(ee.colors.error)
          .setTitle(`${await translation(`${emo.error} | You are not allowed to run this command!`)}`)
          .setDescription(`${await translation("Only the bot owner can use this command!")}`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Handles blacklisted commands
      if (command.blacklist) {
        if (blacklist_db.has(`blacklist.${interaction.user.id}`)) {
          const embed = new EmbedBuilder()
            .setColor(ee.colors.error)
            .setTitle(`${await translation(`${emo.error} | You are not allowed to run this command!`)}`)
            .setDescription(`${await translation("You are blacklisted and cannot use this command!")}`);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
      }

      // Executes the command
      await command.execute(interaction, client, Discord, translation, ee, emo);
    } catch (error) {
      console.error(red(error));
      const embed = new EmbedBuilder()
        .setColor(ee.colors.error)
        .setTitle(`${emo.error} | Error executing \`${interaction.commandName}\``);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
};
