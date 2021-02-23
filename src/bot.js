// Import environment variables
// provess.env. BOT_TOKEN, PREFIX, TEST_CHANNEL, MONGO_URI
require("dotenv").config();

const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();
const cron = require('node-cron');

const d = require('./lib');
// const rr = require('./rr');
const commands = require('./commands');
const actions = require('./actions');

// One time things here
client.on("ready", ()=> {
	console.log(`${client.user.tag} logged in`);
	client.user.setPresence({
        status: "online",
        activity: {
            name: `${process.env.PREFIX}help`,
            type: "PLAYING"
        }
    });
});

/**
cron.schedule('* * * * *', function() {
	try{
		// client.channels.cache.get(process.env.TEST_CHANNEL).send("CRON SCHEDULING ON HEROKU?");
	}
	catch(e){
		console.log(e);
	}

  	console.log('Running a task every minute');
});
**/

client.on("message", async function(message){
	if (message.channel.type != 'text' || message.author.bot) {
		return;
	}
	console.log(`[${message.author.tag}]: ${message.content}`);

	var msg = d.parseMessage(message.content, message.guild.id, async function(msg, prefix){
		// console.log(msg);
		if (!msg || msg[0] == ""){
			return;
		}
		switch(msg[0]){
			case "hello": case "hi": case "yo": case "hey":
				commands.hello(message);
				break;
			case "prefix": case "pfx":
				commands.prefix(message, msg[1]);
				break;
			case "help":
				commands.help(message, msg, prefix);
				break;
			case "poke": case "hug": case "kiss": case "cuddle": case "pat": case"slap":
				var person = message.mentions.members.first();
				if (!person){
					message.channel.send("Please mention a valid user to " + msg[0]);
					return;
				}
				actions.parseAction(message, msg[0], person);
				break;
			case "inv": case "invite": case "info": case "about": case "akira":
				commands.info(message);
				break;
			case "kick":
				commands.kick(message);
				break;
			case "ban":
				commands.ban(message);
				break;
			case "unban":
				commands.unban(message, msg, prefix);
				break;
			default:
				message.channel.send("Please use valid command.\nTo view all commands, type " + process.env.PREFIX + "help");
		}
	});
});

/** Ghost Ping
client.on("messageDelete", (message)=> {
	if (message.author.bot){
		return;
	}
	var text = message.content;
	console.log(`[${message.author.tag} DELETED]: ${text}`);
	for (var i = 0; i < text.length; ++i){
		if (text[i] == "@"){
			// Check further for ghost ping...

			message.channel.send(`Ghost ping detected! How shameful of you, <@${message.author.id}>...`);
		}
	}
});
**/

// Connect to Discord API gateway
client.login(process.env.BOT_TOKEN);