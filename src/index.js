// Loads environment variables from a .env file
require("dotenv").config();

// Imports the red function from the chalk library
const { red } = require("chalk");

// Imports the readdirSync function from the fs library
const { readdirSync } = require("fs");

// Imports the Client and Partials classes from the discord.js library
const { Client, Partials } = require("discord.js");

// Creates a new instance of the Client class
const client = new Client({
  intents: [32767],
  partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User]
});

// Requires the keepAlive function from the "./handlers/server" file
const keepAlive = require("./handlers/server");

// Iterates through each file in the "./src/handlers" directory
readdirSync("./src/handlers").forEach(handler => {

  // Requires the handler file and executes it, passing the client instance
  require(`./handlers/${handler}`)(client);
});

// Logs in the client using the BOT_TOKEN from the environment variables
client.login(process.env.BOT_TOKEN).catch(error => {
  // Logs any errors that occur during the login process in red color
  console.log(red(error));
});

// Starts the keepAlive function
keepAlive();
