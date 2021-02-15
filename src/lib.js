/** 
	CUSTOM WRITTEN LIBRARIES & WRAPPERS
**/
const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();
const mongo = require("mongodb");

// MongoDB Database
const mongoClient = require("mongodb").MongoClient;

function insertDocument(err, db){
	if (err) throw err;
	
}

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

/** Stores server prefix in MongoDB **/
function setPrefix(id, prefix){
	mongoClient.connect(process.env.MONGO_URI, async function(err, db){
		if (err){
			throw err;
		}
		var dbo = db.db("Akira");
		var filter = { name: id };
		if(await dbo.collection("prefixes").countDocuments(filter, {limit: 1})){
			// Prefix already set
			var newvalues = { $set: {name: id, prefix: prefix } };
			dbo.collection("prefixes").updateOne(filter, newvalues, function(err, res) {
				if (err) throw err;
				console.log("Prefix updated to " + prefix + " for server id: " + id);
			});
		}
		else{
			var myobj = { name: id, prefix: prefix };
			dbo.collection("prefixes").insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("Prefix added as " + prefix + " for server id: " + id);
			});
		}
		db.close();
	});
}

function parseCommand(message, prefix){
	if (message[0] != prefix){
		return false;
	}
	var command = [""];
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

function parseMessage(message, id, callback){
	mongoClient.connect(process.env.MONGO_URI, async function(err, db){
		if (err){
			throw err;
		}
		var dbo = db.db("Akira");
		var filter = { name: id };
		var x;
		if (await dbo.collection("prefixes").countDocuments(filter, {limit: 1})){
			var x = await dbo.collection("prefixes").findOne(filter, {projection: {prefix: 1, _id : 0}});
			callback(parseCommand(message, x.prefix), x.prefix);
		}
		else{
			callback(parseCommand(message, '$'), '$');
			setPrefix(id, '$');
		}
		db.close();
	});
}

module.exports = {
	embed: embed,
	setPrefix: setPrefix,
	sendMessage: sendMessage,
	parseCommand: parseCommand,
	parseMessage: parseMessage
}