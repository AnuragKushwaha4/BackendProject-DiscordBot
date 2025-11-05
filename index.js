import 'dotenv/config';
const token = process.env.token
const API = process.env.aiResponseAPI
import { Client, GatewayIntentBits, Events, messageLink } from "discord.js";
import axios from 'axios';

const getAIResponse =async(query)=>{
    try{
        const response = await axios.post(API, { query: query })
        return response;
    }
    catch (error){
        console.log(error);
        return -1;
        
    }
}

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
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    console.log(interaction)
    await interaction.reply('Pong!');
  }
  else if(interaction.commandName === 'ai'){


    console.log(interaction.options.getString('query'))
    let query = interaction.options.getString('query')
    await interaction.deferReply();


    let response = await getAIResponse(query)
    console.log(response)
    await interaction.editReply(response.data.response);
  }
});


//login done using token provided by portal
client.login(token);