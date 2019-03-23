const moment = require('moment');
const numeral = require('numeral');
const EventEmitter = require('events');

class Record extends EventEmitter {
	constructor(playerName,playerId) {
		super();
		this.player = playerName;
		this.playerId = playerId || null;
		this.metal = 0;
		this.gas = 0;
		this.crystal = 0;
		this.time = moment.utc();
		this.timeout = 0;
		this.multiplyThreshold = 500;
	}
	start() {
		var that = this;
		console.log('finished in ' + this.timeout);
		setTimeout(function () {
			that.emit('finish', that);
		}, this.timeout > 0 ? this.timeout : 1);
	}
	setDuration(duration) {
		console.log('set record duration ' + duration);
		this.timeout = moment.duration(duration).asMilliseconds();
		this.time = moment.utc().add(this.timeout);
	}
	getDurationReadable() {
		let duration = moment.duration(moment.utc().diff(this.time));
		let ms = Math.abs( duration.asMilliseconds() );
		let hours = Math.floor( ms / 1000 / 60 / 60 );
		let minutes = Math.floor( ( ms - ( hours * 60 * 60 * 1000 ) ) / 1000 / 60 );
		return [
			('0' + hours).slice(-2),
			('0' + minutes).slice(-2),
		].join(':');
	}
	setChannel(id) {
		this.channel = id;
	}
	setMetal(metal) {
		metal = parseFloat(metal);
		this.metal = metal < this.multiplyThreshold ? metal * 1000 : metal;
		return this.metal;
	}
	setGas(gas) {
		gas = parseFloat(gas);
		this.gas = gas < this.multiplyThreshold ? gas * 1000 : gas;
		return this.gas;
	}
	setCrystal(crystal) {
		crystal = parseFloat(crystal);
		this.crystal = crystal < this.multiplyThreshold ? crystal * 1000 : crystal;
		return this.crystal;
	}
	getMetal() {
		return numeral(this.metal).format();
	}
	getGas() {
		return numeral(this.gas).format();
	}
	getCrystal() {
		return numeral(this.crystal).format();
	}
	toArray() {
		return [
			this.player,
			this.metal,
			this.gas,
			this.crystal,
			this.time.format('HH:mm') + ' (in ' + this.getDurationReadable() + ')',
		];
	}
	getReadable() {
		let vals = [
			this.getMetal() + ' Metal',
			this.getGas() + ' Gas',
			this.getCrystal() + ' Crystal'
		].filter(v => !!parseInt(v[0]));
		let out = '';
		for (let i = 0; i < vals.length; i++) {
			out += vals[i];
			if (vals.length > 1 && i !== vals.length - 1) {
				out += i === vals.length - 2 ? ' and ' : ', ';
			}
		}
		return out;
	}
}

module.exports = Record;
