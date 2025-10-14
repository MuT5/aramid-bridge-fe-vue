import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import sk from './locales/sk.json'
import cs from './locales/cs.json'
import pl from './locales/pl.json'
import es from './locales/es.json'
import de from './locales/de.json'
import zh from './locales/zh.json'

export type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], 'en' | 'sk' | 'cs' | 'pl' | 'es' | 'de' | 'zh'>({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    sk,
    cs,
    pl,
    es,
    de,
    zh
  }
})

export default i18n
