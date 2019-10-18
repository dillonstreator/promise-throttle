const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * Throttles a list of promises
 * @param listToProcess Array of functions that return promises to be throttled
 * @param concurrency number of work elements to allow to run concurrently
 * @param minDuration min time in milliseconds to wait to finish processing
 */
const PromiseThrottle = <T extends () => Promise<any>>(
	listToProcess: T[],
	concurrency: number,
	minDuration?: number,
) => {
	const queue = [...listToProcess];
	let completed: any[] = [];
	return new Promise(async (resolve, reject) => {
		for (let i = 0; i < listToProcess.length / concurrency; i++) {
			const currentWork = queue.splice(0, concurrency);
			try {
				const startTime = new Date().getTime();
				const completedWork = await Promise.all(currentWork.map(fn => fn()));
				completed = [...completed, ...completedWork];
				const endTime = new Date().getTime();
				if (minDuration) {
					const timeToProcess = endTime - startTime;
					const remainingWaitTime = minDuration - timeToProcess;
					if (remainingWaitTime > 0) await sleep(remainingWaitTime);
				}
			} catch (error) {
				return reject(error);
			}
		}
		return resolve(completed);
	});
};

export default PromiseThrottle;
