function Father(a,b) {
    this.a = a
    this.b = b
}

function Child(a,b,c) {
    Father.call(this, a, b)
    this.c = c
}

Child.prototype = Object.create(Father.prototype)
Child.prototype.constructor = Child

const a = new Child(1,2,3)
console.log('a', a)

// 感觉本质上 这就是 ES6 class 继承方式的一种原理
// 实际上就两种继承方式