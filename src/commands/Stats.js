const BaseCommand = require('../BaseCommand');
const Table = require('../Table');
const storage = require('../storage');
const numeral = require('numeral');

class Stats extends BaseCommand {
	constructor() {
		super();
		this.name = 'stats';
	}
	execute(args, message, Bot) {
		storage.values(v=>v.key.match(/^Player::/i)).then(function(values){
			values = values.filter(v=>v.hasOwnProperty('stats'));
			values = values.map(v=>{
				let combined = v.stats.metal + v.stats.gas + v.stats.crystal;
				return [
					v.name,
					combined,
					v.stats.metal,
					v.stats.gas,
					v.stats.crystal,
				];
			});
			values.sort((a, b) => {
				if (a[1] > b[1])
					return -1;
				if (a[1] < b[1])
					return 1;
				return 0;
			});
			values = values.map((v,i)=>{
				v.unshift(1+i);
				return v;
			});
			values = values.slice(0, 10);
			let tbl = new Table(values);
			tbl.options.columns = {
				0: { alignment: "right", paddingLeft: 0 },
				1: { alignment: "left" },
				2: { alignment: "right" },
				3: { alignment: "right" },
				4: { alignment: "right" },
				5: { alignment: "right", paddingRight: 0 },
			},
			tbl.setHeader(['#','Player','Total','Metal','Gas','Crystal']);
			tbl.formatter = v => "string" === typeof v ? v : numeral(v).format();
			message.channel.send("Current Top 10 Players:```" + tbl.display() + "```");
		});
	}
}

module.exports = Stats;
