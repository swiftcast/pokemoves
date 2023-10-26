const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

//let buildhelper = require ("../../build")
//const list = buildhelper.buildData();

let list = reloadJsonData();

module.exports = {
  list,
  reloadJsonData,
  data: new SlashCommandBuilder()
    .setName("count")
    .setDescription("Replies with move counts for a Pokemon")
    .addStringOption((option) =>
      option
        .setName("pokemon")
        .setDescription("The Pokemon whose moves are to be returned")
        .setMaxLength(200)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("form")
        .setDescription("Pokemon form to return")
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const formOptions = formsArray;

    const focusedValue = interaction.options.getFocused();
    const filtered = formOptions.filter((formOption) =>
      formOption.toLowerCase().startsWith(focusedValue.toLowerCase())
    );

    await interaction.respond(
      filtered.map((formOption) => ({ name: formOption, value: formOption }))
    );
  },
  async execute(interaction) {
    const pokemon = interaction.options.getString("pokemon") ?? "wigglytuff";

    const form = interaction.options.getString("form");

    const pokeEmbed = getCountsEmbed(pokemon, form);
    await interaction.reply({ embeds: [pokeEmbed] });
  },
};

let getCountsEmbed = function (pokemonInput, forme) {
  let pokemonObj = getPokemonObj(
    forme ? `${pokemonInput} (${forme})` : pokemonInput
  );
  let form = forme ?? "";
  if (!pokemonObj) {
    return new EmbedBuilder()
      .setColor(0xff0000) // Red color for error
      .setTitle("Pokemon not found")
      .setDescription(`The Pokemon "${pokemonInput}" was not found.`);
  }

  const typeString = (pokemonObj.types || [])
    .map((type) => {
      const emote = typeEmote[type.toLowerCase()];
      return emote ? `<:${type}:${emote}>` : type; // Use emote if available, or type name
    })
    .join(" ");

  const pokeEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${pokemonObj.name} ${typeString}`)
    //.setURL('https://discord.js.org/')
    //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
    //.setDescription('Some description here')
    .setTimestamp()
    .setFields(getMovesFields(pokemonObj));
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
  try {
    pokeEmbed.setThumbnail(
      generateThumbnailURL(pokemonInput.toLowerCase(), form.toLowerCase())
    );
  } catch (error) {
    console.log(error);
  }
  return pokeEmbed;
};

function getPokemonObj(command) {
  return list.pokemon.filter(
    (poke) => poke.name.toLowerCase() === command.toLowerCase()
  )[0];
}

function getMovesFields(pokemonObj) {
  let chargedMoves = pokemonObj.chargedMoveIds;
  let fastMoves = pokemonObj.fastMoveIds;
  let fields = [];

  // Loop through charged moves
  for (let i = 0; i < chargedMoves.length; i++) {
    let chargedMoveName = abbreviateString(list.moves[chargedMoves[i]].name);
    let fastMovesField = "";

    if (pokemonObj.name === "Mew") {
      // Loop through fast moves for each charged move
      for (let j = 0; j < fastMoves.length; j++) {
        fastMovesField += `**${abbreviateString(
          list.moves[fastMoves[j]].name
        )}**: ${list.counts[fastMoves[j]][chargedMoves[i]]}\n`;
      }
    } else {
      for (let j = 0; j < fastMoves.length; j++) {
        const emote = typeEmote[list.moves[fastMoves[j]].type];
        const type = list.moves[fastMoves[j]].type;
        fastMovesField += `**${abbreviateString(
          list.moves[fastMoves[j]].name
        )}**: ${list.counts[fastMoves[j]][chargedMoves[i]]}\n`;
      }
    }

    const emote = typeEmote[list.moves[chargedMoves[i]].type];
    const type = list.moves[chargedMoves[i]].type;

    // Add the charged move and its corresponding fast moves to the fields
    fields.push({
      name: `<:${type}:${emote}> ${chargedMoveName}`,
      value: fastMovesField,
      inline: true,
    });
  }

  return fields;
}

function generateThumbnailURL(pokemonName, form) {
  const baseUrl = "https://play.pokemonshowdown.com/sprites/ani/";

  // Replace any periods or dashes in the Pokémon name
  const sanitizedPokemonName = pokemonName.replace(/[\s.'’-]/g, "");

  switch (form) {
    case "galarian":
      return `${baseUrl}${sanitizedPokemonName}-${form.slice(0, -3)}.gif`;
    case "alolan":
      return `${baseUrl}${sanitizedPokemonName}-${form.slice(0, -1)}.gif`;
    case "therian":
    case "sunny":
    case "rainy":
    case "snowy":
    case "mega":
    case "heat":
    case "wash":
    case "frost":
    case "fan":
    case "mow":
      return `${baseUrl}${sanitizedPokemonName}-${form}.gif`;
    case "normal":
    case "male":
      return `${baseUrl}${sanitizedPokemonName}.gif`;
    case "female":
      return `${baseUrl}${sanitizedPokemonName}-f.gif`;
    default:
      return `${baseUrl}${sanitizedPokemonName}.gif`;
  }
}

function reloadJsonData() {
  // Reload your JSON data here
  try {
    const data = fs.readFileSync("../data/pokemovesdata.json", "utf8");
    console.log("JSON reloaded.");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reloading JSON data:", error.message);
    throw new Error("An error occurred while reloading the JSON data.");
  }
}

function abbreviateString(input) {
  const words = input.split(" ");

  if (words.length === 1) {
    return input; // Return the input as is for a single word
  } else {
    // Abbreviate all words except the last one
    const abbreviatedWords = words
      .slice(0, -1)
      .map((word) => word.charAt(0).toUpperCase() + ".");
    const lastWord = words[words.length - 1]; // Keep the last word as is

    return [...abbreviatedWords, lastWord].join(" ");
  }
}

const typeEmote = {
  normal: "952453832938500146",
  water: "952453832762347542",
  grass: "952453832883961866",
  electric: "952453832875606056",
  ice: "952453832816869377",
  fighting: "952453832825274378",
  fire: "952453832837849209",
  poison: "952453832976261180",
  ground: "952453832422617160",
  flying: "952453832888156210",
  psychic: "952453832951070770",
  bug: "952453832439377972",
  rock: "952453833018179614",
  ghost: "952453832485527564",
  dark: "952453832825241640",
  dragon: "952453833500553276",
  steel: "952453832883994654",
  fairy: "952453832611360810",
};

const formsArray = [
  "10%",
  "50%",
  "Alolan",
  "Altered",
  "Aria",
  "Armoured",
  "Attack",
  "Average Size",
  "Baile",
  "Black",
  "Bug",
  "Burn",
  "Chill",
  "Complete",
  "Confined",
  "Core",
  "Crowned Shield",
  "Crowned Sword",
  "Dark",
  "Dawn Wings",
  "Defense",
  "Douse",
  "Dragon",
  "Dusk",
  "Dusk Mane",
  "Electric",
  "Eternamax",
  "Fairy",
  "Fan",
  "Female",
  "Fighting",
  "Fire",
  "Flying",
  "Frost",
  "Galarian",
  "Ghost",
  "Grass",
  "Ground",
  "Heat",
  "Hero",
  "Hero of Many Battles",
  "Hisuian",
  "Ice",
  "Ice Rider",
  "Incarnate",
  "Land",
  "Large Size",
  "Libre",
  "Male",
  "Mega",
  "Mega X",
  "Mega Y",
  "Midday",
  "Midnight",
  "Mow",
  "Noice",
  "Normal",
  "Origin",
  "Overcast",
  "Pa’u",
  "Pirouette",
  "Plant",
  "Poison",
  "Pom-Pom",
  "Pop Star",
  "Primal",
  "Psychic",
  "Rainy",
  "Rapid Strike",
  "Rock",
  "Rock Star",
  "Sandy",
  "School",
  "Sensu",
  "Shadow Rider",
  "Shock",
  "Single Strike",
  "Sky",
  "Small Size",
  "Snowy",
  "Solo",
  "Speed",
  "Steel",
  "Sunny",
  "Super Size",
  "Therian",
  "Trash",
  "Ultra",
  "Unbound",
  "Wash",
  "Water",
  "White",
  "Zero",
];
