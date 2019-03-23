const BaseCommand = require('../BaseCommand');
const config = require("../../config.json");
const Player = require('../Player');

class Sent extends BaseCommand {
	constructor() {
		super();
		this.name = 'sent';
	}
	execute(args, message, Bot) {
		var that = this;
		const input = args.filter(v => v.match(/[\d\.,]+[km]?$/i));
		const rss = {
			'm': input[0] || 0,
			'g': input[1] || 0,
			'c': input[2] || 0,
		};
		const time = args.filter(v => v.match(/^[\d]{1,}:[\d]{2}?$/));
		if ( 0 === time.length || 0 == time[0] ) {
			Bot.player.on('restored_data',function() {
				let time = this.getDuration();
				if ( null === time ) {
					let msg = [
						`**Error**: You need to specify a duration for the transit or register your default duration using the \`${config.prefix}register\`command.`,
						`Type \`${config.prefix}help\` for more info.`,
					];
					message.channel.send(msg.join("\n"));
					return;
				}
				that.addRecord(Bot, message, rss, time);
			});
		} else {
			this.addRecord(Bot,message,rss,time);
		}
	}
	addRecord(Bot,message,rss,time) {
		let Record = Bot.tracker.add(Bot.player, rss, time);
		Record.on('finish', function () {
			var record = this;
			let player = new Player(this.playerId);
			player.on('restored_data',function(){
				let summary = "```" + Bot.tracker.summary(true) + "```";
				var msg = [
					`${this.doMention()}`,
					`just finished a transit of ${record.getReadable()}.`,
					`New values at station: ${summary}`,
				];
				message.channel.send(msg.join(" "));
			});
		});
		message.channel.send("```" + Bot.tracker.summary() + "```");
	}
}

module.exports = Sent;
