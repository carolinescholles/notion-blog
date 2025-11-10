export const locales = ['pt-br', 'en', 'es', 'fr', 'it', 'ja'];
export const defaultLocale = 'pt-br';

export const localeNames = {
  'pt-br': 'Português',
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'it': 'Italiano',
  'ja': '日本語',
};

export const translations = {
  'pt-br': {
    chapters: 'Capítulos',
    readMore: 'Ler mais →',
    previous: '← Anterior',
    next: 'Próximo →',
    back: '← Voltar',
    subtitle: 'Histórias e reflexões',
  },
  'en': {
    chapters: 'Chapters',
    readMore: 'Read more →',
    previous: '← Previous',
    next: 'Next →',
    back: '← Back',
    subtitle: 'Stories and reflections',
  },
  'es': {
    chapters: 'Capítulos',
    readMore: 'Leer más →',
    previous: '← Anterior',
    next: 'Siguiente →',
    back: '← Volver',
    subtitle: 'Historias y reflexiones',
  },
  'fr': {
    chapters: 'Chapitres',
    readMore: 'Lire la suite →',
    previous: '← Précédent',
    next: 'Suivant →',
    back: '← Retour',
    subtitle: 'Histoires et réflexions',
  },
  'it': {
    chapters: 'Capitoli',
    readMore: 'Leggi di più →',
    previous: '← Precedente',
    next: 'Successivo →',
    back: '← Indietro',
    subtitle: 'Storie e riflessioni',
  },
  'ja': {
    chapters: '章',
    readMore: '続きを読む →',
    previous: '← 前へ',
    next: '次へ →',
    back: '← 戻る',
    subtitle: '物語と考察',
  },
};

export function getTranslations(locale) {
  return translations[locale] || translations[defaultLocale];
}
