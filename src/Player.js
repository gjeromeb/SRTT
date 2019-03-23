const storage = require('./storage');
const EventEmitter = require('events');
const moment = require('moment');
const config = require("../config.json");

class Player extends EventEmitter {
	constructor(id) {
		super();
		this.id = id;
		this.name = null;
		this.alliance = null;
		this.duration = null;
		this.mention = true;
		this.stats = null;
		this.restore();
	}
	getId() {
		return this.id;
	}
	getName() {
		return this.name;
	}
	setName(name) {
		this.name = name.replace(/\s*(?:\[[^\]]*\]|\([^)]+\)|\{[^}]*\})\s*/g, '');
	}
	getAlliance() {
		return this.alliance;
	}
	setAlliance(alliance) {
		this.alliance = ("" + alliance).toUpperCase();
	}
	getDuration() {
		if ( ! this.duration ) return null;
		let duration = moment.duration(this.duration),
			h = parseInt( duration.asHours() ),
			m = parseInt( duration.asMinutes() ) - (60*h);
		h = h < 10 ? '0' + h : h;
		m = m < 10 ? '0' + m : m;
		return `${h}:${m}`;
	}
	setDuration(duration) {
		this.duration = moment.duration(duration).asMilliseconds();
	}
	isAdmin() {
		return -1 !== config.admins.indexOf(this.id);
	}
	getMention() {
		return this.mention;
	}
	setMention(boolish) {
		this.mention = typeof true === typeof boolish
			? boolish
			: !(""+boolish).match(/^\s*(?:no|false|0|null|nah|off)\s*$/i);
		console.log(this.mention);
	}
	getStats() {
		return this.stats;
	}
	setStats(stats) {
		this.stats = stats;
	}
	doMention() {
		return this.mention ? `<@${this.getId()}>` : this.getName();
	}
	async restore() {
		var that = this;
		let player = await storage.getItem(this.constructor.name+"::"+this.id);
		if ( 'undefined' !== typeof player ) {
			this.setName(player.name);
			this.setAlliance(player.alliance);
			this.setDuration(player.duration);
			this.setMention(player.mention);
			this.setStats(player.stats||{});
		}
		this.emit('restored_data',this);
		// Handle all events that are setup after the restoration took place.
		this.on('newListener',function(e,listener){
			if ('restored_data'===e){
				listener.apply(that);
			}
		});
	}
	async save() {
		await storage.setItem(this.constructor.name+'::'+this.id, this);
	}
}

module.exports = Player;
