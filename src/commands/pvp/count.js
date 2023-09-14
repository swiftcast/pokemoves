const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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

		await interaction.reply({ embeds: [getCountsEmbed()]});
	},
};

let getCountsEmbed = function() {
  const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  return exampleEmbed
}