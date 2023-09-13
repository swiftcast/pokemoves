const { SlashCommandBuilder } = require('discord.js');

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

		await interaction.reply(`${pokemon}`);
	},
};