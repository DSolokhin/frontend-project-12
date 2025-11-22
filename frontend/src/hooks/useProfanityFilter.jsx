import { useCallback } from 'react';
import leoProfanity from 'leo-profanity';

// Русский словарь для фильтрации
leoProfanity.add(require('leo-profanity-russian'));

export const useProfanityFilter = () => {
  // Фильтрация текста
  const filterText = useCallback((text) => {
    if (!text || typeof text !== 'string') return text;
    return leoProfanity.clean(text);
  }, []);

  // Проверка на наличие нецензурных слов
  const hasProfanity = useCallback((text) => {
    if (!text || typeof text !== 'string') return false;
    return leoProfanity.check(text);
  }, []);

  return {
    filterText,
    hasProfanity,
  };
};

export default useProfanityFilter;

