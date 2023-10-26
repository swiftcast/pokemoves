const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const fs = require("fs/promises"); // Using promises-based fs module for async/await
const { list, reloadJsonData } = require("./count"); //list of pokemon,moves,counts

const jsonUrl = "https://www.pokemoves.com/data.json";
const localJsonFilePath = "../data/pokemovesdata.json";
// Function to check if the JSON from the URL is newer than the one on disk
async function isJsonNewerOnUrl() {
  try {
    const response = await axios.get(jsonUrl);
    const urlTimestamp = response.data.timestamp;

    try {
      const localData = await fs.readFile(localJsonFilePath, "utf8");
      const localJson = JSON.parse(localData);
      const localTimestamp = localJson.timestamp;

      return urlTimestamp > localTimestamp;
    } catch (error) {
      // Handle the case where the local JSON file doesn't exist
      return true;
    }
  } catch (error) {
    console.error("Error fetching JSON data from URL:", error.message);
    return false;
  }
}

async function updateJsonFromUrl() {
  const isNewer = await isJsonNewerOnUrl();

  if (isNewer) {
    try {
      const response = await axios.get(jsonUrl);
      const jsonData = response.data;

      // Write the JSON data to the local file using fs/promises.writeFile
      await fs.writeFile(
        localJsonFilePath,
        JSON.stringify(jsonData, null, 2),
        "utf8"
      );

      console.log("JSON data updated successfully.");

      list = reloadJsonData();
      return "JSON data updated successfully.";
    } catch (error) {
      console.error("Error:", error.message);
    }
  } else {
    console.log("Local JSON file is up to date.");
    return "Local pokemoves JSON file is up to date.";
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Updates pokemoves data JSON."),
  async execute(interaction) {
    await interaction.deferReply(); // Defer the reply while updating the JSON

    try {
      let msg = await updateJsonFromUrl();
      await interaction.editReply(msg);
    } catch (error) {
      console.error("Error updating JSON:", error.message);
      await interaction.editReply(
        "An error occurred while updating the JSON file."
      );
    }
  },
};
