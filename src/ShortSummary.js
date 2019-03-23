const Table = require('./Table');
const numeral = require('numeral');

class ShortSummary extends Table {
	constructor(data, current) {
		super();
		this.options.columns[3].paddingRight = 0;
		this.setHeader(["current", "Metal", "Gas", "Crystal"]);
		this.data.push([
			"RSS @ AS",
			numeral(current.metal).format(),
			numeral(current.gas).format(),
			numeral(current.crystal).format(),
		]);
	}
}

module.exports = ShortSummary;
