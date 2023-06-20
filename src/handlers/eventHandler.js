// Imports the readdirSync function from the fs module
const { readdirSync } = require("fs");

// Imports colored text functions from the chalk library
const { blue, green, red, white } = require("chalk");

// Imports the ascii-table module
const ascii = require("ascii-table");

// Creates a new ascii-table with the label "Events" and sets the justification
const table = new ascii(red("Events")).setJustify();

// Exports an asynchronous function that loads and sets up event handlers
module.exports = async (client) => {
  try {

    // Reads the contents of the "./src/events" directory and awaits the result
    const folders = await readdirSync("./src/events", { withFileTypes: true });

    // Iterates over each folder in the "events" directory
    for (const folder of folders) {

      // Skips the iteration if the current folder is not a directory
      if (!folder.isDirectory()) continue;

      // Reads the files in the current folder that end with ".js" and awaits the result
      const eventFiles = await readdirSync(`./src/events/${folder.name}`).filter(file => file.endsWith(".js"));

      // Iterates over each event file in the current folder
      for (const file of eventFiles) {

        // Requires the event file
        const event = require(`../events/${folder.name}/${file}`);

        // Checks if the event has a name property
        if (event.name) {

          // Determines the appropriate event name based on the "once" property
          const eventName = event.once ? "once" : "on";

          // Attaches the event to the client using the determined event name and executes the event's "execute" function
          client[eventName](event.name, (...args) => event.execute(...args, client));

          // Adds a row to the ascii-table indicating the event is working
          table.addRow(blue(event.name), green("🟢 Working"));
        } else {
          // Adds a row to the ascii-table indicating the event is not working
          table.addRow(blue(file), red("🔴 Not working"));
        }
      }
    }

    // Logs the ascii-table to the console with white text color
    console.log(white(table.toString()));
  } catch (error) {

    // Logs an error message to the console if there is an error loading events
    console.error(red(`Error loading events:\n ${error}`));
    return;
  }
};
