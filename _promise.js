
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    status = PENDING
    value = null
    reason = null
    onFulFilledCallback = []
    onRejectedCallback = []


    constructor(excutor) {
        excutor(this.resolve, this.reject)
    }

    resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value

            while(this.onFulFilledCallback.length) {
                this.onFulFilledCallback.shift()(value)
            }
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            while(this.onRejectedCallback.length) {
                this.onRejectedCallback.shift()(reason)
            }
        }

    }

    then = (fulfiled, rejected) => {
        fulfiled = typeof fulfiled === 'function' ? fulfiled : (value) => value
        rejected = typeof rejected === 'function' ? rejected : (reason) => { throw reason }

        const promise2 = new MyPromise((resolve, reject) => {

            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = fulfiled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            const onRejectedMicroTask = () => {
                try {
                    const x = rejected(this.value)
                    resolvePromise(promise2, x, resolve, reject)
                } catch (error) {
                    reject(error)
                }
            }

            if (this.status === FULFILLED) {
                fulfilledMicrotask()
            } else if (this.status === REJECTED) {
                onRejectedMicroTask()
            } else if (this.status === PENDING) {
                this.onFulFilledCallback.push(fulfilledMicrotask)
                this.onRejectedCallback.push(onRejectedMicroTask)
            }
        })
        return promise2
    }

    catch = (reason) => {
        return this.then(null, reason)
    }
}

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof MyPromise) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}

export default MyPromise

