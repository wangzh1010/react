let utils = {
    double: n => n * 2,
    pow: n => n * n,
    reverseInt: n => n.toString().split('').reverse().join('') | 0
}
let pipe = function(value) {
    let stack = [];
    let proxy = new Proxy({}, {
        get(target, key) {
            if (key === 'get') {
                return stack.reduce((acc, curr) => curr(acc), value)
            }
            stack.push(utils[key]);
            return proxy;
        }
    })
    return proxy;
}

let t = pipe(3).double.pow.reverseInt.get;

console.log(t)

