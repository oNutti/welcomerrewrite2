// Imports the Events object from the discord.js library
const { Events } = require("discord.js");

// Imports the yellow color function from the chalk library
const { yellow } = require("chalk");

// Exports an object with an "execute" function
module.exports = {

  // Specifies the event name as ClientReady
  name: Events.ClientReady,

  // Specifies that the event should only be executed once
  once: true,
  async execute(client) {

    // Logs a message indicating that the client is ready and logged in
    console.log(yellow(`Ready! Logged in as ${client.user.tag}`));
  }
};
