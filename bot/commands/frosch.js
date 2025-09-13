import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('frosch')
        .setDescription('Grüßt die Madln!'),
    async execute(interaction) {
        await interaction.reply('seas die madln');
    },
};
