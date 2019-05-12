const storage = require('./storage.js');
const EventEmitter = require('events');

class BaseCommand extends EventEmitter {
	constructor() {
		super();
		this.name = 'base';
		this.meta = null;
		this.reloadMeta();
	}
	_execute(args, message, Bot) {
		this.execute(args, message, Bot);
		this.meta.lastRun = (+new Date());
		var that = this;
		this.saveMeta().then(function(){
			that.reloadMeta();
		});
	}
	execute(args, message, Bot) {
		console.log('no execute method defined');
	}
	async isAllowedChannel(message) {
		let channels = await storage.getItem('allowedChannels');
		return -1 !== channels.indexOf(message.channel.id);
	}
	async saveMeta() {
		storage.setItem(`Command::${this.constructor.name}::meta`,this.meta);
	}
	async reloadMeta() {
		let meta = await storage.getItem(`Command::${this.constructor.name}::meta`);
		this.meta = meta || {};
		this.emit('meta_loaded');
	}
}

module.exports = BaseCommand;
