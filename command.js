import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const token = process.env.token;
const clintID = process.env.clintID;

const commands = [
  {
    name: 'ping',
    description: 'reply with pong',
  },
  {
    name:'ai',
    description: 'AI assistant to users with Their Queries.',
    options: [
      {
        name: 'query',
        description: 'Your question or message for the AI.',
        type: 3,
        required: true,
      }
    ]

  }
];

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(clintID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}