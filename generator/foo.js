class Gen {
    *foo() {
        yield 'hello';
        yield 'world';
        return 'end'
    }
    *foo2() {
        for (let i = 0; true; i++) {
            console.log(i)
            let reset;
            reset = yield i;
            console.log(reset)
            if (reset) {
                i = -1;
            }
        }
    }
    *foo3(x) {
        let y = 2 * (yield (x + 1));
        let z = yield (y / 3);
        return (x + y + z);
    }
    *foo4() {
        console.log('start')
        console.log(`1. ${yield}`)
        console.log(`2. ${yield}`)
        return 'end'
    }
    *foo5() {
        console.log(`first input: ${yield}`)
        console.log(`second input: ${yield}`)
        return 'end'
    }
    *fib() {
        let [prev, curr] = [0, 1];
        for (; ;) {
            yield curr;
            [prev, curr] = [curr, prev + curr]
        }
    }
    wrapper(fn) {
        return function (...args) {
            let gen = fn(...args);
            gen.next();
            return gen;
        }
    }
}
let instance = new Gen();
/* let gen = instance.foo();
console.log(gen.next())
console.log(gen.next())
console.log(gen.next())
console.log(gen.next()) */

// next方法可以带一个参数，该参数会被当作上一个yield表达式的返回值。

/* let gen = instance.foo2();
console.log(gen.next())
console.log(gen.next())
console.log(gen.next(true)) */

/* let gen = instance.foo3(5)
console.log(gen.next())
console.log(gen.next(12))
console.log(gen.next(13)) */

/* let gen = instance.foo4()
console.log(gen.next())
console.log(gen.next('a'))
console.log(gen.next('b'))
gen.next()
gen.next('a')
gen.next('b') */

/* let wrapped = instance.wrapper(instance.foo5);
let gen = wrapped();
gen.next('hello !');
gen.next('world !'); */


/* let gen = instance.fib();

for (v of gen) {
    if (v > 13) {
        break
    }
    console.log(v)
} */
