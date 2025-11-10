export const locales = ['pt-BR', 'en', 'es', 'fr', 'it'];
export const defaultLocale = 'pt-BR';

export const localeNames = {
  'pt-BR': 'Português',
  'en': 'English',
  'es': 'Español',
  'fr': 'Français',
  'it': 'Italiano',
};

export const translations = {
  'pt-BR': {
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
};

export function getTranslations(locale) {
  return translations[locale] || translations[defaultLocale];
}
