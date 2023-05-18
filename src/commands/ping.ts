import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responds with "pong"');

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply('pong');
}

export default { data, execute };
