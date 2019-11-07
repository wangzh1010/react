const fs = require('fs')
const path = require('path')

function readData() {
    return function (cb) {
        fs.readFile(path.resolve(__dirname, 'data.json'), cb)
    }
}

function writeData() {
    return function (data, cb) {
        fs.writeFile(path.resolve(__dirname, 'copy.json'), data, cb)
    }
}

function* koo() {
    yield readData()
    yield writeData()
}

let gen = koo()
gen.next().value(function (err, data) {
    if (err) {
        throw err
    }
    gen.next().value(data, function (err) {
        if (err) {
            throw err;
        }
        console.log('write success')
    })
})


function validate1() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Math.random() > 0.5)
        }, 1000);
    })
}

function validate2() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(Math.random() > 0.5)
        }, 1000);
    })
}

function* custom() {
    let r1 = yield validate1();
    if (!r1) {
        console.log('validate1 error...');
        return;
    }
    let r2 = yield validate2();
    if (!r2) {
        console.log('validate2 error...');
        return;
    }
    console.log('ok~')
}

function main(fn) {
    let gen = fn()

    function next(data) {
        let result = gen.next(data);
        if (result.done) {
            return result.value;
        }
        result.value.then(v => next(v))
    }

    next()
}

main(custom)
