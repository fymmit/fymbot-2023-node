import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { createWorker } from 'tesseract.js';

const data = new SlashCommandBuilder()
    .setName('readtext')
    .setDescription('Read text from an image')
    .addAttachmentOption(option =>
        option
            .setName('image')
            .setDescription('Image to read text from')
            .setRequired(true));

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    const attachment = interaction.options.getAttachment('image');
    if (attachment.contentType.split('/')[0] !== 'image') {
        await interaction.followUp({ content: 'Not an image.', ephemeral: true });
    }

    const worker = await createWorker({});

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.loadLanguage('fin');
    await worker.initialize('fin');
    let { data: { text } } = await worker.recognize(attachment.url);

    if (text.length > 2000) {
        text = text.slice(0, 1900) + '...';
    }

    await worker.terminate();

    await interaction.editReply(text);
}

export default { data, execute };
