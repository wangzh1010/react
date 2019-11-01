const presets = [
    [
        "@babel/env",
        {
            targets: {
                browsers: ['>0.25%', 'not dead', 'not ie <= 8']
            },
            useBuiltIns: "usage", // usage entry
            corejs: 2
        }
    ]
];

const plugins = [
    [
        "@babel/plugin-transform-runtime",
        {
            "absoluteRuntime": false,
            "corejs": false,
            "helpers": true,
            "regenerator": true,
            "useESModules": false
        }
    ]
];

module.exports = { presets/* , plugins,ignore: ['./src/*.esm.js'] */ };
