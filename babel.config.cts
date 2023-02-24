/** @type {import('@babel/core').ConfigFunction} */
const babelConfig =  {
    // plugins: [
    //     "@babel/plugin-transform-async-to-generator"
    // ],
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
    ]
};
module.exports = babelConfig;
