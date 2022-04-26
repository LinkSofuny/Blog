const reference = ['Set', 'WeakSet', 'Map', 'WeakMap', 'Error', 'RegExp', 'Date']

function getType(aim) {
    return Object.prototype.toString.call(aim).split(/\s|]/g)[1]
}

function deepClone(aimValue, hash = new WeakMap()) {
    if (hash.has(aimValue)) return

    let type = getType(aimValue)
    let res = null;
    if (type === 'Object') {
        // 当前是对象类型
        hash.set(aimValue)
        res = {}
        for (const key in aimValue) {
            if (Object.hasOwnProperty.call(aimValue, key)) {
                res[key] = deepClone(aimValue[key], hash)
            }
        }
    } else if (type === 'Array') {
        // 当前是数组类型
        res = []
        aimValue.forEach((item, index) => {
            res[index] = deepClone(item)
        })
    } else if (reference.includes(type)) {
        // 其他类型
        res = new aimValue.constructor(aimValue)
    } else {
        // 原始类型
        res = aimValue
    }
    return res
}

const map = new Map();
map.set("key", "value");
map.set("ConardLi", "coder");

const set = new Set();
set.add("ConardLi");
set.add("coder");

const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: "child",
    },
    field4: [2, 4, 8],
    empty: null,
    map,
    set,
    bool: new Boolean(true),
    num: 2,
    str: '2',
    symbol: Object(Symbol(1)),
    date: new Date(),
    reg: /\d+/,
    error: new Error(),
    func1: () => {
        let t = 0;
        console.log("coder", t++);
    },
    func2: function (a, b) {
        return a + b;
    },
};
//测试代码
const test1 = deepClone(target);
target.field4.push(9);
console.log('test1: ', test1);