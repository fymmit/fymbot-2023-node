import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import commands from './dist/commands/index.js';

config();

const { TOKEN, APP_ID, GUILD_ID } = process.env;

const cmds = commands.filter(c => 'data' in c && 'execute' in c).map(c => c.data.toJSON());

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(APP_ID, GUILD_ID),
			{ body: cmds },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
