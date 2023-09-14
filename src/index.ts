import {
    Client,
    Events,
    GatewayIntentBits,
    Collection,
    ChannelType,
} from 'discord.js';
import { config } from 'dotenv';
import { timestamp } from './utils/datetimeUtils.js';
import commands from './commands/index.js';
import pg from 'pg';
import handleMessage from './handlers/messagehandler.js';

config();

const {
    TOKEN,
    TOKEN_TEST,
    PGDATABASE,
    PGDATABASE_TEST,
} = process.env;

type GigaClient = Client & { commands: any }

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
] }) as GigaClient;

client.commands = new Collection();

for (const cmd of commands) {
    if ('data' in cmd && 'execute' in cmd) {
        client.commands.set(cmd.data.name, cmd);
    }
}

export const pool = new pg.Pool(
    { database: PGDATABASE_TEST ?? PGDATABASE }
);

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async msg => {
    await handleMessage(msg);
});

client.on(Events.InteractionCreate, async interaction => {
    const c = interaction.client as GigaClient;
    if (interaction.isChatInputCommand()) {
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
    } else if (interaction.isAutocomplete()) {
        const command = c.commands.get(interaction.commandName);

        await command.autocomplete(interaction);

    } else {
        return;
    }
});

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    const dynamicId = '1073933883499880460';
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    const channelToFetchFrom = newChannel ?? oldChannel;
    const guild = channelToFetchFrom.guild;

    if (oldChannel && oldChannel.parentId === dynamicId) {
        const channels = (await guild.channels.fetch())
            .filter(x => x.parentId === dynamicId);
        if (channels.size > 1 && oldChannel.members.size === 0) {
            await channels.get(oldChannel.id).delete();
            channels.delete(oldChannel.id);
            if (channels.size === 1) {
                await channels.at(0).edit({
                    name: '1'
                });
            }
        }
    }
    if (newChannel && newChannel.parentId === dynamicId) {
        const channels = (await guild.channels.fetch())
            .filter(x => x.parentId === dynamicId);
        let channelsWithPeopleCount = 0;
        for (const item of channels) {
            const channel = item[1];
            if (channel.members.size > 0) {
                channelsWithPeopleCount++;
            }
        }
        if (channelsWithPeopleCount === channels.size) {
            const name = `${Number(channels.at(channels.size - 1).name) + 1}`;
            await guild.channels.create({
                name,
                type: ChannelType.GuildVoice,
                parent: newChannel.parent
            });
        }
    }
});

client.login(TOKEN_TEST ?? TOKEN);
