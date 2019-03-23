#!/usr/bin/env node
const Discord = require("discord.js");
const config = require("../config.json");
const client = new Discord.Client();

const SRTT = require("./SRTT");
const Bot = new SRTT.Bot(client,[
	'Setup',
	'Help',
	'Sent',
	'Status',
	'Reset',
	'Set',
	'Register',
	'Stats',
]);

client.on("ready", () => {
	console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
	client.user.setPresence({
		game: {
			name: "RSS in transit",
			type: "WATCHING",
		},
		status: "online",
	});
});

client.on("guildCreate", guild => {
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
	Bot.handleMessage(message);
});

client.login(config.token);
