const promiseThrottle = require("../dist/index.js").default;

describe("pormiseThrottle", () => {
	it("should only work on the provided # of promises at any given time", done => {
		const CONCURRENCY = 3;
		const PROMISE_DURATION = 250;
		const ARR_SIZE = 10;

		const arr = new Array(ARR_SIZE).fill(false);
		const funcLedger = [...arr];
		const itemsToProcess = arr.map((_, idx) => () => {
			funcLedger[idx] = true;
			return new Promise(resolve => setTimeout(resolve, PROMISE_DURATION));
		});

		const iterations = ARR_SIZE / CONCURRENCY;
		let currIteration = 1;
		const interval = setInterval(() => {
			currIteration++;
			let num = currIteration * CONCURRENCY;
			if (num > ARR_SIZE) num = ARR_SIZE;
			expect(funcLedger.filter(f => !!f).length).toBe(num);
			if (currIteration >= iterations) {
				clearInterval(interval);
				done();
			}
		}, PROMISE_DURATION + 50);
        promiseThrottle(itemsToProcess, CONCURRENCY);
		expect(funcLedger.filter(f => !!f).length).toBe(CONCURRENCY);
	});

	it("should respect minimum duration parameter", done => {
		const CONCURRENCY = 3;
		const PROMISE_DURATION = 250;
		const MINIMUM_DURATION = 1000;
		const ARR_SIZE = 10;

		const arr = new Array(ARR_SIZE).fill(false);
		const funcLedger = [...arr];
		const itemsToProcess = arr.map((_, idx) => () => {
			funcLedger[idx] = true;
			return new Promise(resolve => setTimeout(resolve, PROMISE_DURATION));
		});

		const iterations = ARR_SIZE / CONCURRENCY;
		let currIteration = 1;
		const interval = setInterval(() => {
			currIteration++;
			let num = currIteration * CONCURRENCY;
			if (num > ARR_SIZE) num = ARR_SIZE;
			expect(funcLedger.filter(f => !!f).length).toBe(num);
			if (currIteration >= iterations) {
				clearInterval(interval);
				done();
			}
		}, MINIMUM_DURATION + 50);
		promiseThrottle(itemsToProcess, CONCURRENCY, MINIMUM_DURATION);
		expect(funcLedger.filter(f => !!f).length).toBe(CONCURRENCY);
	});

	it("should retain the order of the processing elements", done => {
		const CONCURRENCY = 3;
		const PROMISE_DURATION = 250;
		const ARR_SIZE = 10;

		const arr = new Array(ARR_SIZE).fill(false);
		const expectedResult = [];
		const itemsToProcess = arr.map((_, idx) => () => {
			expectedResult.push(idx);
			return new Promise(resolve =>
				setTimeout(() => resolve(idx), PROMISE_DURATION),
			);
		});

		promiseThrottle(itemsToProcess, CONCURRENCY).then(results => {
			results.forEach((el, idx) => expect(el).toBe(expectedResult[idx]));
			done();
		});
	});
});
