// Import functions for colored console output
const { red, yellow } = require("chalk");

// Import Express framework
const express = require("express");

// Create an Express app instance
const app = express();

// Define keepAlive function
function keepAlive() {
  setInterval(() => {
    console.log(yellow("I'm alive!"));
  }, 60000);
}

// Export the keepAlive function
module.exports = keepAlive;

// Export an async function with the client parameter
module.exports = async (client) => {
  try {

    // Handle GET request to "/"
    app.get("/", (req, res) => {
      const discordId = "993883534186004632";

      // Fetch user information from Discord API
      client.users.fetch(discordId).then(user => {

        // Extract user information
        const { avatar, username, discriminator } = user;
        const avatarUrl = user.displayAvatarURL({ format: "png", size: 2048 });

        // Get current year
        const currentYear = new Date().getFullYear();

        // Generate HTML response
        const htmlResponse = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Slash Command Handler v14✨</title>
          <style>
            /* Reset some default styles for consistency */
            body, h1, h2, p, img {
              margin: 0;
              padding: 0;
              border: none;
              font-family: Arial, sans-serif;
            }

            /* Apply some basic styling */
            body {
              background-color: #333;
            }

            header {
              background-color: #333;
              color: #fff;
              padding: 20px;
            }

            h1 {
              font-size: 30px;
            }

            main {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 80vh;
            }

            .developer-info {
              text-align: center;
              color: white;
            }

            img {
              width: 200px;
              height: 200px;
              border-radius: 50%;
              margin-bottom: 10px;
              animation: radiate 3s infinite; /* Apply the radiate animation */
            }

            @keyframes radiate {
              0% {
                transform: scale(1); /* Initial size */
              }
              50% {
                transform: scale(1.2); /* Increased size */
                opacity: 0.8; /* Reduced opacity */
              }
              100% {
                transform: scale(1); /* Return to original size */
                opacity: 1; /* Full opacity */
              }
            }

            h2 {
              font-size: 24px;
              margin-bottom: 10px;
            }

            footer {
              background-color: #333;
              color: #fff;
              padding: 10px;
              text-align: center;
              position: fixed;
              left: 0;
              bottom: 0;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>Slash Command Handler v14✨</h1>
          </header>
          <main>
            <div class="developer-info">
              <img id="avatar" src="${avatarUrl}" alt="Developer Avatar">
              <h2 id="nameTag">${username}#${discriminator}</h2>
            </div>
          </main>
          <footer>
            <p id="year">&copy; ${currentYear} Slash Command Handler v14✨. All rights reserved.</p>
          </footer>
        </body>
        </html>
        `;

        // Send the HTML response
        res.send(htmlResponse);
      }).catch(error => {

        // Handle error if fetching user data fails
        console.error(red(error));
        res.status(500).send("Error occurred while fetching user data.");
      });
    });

    // Start the Express app on an available port
    const server = app.listen(0, () => {
      const port = server.address().port;
      console.log(yellow(`\nServer is running on port ${port}\n`));

      // Get the external IP address of the server
      const { address } = server.address();

      // Print the website link in the console
      console.log(yellow(`Website: http://${address}:${port}/`));
    });
  } catch (error) {

    // Handle any other errors
    console.error(red(error));
  }
};
