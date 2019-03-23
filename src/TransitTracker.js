const moment = require('moment');
const numeral = require('numeral');
const storage = require('./storage');
const Record = require("./Record");
const Summary = require("./Summary");
const ShortSummary = require("./ShortSummary");
const Player = require('./Player');

class TransitTracker {
	constructor(client) {
		this.client = client;
		this._data = [];
		this._max = null;
		this._metal = 0;
		this._gas = 0;
		this._crystal = 0;
		this.restore();
	}
	set(key, val) {
		key = key.toLowerCase();
		let allowed = ['max', 'metal', 'gas', 'crystal'];
		if (-1 === allowed.indexOf(key)) {
			return;
		}
		this["_" + key] = val;
		storage.setItem("as_" + key, val);
	}
	async restore() {
		var that = this;
		let data = await storage.getItem('as_data');
		let records = data.map(function (v) {
			let duration = moment.duration(moment.utc(v.time).diff(moment.utc()));
			var record = new Record(v.player,v.playerId||null);
			record.setMetal(v.metal);
			record.setGas(v.gas);
			record.setCrystal(v.crystal);
			record.setDuration(duration);
			if (duration.asMilliseconds() < 0) {
				that._metal += parseInt(record.metal);
				that._gas += parseInt(record.gas);
				that._crystal += parseInt(record.crystal);
				return null;
			}
			else {
				console.log('scheduling restored record');
				record.on('finish',function() {
					console.log('getting default channel');
					storage.getItem('defaultChannel').then(function(channelId) {
						var channel = that.client.channels.get(channelId);
						console.log('send finished record to default channel');
						console.log(record.playerId, channelId);
						if ( ! channel ) return;
						let player = new Player(record.playerId);
						player.on('restored_data',function(){
							let summary = "```" + that.summary(true) + "```";
							let msg = [
								`${this.doMention()}`,
								`just finished a transit of ${record.getReadable()}.`,
								`New values at station: ${summary}`,
							];
							channel.send(msg.join(" "));
						});
					});
					console.log('removing record',record);
					that.remove(record);
				});
				record.start();
				return record;
			}
		});
		this._data = records.filter(r => r !== null);
		console.log(`finished restore - items: ${this._data.length}`);
		["max", "metal", "gas", "crystal"].forEach(async function(k) {
			let v = await storage.getItem("as_" + k);
			that.set(k,v);
		});
	}
	async save() {
		console.log(`saving ${this.constructor.name} data`);
		storage.setItem('as_data', this._data);
	}
	reset() {
		this._data = [];
		this.set('max', 0);
		this.set('metal', 0);
		this.set('gas', 0);
		this.set('crystal', 0);
	}
	add(player, rss, duration) {
		var that = this,
			record = new Record(player.getName(),player.getId());
		let metal = this.parseNum(rss.m),
			gas = this.parseNum(rss.g),
			crystal = this.parseNum(rss.c),
			stats = player.getStats() || {};
		metal = record.setMetal(metal);
		gas = record.setGas(gas);
		crystal = record.setCrystal(crystal);
		record.setDuration(duration);
		stats.metal = ( stats.metal || 0 ) + metal;
		stats.gas = ( stats.gas || 0 ) + gas;
		stats.crystal = ( stats.crystal || 0 ) + crystal;
		player.setStats(stats);
		player.save();
		record.on('finish', function(record) {
			that.remove(record);
		});
		setTimeout(function () {
			record.start();
		}, 10);
		this._data.push(record);
		this.save();
		return record;
	}
	remove(record) {
		this._metal = Math.min( this._max, this._metal + parseFloat(record.metal) );
		this._gas = Math.min( this._max, this._gas + parseFloat(record.gas) );
		this._crystal = Math.min( this._max, this._crystal + parseFloat(record.crystal) );
		let index = this._data.indexOf(record);
		this._data.splice(index, 1);
		this.save();
	}
    /**
     * Utility number parsing function
     *
     * @param int|string input
     * @return numeric
     */
	parseNum(input) {
		if ( input.match(/[\d]*,[\d]+/) ) {
			input = input.replace(',','.');
		}
		input = numeral(("" + input).toLowerCase());
		return input.value();
	}
    /**
     * Generates the summary
     *
	 * @param bool short Only generates a short summary of the totals
     * @return string
     */
	summary(short) {
		let summaryTable = !!short ? ShortSummary : Summary;
		let summary = new summaryTable(this._data, {
			metal: this._metal,
			gas: this._gas,
			crystal: this._crystal,
			max: this._max,
		});
		return summary.display();
	}
}

module.exports = TransitTracker;
