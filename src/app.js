require('dotenv').config();
const { Client, Intents, MessageEmbed }  = require('discord.js');
const client  = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.login(process.env.TOKEN);

var prefix = '!'

client.on('messageCreate', message => {
  if (message.content === 'ping') {
    //msg.reply('Pong!');
    message.channel.send('Pong!');
  }

  if (message.content.startsWith(prefix + "count ")) {
	//let beginIndex = 
	let command = message.content.slice((prefix + "count ").length);

	// Cleans input
	command = command.toLowerCase()
	command = command.charAt(0).toUpperCase() + command.slice(1);

	let pokemon = list.filter(poke => poke.name === command)[0];

	if (pokemon == undefined) {
		return;
	}

	pokeEmbed.setTitle(`${pokemon.name}`);

	let types = ""
	// Capitalize first letter of each type
	for (let i = 0; i < pokemon.types.length; i++) {
		if (i == 1) types += '/';
		types += pokemon.types[i].charAt(0).toUpperCase() + pokemon.types[i].slice(1);
	}

	pokeEmbed.setDescription(types);

	debugger;
	let fastMovesField = ""

	// Creates a field for each charge move 
	for (let i = 0; i < pokemon.counts.length; i++) {
		for (let j = 0; j < pokemon.counts[i].fastMoves.length; j++) {
			debugger;
			fastMovesField += `**${pokemon.counts[i].fastMoves[j].name}**: ${pokemon.counts[i].fastMoves[j].counts} \n`; 
		}
		pokeEmbed.addField(pokemon.counts[i].chargedMove.name, fastMovesField, true);
		fastMovesField = "";
	}

	//pokeEmbed.addField(pokemon.counts[i].chargedMove.name, fastMovesField, true);
	
	
	//pokeEmbed.addField('Types', types);
    message.channel.send({ embeds: [pokeEmbed] });
	pokeEmbed = new MessageEmbed();
	//message.channel.send(pokemon);
  }
});

var pokeEmbed = new MessageEmbed()
	//.setColor('#0099ff')
	//.setTitle('')
	//.setURL('https://discord.js.org/')
	//.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	//.setDescription('Some description here')
	//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	/*.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png')*/;


let buildhelper = require ("./build")
const list = buildhelper.buildList();


/*console.log(list[0].name)
console.log(list[0].types)
console.log(list[0].counts)
console.log(list[0].counts.fastMoves)
console.log(list[0].counts[0].fastMoves)
console.log(list[0].counts[1].fastMoves)
console.log(list[0].counts[0].fastMoves[0].name)
console.log(list[0].counts[0].fastMoves[0].energy)
console.log(list[0].counts[0].fastMoves[0].turns)*/

//var result = list.filter(poke => poke.name === "Haunter")[0]
var result = list.filter(poke => poke.name === "Haunter")[0]
console.log(result);
console.log(result.counts)
console.log(result.counts[0].fastMoves)
console.log(result.counts[0].fastMoves[0])
console.log(result.counts[0].fastMoves[0].counts)
