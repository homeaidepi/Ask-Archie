module.exports = (api) => {
    api.cache(true)
    return {
        ignore: [
            "babel.config.js",
            "dist",
            "package.json",
            "node_modules",
            '.babelrc'
        ]
    }
}