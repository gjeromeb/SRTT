const BaseCommand = require('../BaseCommand');
const storage = require('../storage');

class Setup extends BaseCommand {
	constructor() {
		super();
		this.name = 'setup';
	}
    /**
     * isAllowedChannel channel is overridden to allow it to be called from every
     * channel
     *
     * @return true
     */
	async isAllowedChannel(message) {
		return true;
	}
	execute(args, message, Bot) {
		if (!Bot.player.isAdmin()) return;
		message.delete().catch(O_o => { });
		switch (args[0]) {
			case "channel":
				this.modifyChannel(args, message);
				break;
			default:
				break;
		}
	}
	modifyChannel(args, message) {
		storage.getItem('allowedChannels').then(value => {
			value = Array.isArray(value) ? value : [];
			if ("add" === args[1]) {
				value.push(message.channel.id);
				console.log(`added channel ${message.channel.name}`);
				if ("default" === args[2]) {
					storage.setItem('defaultChannel', message.channel.id);
					console.log('set default channel');
				}
			}
			else if ("remove" === args[1]) {
				value.splice(value.indexOf(message.channel.id), 1);
				console.log(`removed channel ${message.channel.name}`);
			}
			value = value.filter((v, i, a) => a.indexOf(v) === i);
			storage.setItem('allowedChannels', value).then((values) => {
				console.log('registered channels:', values);
			});
		});
	}
}

module.exports = Setup;
