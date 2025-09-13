import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { loadCommands } from './utils/commandHandler.js';
import { loadEvents } from './utils/eventHandler.js';

// Umgebungsvariablen laden
config();

// Bot-Client erstellen
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Commands Collection für den Client
client.commands = new Collection();

// Initialisierung
async function initialize() {
    try {
        console.log('🔧 Lade Commands...');
        await loadCommands(client);
        
        console.log('🔧 Lade Events...');
        await loadEvents(client);
        
        console.log('🔐 Bot wird gestartet...');
        await client.login(process.env.BOT_TOKEN);
    } catch (error) {
        console.error('❌ Fehler beim Starten des Bots:', error);
        process.exit(1);
    }
}

// Process Event Handlers für sauberes Beenden
process.on('unhandledRejection', error => {
    console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('❌ Uncaught exception:', error);
    process.exit(1);
});

// Bot starten
initialize();
