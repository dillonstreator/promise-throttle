# promise-throttle

> 0 dependency `Promise` helper utility to throttle/limit concurrency. To be used in place of `Promise.all` when reaching out to rate-limited APIs, etc..

# Install
```
npm install --save promise-throttle
```

# Usage

```js
const promiseThrottle = require('promise-throttle');

const listToProcess = new Array(10).fill(null).map((_, index) => {
    return () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`finished promise #${index}`);
                resolve();
            }, 1000);
        });
    };
});

promiseThrottle(listToProcess, 3) // Process 3 promises at a time
    .then(results => /* ... do something with the results */)
    .catch(err => /* ... do something with error */);
```

# Parameters
| name | type | description |
| - | - | - |
| `listToProcess` | Array<() => Promise> | The list of functions returning promises containing work |
| `concurrency` | number | The number of elements from `listToProcess` to work on in parallel |
| `minDuration` | ?  number | **Optional** number of milliseconds, at minimum, to wait before processing the next batch of elements from `listToProcess` |


# Note
```js
// Correctly generated list for processing
const listToProcess = new Array(10).fill(null).map((_, index) => {
    return () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`finished promise #${index}`);
                resolve();
            }, 1000);
        });
    };
});

// Incorrectly generated list for processing
const invalidListToProcess = new Array(10).fill(null).map((_, index) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`finished promise #${index}`);
            resolve();
        }, 1000);
    });
});
```

You will notice that the snippet above contains 2 generated lists for processing. One is **"Correctly"** generated while the other is **"Incorrect"** with regards to the way in which `promise-throttle` handles throttling.

The **"Correct"** list is a list of **functions** that return promises. The **"Incorrect"** list is a list of promises.
