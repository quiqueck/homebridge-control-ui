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
    }
}
