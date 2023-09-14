import { Message, TextChannel } from 'discord.js';
import { timestamp } from '../utils/datetimeUtils.js';
import { pool } from '../index.js';

const handle = async (msg: Message) => {
    const author = msg.author.username;
    const { name: channel } = msg.channel as TextChannel;
    const { id, content } = msg;
    const ts = timestamp(true);

    console.log(`#${channel} ${ts} ${author}: ${content}`);
    const insert = 'INSERT INTO message (author, content, channel, timestamp) VALUES ($1, $2, $3, $4)';
    await pool.query(insert, [author, content, channel, new Date()]);
}

export default handle;
