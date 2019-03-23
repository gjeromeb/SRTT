const BaseCommand = require('../BaseCommand');

class Set extends BaseCommand {
	constructor() {
		super();
		this.name = 'set';
	}
	execute(args, message, Bot) {
		if (!Bot.player.isAdmin()) return;
		message.delete().catch(O_o => { });
		const input = args.filter(v => v.match(/-?[\d\.]+[km]?$/i));
		const rss = {
			'm': input[0] || -1,
			'g': input[1] || -1,
			'c': input[2] || -1,
		};
		const max = input[3] || 0;
		let TT = Bot.tracker;
		rss.m > -1 && TT.set('metal', parseInt(rss.m));
		rss.g > -1 && TT.set('gas', parseInt(rss.g));
		rss.c > -1 && TT.set('crystal', parseInt(rss.c));
		if (max > 0) {
			TT.set('max', max);
		}
		let summary = "```" + TT.summary(true) + "```";
		message.channel.send(`${Bot.player.getName()} just updated the current resource count. New values at station: ${summary}`);
	}
}

module.exports = Set;
