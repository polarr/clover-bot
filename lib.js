/** 
	CUSTOM WRITTEN LIBRARIES & WRAPPERS
**/
const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();

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

function parseCommand(message){
	var command = [""];
	if (message[0] != process.env.PREFIX){
		return false;
	}

	var z = 0;
	for (var i = 1; i < message.length; ++i){
		if (message[i] == " " && command[z] != ""){
			++z;
			command.push("");
			continue;
		}

		command[z] += message[i].toLowerCase();
	}

	return command;
}

module.exports = {
	embed: embed,
	sendMessage: sendMessage,
	parseCommand: parseCommand
}