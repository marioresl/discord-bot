import { REST, Routes } from 'discord.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('../config/config.json');

export default {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`🚀 ${client.user.tag} ist online!`);
        console.log(`📊 Auf ${client.guilds.cache.size} Servern aktiv`);

        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const rest = new REST().setToken(process.env.BOT_TOKEN);

        try {
            console.log(`🔄 Starte Registrierung von ${commands.length} Slash Commands...`);

            const data = await rest.put(
                process.env.GUILD_ID 
                    ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
                    : Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );

            console.log(`✅ Erfolgreich ${data.length} Slash Commands registriert!`);
        } catch (error) {
            console.error('❌ Fehler beim Registrieren der Slash Commands:', error);
        }

        client.user.setActivity(`${config.prefix}help | ${config.version}`, {
            type: 'WATCHING' 
        });
    },
};
