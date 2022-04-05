// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class _Promise {
    status = PENDING
    value = ''
    reason = ''
    onFulfilledCallBack = []
    onRejectCallBack = []

    constructor(excutor) {
        try {
            excutor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error)            
        }
    }
    // 这里的是箭头函数, 因为reoslve的调用需要看当前上下文的this, 我们传出去调用了, 则是window 或者其他了
    resolve = (value) => {
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value

            while (this.onFulfilledCallBack.length) {
                this.onFulfilledCallBack.shift()(value)
            }
        }
    }

    reject = (reason) => {
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            while (this.onRejectCallBack.length) {
                this.onRejectCallBack.shift()(reason)
            } 
        } 
    }

    then(onFulfilled, onReject) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val
        onReject = typeof onReject === 'function' ? onReject : reason => { throw reason }

        const promise2 = new _Promise((resolve, reject) => {
            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                    
                })
            }

            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const x = onReject(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })
            }

            if (this.status === FULFILLED) {
                fulfilledMicrotask()
            } else if (this.status === REJECTED) {
                rejectedMicrotask()
            // 如果回调函数内部是异步执行的, 那这时候没有 上述两个状态 而是 pending状态
            } else if (this.status === PENDING) {
                this.onFulfilledCallBack.push(fulfilledMicrotask)
                this.onRejectCallBack.push(rejectedMicrotask)
            }
        })
        return promise2
    }

    catch(onReject) {
        return this.then(null, onReject)
    }
    // 静态 resolve 方法
    static resolve(value) {
        if (value instanceof _Promise) {
            return value
        }
        
        return new _Promise((resolve) => {
            resolve(value)
        })
    }
    // 静态 reject
    static reject(reason) {
        return new _Promise((resolve, reject) => {
            reject(reason)
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    if (x instanceof _Promise) {
        x.then(resolve, reject)
    } else {
        resolve(x)
    }
}



export default _Promise