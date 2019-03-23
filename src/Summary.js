const Table = require('./Table');
const numeral = require('numeral');

class Summary extends Table {
	constructor(data, current) {
		data.sort((a, b) => {
			if (a.time.isBefore(b.time))
				return -1;
			if (a.time.isAfter(b.time))
				return 1;
			return 0;
		});
		data = data.map(v => v.toArray());
		super(data);
		this.formatter = v => "string"===typeof v ? v : numeral(v).format();
		this.setHeader(["Player", "Metal", "Gas", "Crystal", "Arrival"]);
		let inTransit = {
			metal: this.sumTotal("Metal"),
			gas: this.sumTotal("Gas"),
			crystal: this.sumTotal("Crystal"),
		};
		let expected = {
			metal: inTransit.metal + current.metal,
			gas: inTransit.gas + current.gas,
			crystal: inTransit.crystal + current.crystal,
		};
		this.appendBottomRow([
			"Total",
			numeral(inTransit.metal).format(),
			numeral(inTransit.gas).format(),
			numeral(inTransit.crystal).format(),
			"in transit",
		], true);
		this.appendBottomRow([
			"RSS @ AS",
			numeral(current.metal).format(),
			numeral(current.gas).format(),
			numeral(current.crystal).format(),
			"current",
		]);
		this.appendBottomRow([
			"AS free",
			numeral(current.max - expected.metal).format(),
			numeral(current.max - expected.gas).format(),
			numeral(current.max - expected.crystal).format(),
			"expected",
		]);
		let pc_format = "0.00%";
		this.appendBottomRow([
			"AS % full",
			numeral(expected.metal / current.max).format(pc_format),
			numeral(expected.gas / current.max).format(pc_format),
			numeral(expected.crystal / current.max).format(pc_format),
			"expected",
		]);
	}
}

module.exports = Summary;
