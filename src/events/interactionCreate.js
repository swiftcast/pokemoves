const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		//if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			if (interaction.isAutocomplete()) {
				await command.autocomplete(interaction);
			} else {
				await command.execute(interaction);
			}
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			try {
				await interaction.reply({ content: "There was an error while executing this command, please try again", ephemeral: true });
			} catch {
				return;
			}


		/*if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				if (interaction.isAutocomplete()) {
					await command.autocomplete(interaction);
				} else {
					await command.execute(interaction);
				}
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
				try {
					await interaction.reply({ content: "There was an error while executing this command, please try again", ephemeral: true });
				} catch {
					return;
				}
			}*/
		}
	},
};
