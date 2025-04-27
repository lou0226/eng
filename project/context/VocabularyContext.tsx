import { createContext, useState, useEffect, ReactNode } from 'react';
import { WordType } from '@/types/vocabulary';
import { supabase } from '@/lib/supabase';

interface VocabularyContextType {
  vocabulary: WordType[];
  recentWords: WordType[];
  addWord: (word: Omit<WordType, 'id'>) => Promise<void>;
  updateWord: (word: WordType) => Promise<void>;
  deleteWord: (id: string) => Promise<void>;
  clearVocabulary: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const VocabularyContext = createContext<VocabularyContextType>({
  vocabulary: [],
  recentWords: [],
  addWord: async () => {},
  updateWord: async () => {},
  deleteWord: async () => {},
  clearVocabulary: async () => {},
  isLoading: false,
  error: null,
});

interface VocabularyProviderProps {
  children: ReactNode;
}

export function VocabularyProvider({ children }: VocabularyProviderProps) {
  const [vocabulary, setVocabulary] = useState<WordType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get 5 most recent words
  const recentWords = [...vocabulary]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setVocabulary(data.map(word => ({
        ...word,
        createdAt: new Date(word.created_at),
        lastReviewed: word.last_reviewed ? new Date(word.last_reviewed) : null,
      })));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch vocabulary');
    } finally {
      setIsLoading(false);
    }
  };
  
  const addWord = async (word: Omit<WordType, 'id'>) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('words')
        .insert([{
          user_id: user.id,
          term: word.term,
          definition: word.definition,
          phonetic: word.phonetic,
          tags: word.tags,
          created_at: new Date().toISOString(),
          last_reviewed: null,
          review_count: 0,
          mastery: 0,
        }])
        .select()
        .single();

      if (error) throw error;

      setVocabulary(prev => [{
        ...data,
        createdAt: new Date(data.created_at),
        lastReviewed: null,
      }, ...prev]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add word');
      throw error;
    }
  };
  
  const updateWord = async (updatedWord: WordType) => {
    try {
      const { error } = await supabase
        .from('words')
        .update({
          term: updatedWord.term,
          definition: updatedWord.definition,
          phonetic: updatedWord.phonetic,
          tags: updatedWord.tags,
          last_reviewed: updatedWord.lastReviewed?.toISOString(),
          review_count: updatedWord.reviewCount,
          mastery: updatedWord.mastery,
        })
        .eq('id', updatedWord.id);

      if (error) throw error;

      setVocabulary(prev =>
        prev.map(word =>
          word.id === updatedWord.id ? updatedWord : word
        )
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update word');
      throw error;
    }
  };
  
  const deleteWord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVocabulary(prev => prev.filter(word => word.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete word');
      throw error;
    }
  };
  
  const clearVocabulary = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('words')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setVocabulary([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to clear vocabulary');
      throw error;
    }
  };
  
  return (
    <VocabularyContext.Provider
      value={{
        vocabulary,
        recentWords,
        addWord,
        updateWord,
        deleteWord,
        clearVocabulary,
        isLoading,
        error,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
}