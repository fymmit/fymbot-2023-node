import { Client, Events, GatewayIntentBits, Message, TextChannel, Collection } from 'discord.js';
import { config } from 'dotenv';
import { timestamp } from './utils/datetimeUtils.js';
import commands from './commands/index.js';

config();

const { TOKEN } = process.env;

type GigaClient = Client & { commands: any }

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
] }) as GigaClient;

client.commands = new Collection();

for (const cmd of commands) {
    if ('data' in cmd && 'execute' in cmd) {
        client.commands.set(cmd.data.name, cmd);
    }
}

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, msg => {
    const author = msg.author.username;
    const { name: channelName } = msg.channel as TextChannel;
    const content = msg.content;

    console.log(`#${channelName} ${timestamp()} ${author}: ${content}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const c = interaction.client as GigaClient;
    const command = c.commands.get(interaction.commandName);

    const author = interaction.user.username;
    const channelName = interaction.channel.name;
    console.log(`#${channelName} ${timestamp()} ${author}: (cmd) /${interaction.commandName}`);

    try {
        await command.execute(interaction);
    } catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(TOKEN);
