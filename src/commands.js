/**
	COMMANDS MODULE

	Hello! - Choose from (Hello, [name]!), (Hey, [name]!), (What's up?). 
	But check if their name is a ping, and if so reply (What a clever one. But that won't make it past me ;))

	[P]Help - Show help menu with list of commands
	[P]Prefix [NEW_P] - Change prefix from P to NEW_P
	[P]Source/Credit - Show Github source and 1egend's credit
**/

const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();
const nekos = require('nekos.life');
const neko = new nekos();

const d = require('./lib');

const greetings = ["Hey! <@", "What's up? <@", "Hello, <@", "How's it going? <@", "Hi! <@"];
function hello(message){
	if (message.author.username == "everyone" || message.author.username == "here"){
		message.reply("What a clever one. But that won't make it past me ;)")
	}
	else{
		var randomN = Math.floor(3 * Math.random());
		message.channel.send(greetings[randomN] + message.author + '>');
	}
}

const prefixes = ['!', '$', '.', '%', '^', '&', '*', '?', ';', '~', '+', '-', '=', '>', '<'];
function prefix(message, pfx){
	if (!pfx || pfx.length != 1){
		message.channel.send(`The prefix must be one character long`);
	}
	else{
		for (var i = 0; i < prefixes.length; ++i){
			if (pfx == prefixes[i]){
				d.setPrefix(message.guild.id, pfx);
				message.channel.send(`Prefix successfully changed to ${pfx}`);
				return;
			}
		}
		message.channel.send(`The prefix can only be chosen from !, $, ., %, ^, &, *, ?, ;, ~, +, -, =, >, <`);
	}
	
}

const descriptions = [["hello", "Greets you warmly :heart:", "None"], ["prefix", "Changes your prefix", "[prefix] - A single character that will serve as your new prefix"], ["help", "Shows commands and information about them", "[command] - The command to show help for, if omitted, shows the help menu"]];
function help(message, msg, prefix){
	if (msg.length == 1){
		var helpEmbed = d.embed("#000000",
			"Welcome to the help menu!", 
			"https://github.com/1e9end/Akira/blob/main/commands.md", undefined,
			"I am still in alpha development, and have limited functionality.", undefined,
			[{name: "My current prefix is", value: prefix}, {name: "Commands", value: "help, hello, prefix"}, {name: "Documentation", value: "See [Github Documentation](https://github.com/1e9end/Akira/blob/main/commands.md) for my full list of commands"}], undefined, undefined,
			{text: "©2020-2021 1egend"}
		);
		message.channel.send(helpEmbed);
	}
	else if (msg.length > 2){
		message.channel.send("Please input valid command to seek help for.\nTo view all commands, type " + process.env.PREFIX + "help");
	}
	else{
		for (var i = 0; i < descriptions.length; ++i){
			if (msg[1] == descriptions[i][0]){
				var helpEmbed = d.embed("#000000",
					descriptions[i][0], 
					undefined, undefined,
					descriptions[i][1], undefined,
					[{name: "Parameters", value: descriptions[i][2]}], undefined, undefined,
					{text: "©2020-2021 1egend"}
				);
				message.channel.send(helpEmbed);
				return;
			}
		}
		message.channel.send("Please input valid command to seek help for.\nTo view all commands, type " + process.env.PREFIX + "help");
	}
}

/**
	PERMISSIONS HIERACHY
	- Owner
	- Admin
	- Can ban
	- Can kick
	- None

	You can ban/kick anyone STRICTLY LOWER than you, as long as u have ban/kick perms
**/

function kick(message){
	var kicks = message.mentions.members.array();
	if (kicks.length == 0){
		message.channel.send("Specify at least 1 member to kick");
		return;
	}
	if (!message.member.hasPermission("KICK_MEMBERS")){
		message.reply("You don't have permission to kick members!");
		return;
	}
	for (var i = 0; i < kicks.length; ++i){
		var mem = kicks[i];
		if (message.guild.ownerID === message.author.id || !mem.hasPermission("KICK_MEMBERS") || (message.member.hasPermission("BAN_MEMBERS") && !mem.hasPermission("BAN_MEMBERS")) || (message.member.hasPermission("ADMINISTRATOR") && !mem.hasPermission("ADMINISTRATOR"))){
			mem.kick("Kicked by " + message.author.tag).then(m => {
				message.channel.send('Kicked <@' + mem.user.id + '>.');
			}).catch((error) => {
				console.log(error);
				message.channel.send(`Error, could not kick ${mem.user.tag}. REASON: ` + error);
			});
		}
		else{
			message.channel.send(`Could not kick ${mem.user.tag} because they have same/higher permissions than you.`);
		}
	}
}

function ban(message, msg){

}

function info(message){
	var infoEmbed = d.embed("#000000",
		"Akira", 
		"https://1e9end.github.io/Akira", undefined,
		"Multifunctional Discord Bot, with fun and useful features such as Moderation, Reaction Roles, Economy System, Mini Games, Math, and Anime!", undefined,
		[{name: "Top.gg Page", value: "[Vote for us!](https://top.gg/bot/798018191066136646)"}, {name: "Github Repo", value: "[View source code](https://github.com/1e9end/Akira)"}, 
		{name: "Support Server", value: "[Seek help here!](https://discord.gg/DAaRAHWw9W)"}, 
		{name: "Invite me here", value: "[To join your server!](https://discord.com/oauth2/authorize?client_id=798018191066136646&scope=bot&permissions=8)"}], undefined, undefined,
		{text: "❤ Thanks for inviting~"}
	);
	message.channel.send(infoEmbed);
}

module.exports = {
	hello: hello,
	prefix: prefix,
	help: help,
	info: info,
	kick: kick,
	ban: ban
};