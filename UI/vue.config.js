module.exports = {
    transpileDependencies: ['vuetify', 'vuex-module-decorators'],
    lintOnSave: false,

    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: false
        }
    },
    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    }
}
