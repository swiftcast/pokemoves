const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
let buildhelper = require ("../../build")
const list = buildhelper.buildData();

module.exports = {
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

function getPokemon(command) {
  return list.pokemon.filter(poke => poke.name.toLowerCase() === command.toLowerCase())[0];
}

function getMovesFields(pokemonObj, pokeEmbed) {
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
  pokemon = getPokemon(pokemonInput)

  if (!pokemon) {
    return new EmbedBuilder()
        .setColor(0xFF0000) // Red color for error
        .setTitle('Pokemon not found')
        .setDescription(`The Pokemon "${pokemonInput}" was not found.`);
  }

  const pokeEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(pokemon.name)
	//.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail(generateThumbnailURL(pokemon.name) )
	/*.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })*/
  	//.addFields(getMovesFields(pokemon, exampleEmbed))
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFields(getMovesFields(pokemon))
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  //getMovesFields(pokemon, pokeEmbed)

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