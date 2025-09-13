import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('hep')
        .setDescription('Macht einmal Hep!'),
    async execute(interaction) {
        await interaction.reply('HEP!');
    },
};
