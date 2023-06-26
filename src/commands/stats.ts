import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';
import { pool } from '../index.js';

const data = new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows some stats');

const execute = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();

    const query = {
        text: `
            select author, count(*) c
            from message m
            group by author
            order by c desc;`,
        rowMode: 'array'
    };
    const { rows } = await pool.query(query);

    const longestRow = [...rows].sort((a, b) => `${b[0]}${b[1]}`.length - `${a[0]}${a[1]}`.length)[0];
    const longestRowLength = `${longestRow[0]}${longestRow[1]}`.length;

    const messageStats = rows.map(([name, value]) => {
        let spaceAmount = longestRowLength - `${name}${value}`.length;
        if (spaceAmount !== 0) spaceAmount++;
        const rowValue = `\`\`${name}: ${new Array(spaceAmount).join(' ')}${value}\`\``;
        return rowValue;
    }).join('\r\n');

    const embed = new EmbedBuilder()
        .setTitle('Stats')
        .addFields(
            { name: 'Message stats', value: messageStats }
        )
        .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
}

export default { data, execute };
