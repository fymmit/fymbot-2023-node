import { SlashCommandBuilder, ChatInputCommandInteraction, AutocompleteInteraction } from 'discord.js';
import fetch from 'node-fetch';
import { FormData, File } from 'formdata-node'
import { FormDataEncoder } from 'form-data-encoder'
import { Readable } from 'stream'

const baseUrl = 'https://fympix.com';

const data = new SlashCommandBuilder()
    .setName('fympix')
    .setDescription('Post/search images from fympix')
    .addSubcommand(sub => sub
        .setName('search')
        .setDescription('Search for images')
        .addStringOption(option =>
            option
                .setName('query')
                .setDescription('Tag(s) to search for (space separated)')
            ))
    .addSubcommand(sub => sub
        .setName('add')
        .setDescription('Post new image to fympix')
        .addAttachmentOption(opt => opt
            .setName('image')
            .setDescription('Image to post')
            .setRequired(true))
        .addStringOption(opt => opt
            .setName('tags')
            .setDescription('Tag(s) for new image (space separated)')))

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    if (interaction.options.getSubcommand() === 'search') {
        const queryOption = interaction.options.getString('query') ?? '';
        const tags = queryOption.split(' ');
        const query = '?tags=' + tags.join('&tags=');
        const url = `${baseUrl}/api/images${query}`;

        const res = await fetch(url);
        const images = await res.json() as { name: string }[];

        if (images.length === 0) {
            await interaction.followUp({ content: 'No images found', ephemeral: true });
        } else {
            const random = Math.floor(Math.random() * images.length);
            const image = images[random].name;

            await interaction.editReply(`${baseUrl}/${image}`);
        }
    } else if (interaction.options.getSubcommand() === 'add') {
        const tags = interaction.options.getString('tags') ?? '';
        const attachment = interaction.options.getAttachment('image');
        if (attachment.contentType.split('/')[0] !== 'image') {
            await interaction.followUp({ content: 'Not an image', ephemeral: true });
        }

        const attachmentRes = await fetch(attachment.url);
        const arrayBuffer = await attachmentRes.arrayBuffer();

        const form = new FormData();
        form.append('image', new File([arrayBuffer], 'temp', {
            type: 'image/png'
        }));
        form.append('tags', tags);

        const encoder = new FormDataEncoder(form);
        const res = await fetch(`${baseUrl}/api/images`, {
            method: 'POST',
            body: Readable.from(encoder),
            headers: encoder.headers
        });

        if (!res.ok) {
            console.log(await res.text());
            throw new Error('Api fail');
        } else {
            const data = await res.json() as { name: string; };
            await interaction.editReply(`${baseUrl}/${data.name}`);
        }


        // const res = await fetch(`${baseUrl}/api/images`, {
        //     method: 'POST',
        //     body: body,
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }
        // });

    } else {
        throw new Error('Cringe fail');
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
