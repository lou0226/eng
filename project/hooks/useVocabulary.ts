import { useContext } from 'react';
import { VocabularyContext } from '@/context/VocabularyContext';

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  
  return context;
}