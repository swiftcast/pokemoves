require('dotenv').config();
const { Client, Intents, MessageEmbed }  = require('discord.js');
const client  = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.login(process.env.TOKEN);

var prefix = '!'
//var pokemon = ""
var chargeMove = ""



client.on('messageCreate', message => {
  if (message.content === 'ping') {
    //msg.reply('Pong!');
    message.channel.send('Pong!');
  }

  if (message.content.startsWith(prefix + "count ")) {
	//let beginIndex = 
	let command = message.content.slice((prefix + "count ").length);
    //msg.reply('Pong!');
	let pokemon = list.filter(poke => poke.name === command)[0];
	pokeEmbed.setTitle(`${pokemon.name}`);

	let types = ""
	pokemon.types.forEach(type => types += type + " ");

	pokemon.counts[0].fastMoves.forEach(fastMove => pokeEmbed.addField(fastMove.name, `+${fastMove.energy} energy / ${fastMove.turns} turn`, true));
	//pokeEmbed.addField(pokemon.counts[0].fastMoves[0].name + '', 'hi')
	
	pokeEmbed.addField('Types', types);
    message.channel.send({ embeds: [pokeEmbed] });
	//message.channel.send(pokemon);
  }
});

const pokeEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('')
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


console.log(list[0].name)
console.log(list[0].types)
console.log(list[0].counts)
console.log(list[0].counts.fastMoves)
console.log(list[0].counts[0].fastMoves)
console.log(list[0].counts[1].fastMoves)
console.log(list[0].counts[0].fastMoves[0].name)
console.log(list[0].counts[0].fastMoves[0].energy)
console.log(list[0].counts[0].fastMoves[0].turns)

var result = list.filter(poke => poke.name === "Haunter")[0]

console.log(result);