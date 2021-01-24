import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: navigator.language.split('-')[0] || process.env.VUE_APP_I18N_LOCALE || 'en',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: { en: require('./locales/en.json'), de: require('./locales/de.json') }
})

export default i18n
