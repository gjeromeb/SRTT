const BaseCommand = require('../BaseCommand');

class Reset extends BaseCommand {
	constructor() {
		super();
		this.name = 'reset';
	}
	execute(args, message, Bot) {
		if (!Bot.player.isAdmin()) return;
		message.delete().catch(O_o => { });
		Bot.tracker.reset();
		message.channel.send(`${Bot.player.getName()} reset stored AS values`);
	}
}

module.exports = Reset;
