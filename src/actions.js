/**
	ACTIONS MODULE
**/

const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();
const nekos = require('nekos.life');
const neko = new nekos();

const d = require('./lib');

function parseAction(message, msg, person){
	var interactEmbed = d.embed("#000000",
		`${person.displayName} recieved a ${msg} from ${message.author.username}!`, 
		undefined, undefined,
		undefined, undefined,
		undefined, undefined, new Date(),
		{text: "You both look cute!"}
	);
	switch(msg){
		case "poke":
			neko.sfw.poke().then(function(x){
				interactEmbed.embed.image = x;
				message.channel.send(interactEmbed);
			});
		break;
		case "hug":
			neko.sfw.hug().then(function(x){
				interactEmbed.embed.image = x;
				message.channel.send(interactEmbed);
			});
		break;
		case "kiss":
			neko.sfw.kiss().then(function(x){
				interactEmbed.embed.image = x;
				message.channel.send(interactEmbed);
			});
		break;
		case "cuddle":
			neko.sfw.cuddle().then(function(x){
				interactEmbed.embed.image = x;
				message.channel.send(interactEmbed);
			});
		break;
		case "pat":
			neko.sfw.pat().then(function(x){
				interactEmbed.embed.image = x;
				message.channel.send(interactEmbed);
			});
		break;
		case "slap":
			neko.sfw.slap().then(function(x){
				interactEmbed.embed.image = x;
				message.channel.send(interactEmbed);
			});
		break;
	}
}

module.exports = {
	parseAction: parseAction
};