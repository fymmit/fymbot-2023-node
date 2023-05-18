import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import fetch from 'node-fetch';

const data = new SlashCommandBuilder()
    .setName('fympix')
    .setDescription('Fetches images from fympix')
    .addStringOption(option =>
        option
            .setName('tag')
            .setDescription('Tag(s) to search for (space separated)'));

const execute = async (interaction: ChatInputCommandInteraction) => {
    const tagOption = interaction.options.getString('tag') ?? '';
    const tags = tagOption.split(' ');
    const query = '?tags=' + tags.join('&tags=');
    const url = 'https://fympix.com/api/images' + query;

    const res = await fetch(url);
    const images = await res.json() as { name: string }[];

    const random = Math.floor(Math.random() * images.length);
    const image = images[random].name;

    const baseUrl = 'https://fympix.com';
    await interaction.reply(`${baseUrl}/${image}`);
}

export default { data, execute };
