export default {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ Kein Command gefunden: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
            console.log(`✅ Command ausgeführt: ${interaction.commandName} von ${interaction.user.tag}`);
        } catch (error) {
            console.error(`❌ Fehler beim Ausführen des Commands ${interaction.commandName}:`, error);
            
            const errorMessage = 'Es gab einen Fehler beim Ausführen dieses Commands!';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: errorMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: errorMessage, ephemeral: true });
            }
        }
    },
};
