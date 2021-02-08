const fs = require('fs')
const path = require('path')

fs.readFile(path.resolve(__dirname, 'foo.css'), 'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    let result = data.replace(/\n(?=\})/g, ' ').replace(/(?<!\})\n/g, '').replace(/(?<=\s)\s/g, '');
    fs.writeFile(path.resolve(__dirname, 'goo.css'), result, err => {
        if (err) {
            throw err
        }
        console.log('format complete !')
    })
})
