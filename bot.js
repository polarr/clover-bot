// Import environment variables
// provess.env. BOT_TOKEN, PREFIX, 
require("dotenv").config();

const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();
const cron = require('node-cron');

/** 
	EMBED WRAPPER

	@param{color} Hex Integer
	@param{title, url} String
	@param{author} {name: (String), icon_url: (IMG URL String)}
	@param{description, thumbnail (IMG URL)} String
	@param{fields} [{name: string, value: string}, (inline), ...]
	@param{image} IMG URL String
	@param{timestamp} Date();
	@param{footer} {text: (String), icon_url: (String)}
**/

var embed = function(color, title, url, author, description, thumbnail, fields, image, timestamp, footer){
	var em = {
		embed: {
		    color: color ?? undefined,
		    author: author ?? undefined,
		    title: title ?? undefined,
		    url: url ?? undefined,
		    description: description ?? undefined,
		    fields: fields ?? undefined,
		    image: image ?? undefined,
		    timestamp: timestamp ?? undefined,
		    footer: footer ?? undefined
	  	}
	};

	return em;
};


function sendMessage(channel, msg){
	try{
		var channel = client.channels.cache.get(channel);
		channel.send(msg);
	} catch (e){
		console.log(e);
	}
}

// One time things here
client.on("ready", ()=> {
	console.log(`${client.user.tag} logged in`);
	var testEmbed = embed("#000000", 
		"Test", 
		"https://google.com", 
		{name: "Charles", icon_url: "https://i.pinimg.com/originals/7d/f0/7f/7df07f487fa52c55b4fe977926003365.jpg"}, 
		"Testing Custom Embed Wrapper",
		"https://i.pinimg.com/originals/7d/f0/7f/7df07f487fa52c55b4fe977926003365.jpg",
		[{name: "hi1", value: "hey1"}, {name:"hi2", value: "hey2"}],
		"https://i.pinimg.com/originals/7d/f0/7f/7df07f487fa52c55b4fe977926003365.jpg",
		new Date(),
		{text: "Copyright", icon_url: "https://i.pinimg.com/originals/7d/f0/7f/7df07f487fa52c55b4fe977926003365.jpg"}
	);

	// sendMessage(process.env.TEST_CHANNEL, testEmbed);
	client.user.setPresence({
        status: "online",
        activity: {
            name: `${process.env.PREFIX}help`,
            type: "PLAYING"
        }
    }); 
});

/**
	COMMANDS

	Hello! - Choose from (Hello, [name]!), (Hey, [name]!), (What's up?). 
	But check if their name is a ping, and if so reply (What a clever one. But that won't make it past me ;))

	[P]Help - Show help menu with list of commands
	[P]Prefix [NEW_P] - Change prefix from P to NEW_P
	[P]Source/Credit - Show Github source and 1egend's credit
**/

/**
cron.schedule('* * * * *', function() {
	try{
		
	}
	catch(e){
		console.log(e);
	}

  	console.log('Running a task every minute');
});
**/

function parseCommand(message){
	var command = [""];
	if (message[0] != process.env.PREFIX){
		return false;
	}

	var z = 0;
	for (var i = 1; i < message.length; ++i){
		if (message[i] == " "){
			++z;
			command.push("");
			continue;
		}

		command[z] += message[i];
	}

	for (var i = 0; i < command.length; ++i){
		if (command[i] == ""){
			command.splice(i, 1);
			--i;
		}
	}

	return command;
}

var greetings = ["Hey! <@", "What's up? <@", "Hello, <@"];
client.on("message", (message)=> {
	if (message.author.bot) {
		return;
	}
	console.log(`[${message.author.tag}]: ${message.content}`);

	var msg = parseCommand(message.content);
	// console.log(msg[1]);
	if (msg[0] === "hello"){
		if (message.author.username == "everyone" || message.author.username == "here"){
			message.reply("What a clever one. But that won't make it past me ;)")
		}
		else{
			var randomN = Math.floor(3 * Math.random());
			message.channel.send(greetings[randomN] + message.author + '>');
		}

		return;
	}

	if (msg[0] == "prefix"){
		if (msg[1].length == 1){
			process.env.PREFIX = msg[1];
			message.channel.send(`Prefix successfully changed to ${msg[1]}`);
		}
		else{
			message.channel.send(`Please input a valid prefix to change to. The format is, ` + process.env.PREFIX + `prefix [prefix]`);
			message.channel.send(`The prefix must be one character long`);
		}
		return;
	}

	if (msg[0] == "help"){
		var helpEmbed = embed("#000000",
			"Welcome to the help menu!", 
			"https://1e9end.github.io/1egendBot/commands.md", undefined,
			"I am still in alpha development, and have limited functionality.", undefined,
			[{name: "My current prefix is", value: process.env.PREFIX}, {name: "Commands", value: "help, hello, prefix"}, {name: "Documentation", value: "See [Github Documentation](https://1e9end.github.io/1egendBot/commands.md) for my full list of commands"}], undefined, undefined,
			{text: "©2020-2021 1egend#3493"}
		);
		message.channel.send(helpEmbed);
	}
});

client.on("messageDelete", (message)=> {
	var text = message.content;
	console.log(`[${message.author.tag}] deleted: ${text}`);
	for (var i = 0; i < text.length; ++i){
		if (text[i] == "@"){
			// Check further for ghost ping...

			// If ghost ping, send...
			message.channel.send(`Ghost ping detected! How shameful of you, <@${message.author.id}>...`);
		}
	}
});

function runCommand(command){
	switch(command){
		case command[0] == "prefix":
		break;
		default:
			return false;
	}
}

// Connect to Discord API gateway
client.login(process.env.BOT_TOKEN);