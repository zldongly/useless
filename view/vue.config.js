const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: '/useless',
    // publicPath: process.env.NODE_ENV === 'production'
    //     ? '/useless/'
    //     : '/',
})
