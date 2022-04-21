
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    status = PENDING
    value = null
    reason = null
    onFulfilledCallbacks = []
    onRejectedCallbacks = []

    constructor(excutor) {
        try {
            excutor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)            
        }
    }
    
    resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value

            while (this.onFulfilledCallbacks.length) {
                this.onFulfilledCallbacks.shift()(value)
            }
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason

            while (this.onRejectedCallbacks.length) {
                this.onRejectedCallbacks.shift()(this.reason)
            }
        }
    }

    then = (onFulfilledCallback, onRejectedCallback) => {
        const realFulfilledCallback = typeof onFulfilledCallback === 'function' ? onFulfilledCallback : (_) => _
        const realRejectedCallback = typeof onRejectedCallback === 'function' ? onRejectedCallback : (_) => _
        const promise2 = new MyPromise((resolve, reject) => {

            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const fulfilled = realFulfilledCallback(this.value)
                        resolvePromise(promise2, fulfilled, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const failed = realRejectedCallback(this.reason)
                        resolvePromise(promise2, failed, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            if (this.status === FULFILLED) {
                fulfilledMicrotask()
            } else if (this.status === REJECTED) {
                rejectedMicrotask()
            } else if (this.status === PENDING) {
                this.onFulfilledCallbacks.push(fulfilledMicrotask)
                this.onRejectedCallbacks.push(rejectedMicrotask)
            }
        })

        return promise2
    }

    catch = (onRejectedCallback) => {
        return this.then(null, onRejectedCallback)
    }

    static resolve (value) {
        if (value instanceof MyPromise) {
            return value
        }
        return new MyPromise((resolve) => {
            resolve(value)
        })
    }

    static reject (reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason)
        })
    }
}

function resolvePromise (promise, result, resolve, reject) {
    if (promise === result) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    } else if (result instanceof MyPromise) {
        result.then(resolve, reject)
    } else {
        resolve(result)
    }
}

export default MyPromise

