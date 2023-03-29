require('dotenv').config();
const { Client, Intents, MessageEmbed }  = require('discord.js');
const client  = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.login(process.env.TOKEN);

var prefix = '.'

// TODO: make into map later
const EMOJISTABLE = {
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

client.on('messageCreate', message => {

	//-----
	if (message.content === '.ping') {
		//msg.reply('Pong!');
		console.log('b')
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
		// command = command.toLowerCase()

		// // checks for dash
		// if (command.indexOf('-') > -1) { 
		// 	command = command.slice(0, command.indexOf('-')) + command.charAt(command.indexOf('-') + 1).toUpperCase() + command.slice(command.indexOf('-') + 1)
		// }
		
		let arr = command.split(' ')
		let arrThumb = [...arr]; // Used for the embed thumbnail

		// Edge case bc of the apostrophe isn't the same as the one on the keyboard
		if (arr[0].toLowerCase().search('arfetch') > -1) {
			arr[0] = 'Farfetch’d';
			arrThumb[0] = 'farfetchd';
		}

		if (arr.length > 1 && arr[1].search('mime') > -1) {
			arr[0] = 'Mr. Mime';
			if (arr.length == 3) {
				arr[1] = '(Galarian)';
			}
		}

		arr[0] = arr[0].charAt(0).toUpperCase() + arr[0].slice(1);


		// If it's a regional form noted by having a 2nd element in array
		if (arr.length > 1) {
			arr[1] = "(" + arr[1].charAt(0).toUpperCase() + arr[1].slice(1) + ")";
		}

		command = arr.join(' ');

		let pokemon = list.filter(poke => poke.name.toLowerCase() === command.toLowerCase())[0];

		if (pokemon == undefined) {
			return;
		}

		

		let types = ""
		// Capitalize first letter of each type
		for (let i = 0; i < pokemon.types.length; i++) {
			if (i == 1) types += ' ';
			//types += pokemon.types[i].charAt(0).toUpperCase() + pokemon.types[i].slice(1);
			types += `${client.emojis.cache.get(EMOJISTABLE[pokemon.types[i]])}`;
		}

		pokeEmbed.setTitle(`${pokemon.name} ${types}`);
		//pokeEmbed.setDescription(types);

		debugger;
		if (pokemon.name != "Mew") {
			//let fastMovesField = "----------\n"
			let fastMovesField = ""

			// Creates a field for each charge move 
			for (let i = 0; i < pokemon.counts.length; i++) {
				for (let j = 0; j < pokemon.counts[i].fastMoves.length; j++) {
					debugger;
					fastMovesField += `${client.emojis.cache.get(EMOJISTABLE[pokemon.counts[i].fastMoves[j].type])} ${pokemon.counts[i].fastMoves[j].name}: ${pokemon.counts[i].fastMoves[j].counts}\n`; 
				}
				fastMovesField += "----------\n";
				pokeEmbed.addField(`${client.emojis.cache.get(EMOJISTABLE[pokemon.counts[i].chargedMove.type])} ${pokemon.counts[i].chargedMove.name}`, fastMovesField, true);
				//fastMovesField = "----------\n";
				fastMovesField = "\n";
			}
		}

		// edge case for mew because it goes over 4000 embed char limit with the type emojis
		else {
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
		}

		//message.channel.send(command);

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
				case 'sunny':
					pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1]}.gif`);
					break;
				case 'rainy':
					pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1]}.gif`);
					break;
				case 'snowy':
					pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-${arrThumb[1]}.gif`);
					break;
				case 'normal':
					pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}.gif`);
					break;
				case 'male':
					pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}.gif`);
					break;
				case 'female':
					pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0]}-f.gif`);
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
			pokeEmbed.setThumbnail(`https://play.pokemonshowdown.com/sprites/ani/${arrThumb[0].toLowerCase()}.gif`)
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

let pokeEmbed = new MessageEmbed()


let buildhelper = require ("./build")
const dbhelper = require ("./db")
const list = buildhelper.buildList();
