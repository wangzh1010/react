// 使 a == 1 && a == 2 && a == 3 的值为true
let val = 1;
Object.defineProperty(global, 'a', {
    get() {
        return val++
    },
})

/*let a = {
    val: 1,
    toString() {
        return a.val++
    }
}*/

console.log(a == 1 && a == 2 && a == 3)
