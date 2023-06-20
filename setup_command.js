// Import configuration file
const config = require("../../botConfig/config.json");

// Exports an object with properties and an async execute function
module.exports = {

  // Specifies the name of the command as an empty string
  name: "",

  // Specifies the description of the command as an empty string
  description: "",

  // Specifies the cooldown for the command based on the value from the config
  cooldown: config.cooldown,

  // Specifies an empty array for member permissions
  memberPermissions: [],

  // Specifies that the command can be used by anyone (not restricted to the bot owner)
  ownerOnly: false,

  // Specifies that the command is not blacklisted
  blacklist: false,

  // Specifies an empty array for command options
  options: [],

  // Defines the execute function that is run when the command is executed
  async execute(interaction, client, Discord, translation, ee, emo) {
    try {
      /* Your code here! */
    } catch (error) { }
  }
};
