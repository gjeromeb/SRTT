const BaseCommand = require('../BaseCommand');

class Status extends BaseCommand {
	constructor() {
		super();
		this.name = 'status';
	}
	execute(args, message, Bot) {
		let arg = (args[0] || '').toLowerCase();
		var summary = '';
		switch( arg ) {
			case 'as':
				summary = Bot.tracker.summary(true);
				break;
			case 'sum':
				summary = Bot.tracker.summary(true);
				break;
			default:
				summary = Bot.tracker.summary();
				break;
		}
		message.channel.send("```" + summary + "```");
	}
}

module.exports = Status;
