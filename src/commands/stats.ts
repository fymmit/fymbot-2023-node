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
            where lower(author) not like lower('%bot%')
            group by author
            order by c desc;`,
        rowMode: 'array'
    };
    const result = await pool.query(query);

    console.log(result.rows);



    const embed = new EmbedBuilder()
        .setTitle('Stats')
        .addFields(
            result.rows.map(r => ({ name: r[0], value: r[1] }))
        )
        .setTimestamp();
    await interaction.editReply({ embeds: [embed] });
}

export default { data, execute };
