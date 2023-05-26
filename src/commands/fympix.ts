import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import fetch from 'node-fetch';

const baseUrl = 'https://fympix.com';

const data = new SlashCommandBuilder()
    .setName('fympix')
    .setDescription('Fetches images from fympix')
    .addStringOption(option =>
        option
            .setName('query')
            .setDescription('Tag(s) to search for (space separated)')
        );

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const queryOption = interaction.options.getString('query') ?? '';
    const tags = queryOption.split(' ');
    const query = '?tags=' + tags.join('&tags=');
    const url = 'https://fympix.com/api/images' + query;


    const res = await fetch(url);
    const images = await res.json() as { name: string }[];

    if (images.length === 0) {
        await interaction.editReply('No images found.');
    } else {
        const random = Math.floor(Math.random() * images.length);
        const image = images[random].name;


        await interaction.editReply(`${baseUrl}/${image}`);
        // await interaction.reply(`${baseUrl}/${image}`);
    }
}

const autocomplete = async (interaction: AutocompleteInteraction) => {
    const queryOption = interaction.options.getString('query') ?? '';
    const tags = queryOption.split(' ');
    const query = '?tags=' + tags.join('&tags=');
    const url = 'https://fympix.com/api/images' + query;

    const res = await fetch(url);
    const data = await res.json() as { name: string }[];

    const images = data.length >= 25 ? data.slice(0, 25) : data;

    await interaction.respond(
        images.map(i => ({ name: `${baseUrl}/${i.name}`, value: `${baseUrl}/${i.name}` }))
    );
}

export default {
    data,
    execute,
    // autocomplete
};
