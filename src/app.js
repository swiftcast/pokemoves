require('dotenv').config();
const { Client, Intents, MessageEmbed }  = require('discord.js');
const client  = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.login(process.env.TOKEN);

var prefix = '.'

client.on('messageCreate', message => {
  if (message.content === '.ping') {
    //msg.reply('Pong!');
    message.channel.send('Pong!');
  }

  if (message.content === '.hi') {
    //msg.reply('Pong!');
    message.channel.send('hi ur qt');
  }

  if (message.content.startsWith(prefix + "count ")) {
	//let beginIndex = 
	let command = message.content.slice((prefix + "count ").length);

	// Cleans input
	command = command.toLowerCase()
	let arr = command.split(' ')
	let arrThumb = [...arr]; // Used for the embed thumbnail
	arr[0] = arr[0].charAt(0).toUpperCase() + arr[0].slice(1);

	// If it's a regional form noted by having a 2nd element in array
	if (arr.length > 1) {
		arr[1] = "(" + arr[1].charAt(0).toUpperCase() + arr[1].slice(1) + ")";
	}

	command = arr.join(' ');

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
			fastMovesField += `**${pokemon.counts[i].fastMoves[j].name}**: ${pokemon.counts[i].fastMoves[j].counts}\n`; 
		}
		pokeEmbed.addField(pokemon.counts[i].chargedMove.name, fastMovesField, true);
		fastMovesField = "";
	}

	if (arrThumb.length > 1) {

		switch(arrThumb[1]) {
			case 'galarian':
				pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1].slice(0, -3)}.gif`);
				break;
			case 'alolan':
				pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1].slice(0, -1)}.gif`);
				break;
			case 'therian':
				pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1]}.gif`);
				break;
			case 'armoured':
				pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}.gif`);
				break;
			/*ase 'crowned':
				pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1]}.gif`);
				break;
			case 'hisuian':
				pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1].slice(0, -2)}.gif`);
				break;*/
			default:
				break;
		}
	}

	else {
		pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}.gif`)
	}

	dbhelper.connectToDb();
	dbhelper.insertUser(message.author.id, 1);
	dbhelper.closeDb();
	
	
	//pokeEmbed.addField('Types', types);
    message.channel.send({ embeds: [pokeEmbed] });
	pokeEmbed = new MessageEmbed();
	//message.channel.send(pokemon);
  }
});

var pokeEmbed = new MessageEmbed()


let buildhelper = require ("./build")
const dbhelper = require ("./db")
const list = buildhelper.buildList();