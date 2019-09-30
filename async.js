let p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('操作成功！')
    }, 1000)
})


p.then(data => {
    console.log(data + '[1]')
})

setTimeout(() => {
    p.then(data => {
        console.log(data + '[2]')
    })
    setImmediate(() => {
        p.then(data => {
            console.log(data + '[5]')
        })
    })
    process.nextTick(() => {
        p.then(data => {
            console.log(data + '[6]')
        })
    })
}, 2000)


setImmediate(() => {
    p.then(data => {
        console.log(data + '[3]')
    })
})


process.nextTick(() => {
    p.then(data => {
        console.log(data + '[4]')
    })
})
