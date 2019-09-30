// flat an array
function flatten(arr) {
    return arr.reduce((acc, curr) => {
        return acc.concat(Array.isArray(curr) ? flatten(curr) : curr);
    }, [])
}

const arr = [1, [2, 3], [4], 5, [6, [7, 8, 9]] ];

let flattened = flatten(arr);

console.log(flattened)
