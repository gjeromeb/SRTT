const config = require("../config.json");
const BaseCommand = require("./BaseCommand");
const TransitTracker = require('./TransitTracker');
const Player = require('./Player');
const storage = require('./storage');

class Bot {
	constructor(client,commands) {
		this.client = client;
		this.commands = {};
		this.loadCommands(commands);
		this.tracker = new TransitTracker(client);
		this.player = null;
	}
	async handleMessage(message) {
		if (message.author.bot)
			return;
		if (0 !== message.content.indexOf(config.prefix))
			return;
		this.player = new Player( message.author.id );
		this.player.setName( message.member.displayName );
		const args = message.content.slice(config.prefix.length).trim().split(/[ \|\/]+/g);
		const command = args.shift().toLowerCase();
		console.log('user', message.author.username, message.author.id);
		console.log('member', message.member.displayName);
		console.log('channel', message.channel.name, message.channel.id);
		console.log('content', message.content);
		let Command = this.commands[command];
		if (!(Command instanceof BaseCommand)) {
			return;
		}
		if (await Command.isAllowedChannel(message)) {
			Command._execute(args, message, this);
		}
	}
	async handleTyping(channel,user) {
		if ( user.bot )
			return;
		if ( ! await this.isAllowedChannel(channel) )
			return;
		var cmd = this.commands['status'];
		if ( true
			&& cmd && cmd.meta && cmd.meta.lastRun
			&& cmd.meta.lastRun + 600 * 1000 < (+ new Date())
		) {
			let threshold = 0.95;
			if ( this.tracker && this.tracker._max && ( false
				|| this.tracker._metal / this.tracker._max > threshold
				|| this.tracker._gas / this.tracker._max > threshold
				|| this.tracker._crystal / this.tracker._max > threshold
			) ) {
				channel.send(`I sense someone typing... have a status first resource storage is running low!`);
				cmd.execute([],{channel:channel},this);
			}
		}
	}
	async isAllowedChannel(channel) {
		let channels = await storage.getItem('allowedChannels');
		return -1 !== channels.indexOf(channel.id);
	}
	registerCommand(Command) {
		if (Command instanceof BaseCommand) {
			this.commands[Command.name] = Command;
		}
	}
	unregisterCommand(Command) {
		if (typeof Command !== "Command")
			return;
		delete this.commands[Command.name];
	}
	loadCommands(commands) {
		var that = this;
		commands = Array.isArray(commands) ? commands : [];
		commands.forEach(function (Command) {
			Command = require('./commands/' + Command);
			that.registerCommand(new Command());
		});
	}
}

module.exports = Bot;
