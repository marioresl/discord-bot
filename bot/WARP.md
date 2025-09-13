# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Discord.js v14 bot written in modern ES modules (Node.js). The bot uses slash commands and follows a modular architecture with separate handlers for commands and events.

## Core Architecture

### Main Components

- **`index.js`**: Entry point that initializes the Discord client, loads commands/events, and handles authentication
- **`utils/commandHandler.js`**: Dynamically loads all `.js` files from the `commands/` directory and registers them with the client
- **`utils/eventHandler.js`**: Dynamically loads all `.js` files from the `events/` directory and attaches event listeners
- **`config/config.json`**: Bot configuration including prefix, embed colors, version, and bot metadata

### Directory Structure

```
bot/
├── index.js                 # Main entry point
├── config/
│   └── config.json         # Bot configuration
├── commands/               # Slash command definitions
│   ├── frosch.js
│   └── hep.js
├── events/                 # Event handlers
│   ├── ready.js           # Bot startup and slash command registration
│   └── interactionCreate.js # Slash command execution
└── utils/                 # Core utilities
    ├── commandHandler.js  # Command loading logic
    └── eventHandler.js    # Event loading logic
```

### Command Structure

All commands must export a default object with:
- `data`: A `SlashCommandBuilder` instance defining the command
- `execute`: Async function that handles the command interaction

### Event Structure

All events must export a default object with:
- `name`: The Discord.js event name
- `once`: Boolean indicating if it's a one-time event (optional)
- `execute`: Function that handles the event

## Development Commands

### Running the Bot

```bash
# Start the bot in production mode
npm start

# Start the bot with auto-reload for development
npm run dev
```

### Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in the required environment variables:
   - `BOT_TOKEN`: Discord bot token
   - `CLIENT_ID`: Discord application client ID
   - `GUILD_ID`: Discord guild ID (optional, for faster development command updates)

### Adding New Commands

1. Create a new `.js` file in the `commands/` directory
2. Export a default object with `data` (SlashCommandBuilder) and `execute` properties
3. The command will be automatically loaded on next bot restart

### Adding New Events

1. Create a new `.js` file in the `events/` directory
2. Export a default object with `name`, optional `once`, and `execute` properties
3. The event will be automatically loaded on next bot restart

## Key Implementation Details

### Slash Command Registration

- Commands are automatically registered with Discord on bot startup via the `ready.js` event
- If `GUILD_ID` is provided, commands are registered as guild-specific (faster updates)
- Otherwise, commands are registered globally (takes up to 1 hour to propagate)

### ES Modules

- Project uses ES modules (`"type": "module"` in package.json)
- All imports use ES6 `import/export` syntax
- File imports require full file paths including `.js` extension
- For JSON imports, use `createRequire` as shown in `ready.js`

### Error Handling

- Global error handlers for unhandled rejections and uncaught exceptions
- Command execution errors are caught and reported to users with ephemeral messages
- Comprehensive logging with emoji indicators for different log levels

### Bot Configuration

- Bot settings are centralized in `config/config.json`
- Activity status is set automatically on startup
- German language is used for console logging and some user messages
