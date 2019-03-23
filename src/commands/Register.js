const BaseCommand = require('../BaseCommand');

class Register extends BaseCommand {
	constructor() {
		super();
		this.name = 'register';
	}
	execute(args, message, Bot) {
		var that = this;
		message.delete().catch(O_o => { });
		Bot.player.on('restored_data',function(){
			var content = '';
			switch (args[0]) {
				case "alliance":
					this.setAlliance(args[1] || null);
					content = [
						`Successfully set alliance for ${this.getName()} to \`${this.getAlliance()}\``,
						"...this message will delete itself after 20 seconds...",
					].join("\n");
					break;
				case "duration":
					this.setDuration(args[1] || null);
					content = [
						`Successfully set default duration for ${this.getName()} to \`${this.getDuration()}\``,
						"...this message will delete itself after 20 seconds...",
					].join("\n");
					break;
				case "mention":
					this.setMention(args[1] || null);
					content = [
						`Successfully set mention for ${this.getName()} preference to \`${this.getMention()?'yes':'no'}\``,
						"...this message will delete itself after 20 seconds...",
					].join("\n");
					break;
				default:
					content = [
						`Saved values for ${this.doMention()}:`,
						`**\`alliance\`** - Registered Alliance: \`${this.getAlliance()||'none'}\``,
						`**\`duration\`** - Default Duration: \`${this.getDuration()||'none'}\``,
						`**\`mention\`** - Mention me per default: \`${this.getMention()?'yes':'no'}\``,
						"...this message will delete itself after 20 seconds...",
					].join("\n");
					break;
			}
			if ( content ) {
				that.display(message.channel,content);
			}
			this.save();
		});
	}
	async display(channel,content) {
		let message = await channel.send(content);
		setTimeout(()=>{
			message.delete().catch(O_o => { });
		}, 20*1000);
	}
}

module.exports = Register;
