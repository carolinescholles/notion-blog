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
    subtitle: 'Meu caminho para desaprender, liberar e encontrar coragem para recomeçar como nômade digital do sul do Brasil.',
    description: 'Meu caminho para desaprender, liberar e encontrar coragem para recomeçar como nômade digital do sul do Brasil.',
  },
  'en': {
    chapters: 'Chapters',
    readMore: 'Read more →',
    previous: '← Previous',
    next: 'Next →',
    back: '← Back',
    subtitle: 'My path to unlearning, releasing, and finding the courage to begin again as a digital nomad from south Brazil.',
    description: 'My path to unlearning, releasing, and finding the courage to begin again as a digital nomad from south Brazil.',
  },
  'es': {
    chapters: 'Capítulos',
    readMore: 'Leer más →',
    previous: '← Anterior',
    next: 'Siguiente →',
    back: '← Volver',
    subtitle: 'Mi camino para desaprender, liberar y encontrar el coraje para empezar de nuevo como nómada digital del sur de Brasil.',
    description: 'Mi camino para desaprender, liberar y encontrar el coraje para empezar de nuevo como nómada digital del sur de Brasil.',
  },
  'fr': {
    chapters: 'Chapitres',
    readMore: 'Lire la suite →',
    previous: '← Précédent',
    next: 'Suivant →',
    back: '← Retour',
    subtitle: 'Mon chemin pour désapprendre, libérer et trouver le courage de recommencer en tant que nomade numérique du sud du Brésil.',
    description: 'Mon chemin pour désapprendre, libérer et trouver le courage de recommencer en tant que nomade numérique du sud du Brésil.',
  },
  'it': {
    chapters: 'Capitoli',
    readMore: 'Leggi di più →',
    previous: '← Precedente',
    next: 'Successivo →',
    back: '← Indietro',
    subtitle: 'Il mio percorso per disimparare, liberare e trovare il coraggio di ricominciare come nomade digitale dal sud del Brasile.',
    description: 'Il mio percorso per disimparare, liberare e trovare il coraggio di ricominciare come nomade digitale dal sud del Brasile.',
  },
  'ja': {
    chapters: '章',
    readMore: '続きを読む →',
    previous: '← 前へ',
    next: '次へ →',
    back: '← 戻る',
    subtitle: 'ブラジル南部出身のデジタルノマドとして、学び直し、手放し、再び始める勇気を見つける私の道のり。',
    description: 'ブラジル南部出身のデジタルノマドとして、学び直し、手放し、再び始める勇気を見つける私の道のり。',
  },
};

export function getTranslations(locale) {
  return translations[locale] || translations[defaultLocale];
}
