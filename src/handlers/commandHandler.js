// Imports necessary modules from the discord.js library
const { Client, Collection, REST, Routes } = require("discord.js");

// Creates a new REST client with the specified API version and sets the token from environment variables
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

// Imports the readdirSync function from the fs module
const { readdirSync } = require("fs");

// Imports colored text functions from the chalk library
const { blue, green, red, white, yellow } = require("chalk");

// Imports the ascii-table module
const ascii = require("ascii-table");

// Creates a new ascii-table with the label "commands" and sets the justification
const table = new ascii(red("commands")).setJustify();

// Exports an asynchronous function that loads and sets up bot commands
module.exports = async (client) => {
  const commands = [];
  client.commands = new Collection();

  // Reads the command folders in the "./src/commands" directory
  const commandFolders = readdirSync("./src/commands");

  // Iterates over each command folder
  for (const folder of commandFolders) {

    // Reads the command files in the current folder that end with ".js"
    const commandFiles = readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"));

    // Iterates over each command file in the current folder
    for (const file of commandFiles) {

      // Requires the command file
      const command = require(`../commands/${folder}/${file}`);

      // Checks if the command has a valid name and description
      if (!command.name || !command.description) {

        // Adds a row to the ascii-table indicating the command is not working
        table.addRow(blue(file), red("🔴 Not working"));
        continue;
      }

      // Checks if the command has a valid data object with name and description properties
      if (command.data && command.data.name && command.data.description) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);

        // Adds a row to the ascii-table indicating the command is working
        table.addRow(blue(`/${command.data.name}`), green("🟢 Working"));
        continue;
      }

      // Creates a command object with type, name, description, and options properties
      commands.push({
        type: 1,
        name: command.name,
        description: command.description,
        options: command.options || [],
      });

      client.commands.set(command.name, command);

      // Adds a row to the ascii-table indicating the command is working
      table.addRow(blue(`/${command.name}`), green("🟢 Working"));
    }
  }

  // Logs the ascii-table to the console with white text color
  console.log(white(table.toString()));

  // Defines a clientReadyHandler function to handle refreshing application commands
  const clientReadyHandler = async () => {
    try {
      console.log(yellow(`\nStarted refreshing ${commands.length} application (/) commands.`));
      const data = await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      console.log(yellow(`Successfully reloaded ${data.length} application (/) commands.`));
    } catch (error) {
      console.error(red(`Error refreshing & reloaded application (/) commands:\n ${error}`));
    }
  };

  // Registers the clientReadyHandler function when the client is an instance of the Client class
  if (client instanceof Client) {
    client.once("ready", clientReadyHandler);
  } else {
    clientReadyHandler();
  }
};
