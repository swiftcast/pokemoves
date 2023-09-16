const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

//let buildhelper = require ("../../build")
//const list = buildhelper.buildData();

let list = reloadJsonData();

module.exports = {
	reloadJsonData,
	data: new SlashCommandBuilder()
        .setName('count')
        .setDescription('Replies with move counts for a Pokemon')
        .addStringOption(option =>
            option.setName('pokemon')
                .setDescription('The Pokemon whose moves are to be returned')
                .setMaxLength(200)
                .setRequired(true)),
    async execute(interaction) {
		const pokemon = interaction.options.getString('pokemon') ?? 'wigglytuff';

    const pokeEmbed = getCountsEmbed(pokemon)
		await interaction.reply({ embeds: [pokeEmbed]});
	},
};

function getPokemonObj(command) {
  return list.pokemon.filter(poke => poke.name.toLowerCase() === command.toLowerCase())[0];
}

function getMovesFields(pokemonObj) {
    let chargedMoves = pokemonObj.chargedMoveIds;
    let fastMoves = pokemonObj.fastMoveIds;
    let fields = [];

    // Loop through charged moves
    for (let i = 0; i < chargedMoves.length; i++) {
        let chargedMoveName = list.moves[chargedMoves[i]].name;
        let fastMovesField = "";

        // Loop through fast moves for each charged move
        for (let j = 0; j < fastMoves.length; j++) {
            fastMovesField += `**${list.moves[fastMoves[j]].name}**: ${list.counts[fastMoves[j]][chargedMoves[i]]}\n`;
        }

        // Add the charged move and its corresponding fast moves to the fields
        fields.push({
            name: chargedMoveName,
            value: fastMovesField,
            inline: true, // You can change this based on your layout preference
        });
    }

    return fields;
}


let getCountsEmbed = function(pokemonInput, form) {
  let pokemonObj = getPokemonObj(pokemonInput)

  if (!pokemonObj) {
    return new EmbedBuilder()
        .setColor(0xFF0000) // Red color for error
        .setTitle('Pokemon not found')
        .setDescription(`The Pokemon "${pokemonInput}" was not found.`);
  }

  const typeString = (pokemonObj.types || []).map(type => {
    const emote = typeEmote[type.toLowerCase()];
    return emote ? `<:${type}:${emote}>` : type; // Use emote if available, or type name
}).join(' ');


  const pokeEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(`${pokemonObj.name} ${typeString}`)
	//.setURL('https://discord.js.org/')
	//.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	//.setDescription('Some description here')
	.setThumbnail(generateThumbnailURL(pokemonObj.name) )
	/*.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })*/
	//.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFields(getMovesFields(pokemonObj))
	//.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

 return pokeEmbed
}

function generateThumbnailURL(pokemonName, thumbType) {
	const baseUrl = 'https://play.pokemonshowdown.com/sprites/ani/';
	switch (thumbType) {
	  case 'galarian':
	  case 'alolan':
	  case 'therian':
	  case 'armoured':
	  case 'sunny':
	  case 'rainy':
	  case 'snowy':
		return `${baseUrl}${pokemonName}-${thumbType}.gif`;
	  case 'female':
		return `${baseUrl}${pokemonName}-f.gif`;
	  default:
		return `${baseUrl}${pokemonName.toLowerCase()}.gif`;
	}
  }

  function reloadJsonData() {
	// Reload your JSON data here
	try {
	  const data = fs.readFileSync('../data/pokemovesdata.json', 'utf8');
	  console.log("JSON reloaded.")
	  return JSON.parse(data);
	} catch (error) {
	  console.error('Error reloading JSON data:', error.message);
	  throw new Error('An error occurred while reloading the JSON data.');
	}
  }

  const typeEmote = {
	normal: '952453832938500146',
	water: '952453832762347542',
	grass: '952453832883961866',
	electric: '952453832875606056',
	ice: '952453832816869377',
	fighting: '952453832825274378',
	fire: '952453832837849209',
	poison: '952453832976261180',
	ground: '952453832422617160',
	flying: '952453832888156210',
	psychic: '952453832951070770',
	bug: '952453832439377972',
	rock: '952453833018179614',
	ghost: '952453832485527564',
	dark: '952453832825241640',
	dragon: '952453833500553276',
	steel: '952453832883994654',
	fairy: '952453832611360810'
}
