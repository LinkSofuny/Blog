import MyPromise from './_promise.js'

const promise = new MyPromise((resolve, reject) => {
    resolve('success1')
})
  
function other () {
    return new MyPromise((resolve, reject) =>{
        resolve('other')
    })
}
promise.then(value => {
    console.log(1)
    console.log('resolve', value)
    return other()
}).then().then().then().then(value => {
    console.log(2)
    console.log(value)
}).catch(reason => {
    console.log('reason', reason)
})


// promise
//     .then()
//     .then()
//     .then(value => console.log(value))
// 普通的.then 执行
// 普通的 catch 执行
// then链式调用 then可选参数
// then内可基于新的 promise 决定下面 then 的结果
// 静态 resolve
// 静态 reject