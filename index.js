import 'dotenv/config';
const token = process.env.token

import { Client, GatewayIntentBits, messageLink } from "discord.js";



//it is virtual client used to interact through server:
//passing intent : means what permission are given .means give list of permission to the client

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent] });

client.on("messageCreate",(message)=>{
    if(message.author.bot) return;
    message.reply({
        content:"Hi From Anurag's Bot "
    })
    
})

//interaction is actually for commands that we create .
client.on("interactionCreate",(interaction)=>{
    console.log(inter)
    interaction.reply("Pong!!")
})


//login done using token provided by portal
client.login(token);