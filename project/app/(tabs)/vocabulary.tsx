import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, X, Volume2, Tag } from 'lucide-react-native';
import { useVocabulary } from '@/hooks/useVocabulary';
import WordCard from '@/components/WordCard';
import TagsSelector from '@/components/TagsSelector';
import WordLearningSteps from '@/components/WordLearningSteps';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function VocabularyScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { vocabulary, addWord } = useVocabulary();
  const [searchQuery, setSearchQuery] = useState('');
  const [newWord, setNewWord] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [learningWord, setLearningWord] = useState<typeof vocabulary[0] | null>(null);

  // Redirect to sign in if not authenticated
  if (!user) {
    router.replace('/auth/sign-in');
    return null;
  }

  const filteredVocabulary = vocabulary.filter(word => {
    const matchesSearch = word.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          word.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag ? word.tags.includes(filterTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleAddWord = async () => {
    if (!newWord.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, we would fetch the definition from an API
      // For demo purposes, we'll simulate an API call
      setTimeout(() => {
        const definition = "Simulated definition for " + newWord;
        addWord({
          id: Date.now().toString(),
          term: newWord.trim(),
          definition: definition,
          phonetic: "/ˈsɪmjʊleɪtɪd/", // Placeholder
          tags: selectedTags,
          createdAt: new Date(),
          lastReviewed: null,
          reviewCount: 0,
          mastery: 0,
        });
        setNewWord('');
        setSelectedTags([]);
        setIsAdding(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert('Error', 'Failed to add word. Please try again.');
      setIsLoading(false);
    }
  };

  const handleStartLearning = (word: typeof vocabulary[0]) => {
    setLearningWord(word);
  };

  const handleCompleteLearning = () => {
    setLearningWord(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Vocabulary</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setIsAdding(!isAdding)}
          >
            {isAdding ? (
              <X size={20} color="#FFFFFF" />
            ) : (
              <Plus size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {isAdding ? (
          <View style={styles.addWordContainer}>
            <Text style={styles.addWordTitle}>Add New Word</Text>
            <TextInput
              style={styles.wordInput}
              placeholder="Enter a word or phrase"
              value={newWord}
              onChangeText={setNewWord}
              autoFocus
            />
            <TagsSelector
              selectedTags={selectedTags}
              onTagSelect={(tag) => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
            />
            <View style={styles.addWordActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setIsAdding(false);
                  setNewWord('');
                  setSelectedTags([]);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.submitButton, 
                  (!newWord.trim() || isLoading) && styles.disabledButton
                ]}
                onPress={handleAddWord}
                disabled={!newWord.trim() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Add Word</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.searchContainer}>
              <Search size={20} color="#94A3B8" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search vocabulary"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.tagsContainer}>
              <TouchableOpacity 
                style={[
                  styles.tagChip,
                  filterTag === null && styles.activeTagChip
                ]}
                onPress={() => setFilterTag(null)}
              >
                <Text 
                  style={[
                    styles.tagChipText,
                    filterTag === null && styles.activeTagChipText
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {Array.from(new Set(vocabulary.flatMap(word => word.tags))).map(tag => (
                <TouchableOpacity 
                  key={tag}
                  style={[
                    styles.tagChip,
                    filterTag === tag && styles.activeTagChip
                  ]}
                  onPress={() => setFilterTag(filterTag === tag ? null : tag)}
                >
                  <Tag size={12} color={filterTag === tag ? '#FFFFFF' : '#64748B'} />
                  <Text 
                    style={[
                      styles.tagChipText,
                      filterTag === tag && styles.activeTagChipText
                    ]}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filteredVocabulary}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <WordCard 
                  word={item} 
                  onPlay={() => handleStartLearning(item)}
                />
              )}
              style={styles.wordsList}
              contentContainerStyle={styles.wordsListContent}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No words found</Text>
                  <Text style={styles.emptyStateText}>
                    {searchQuery 
                      ? "Try adjusting your search or filters"
                      : "Add your first word to start building your vocabulary"}
                  </Text>
                </View>
              }
            />
          </>
        )}

        <Modal
          visible={learningWord !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setLearningWord(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setLearningWord(null)}
              >
                <X size={24} color="#1E293B" />
              </TouchableOpacity>
              {learningWord && (
                <WordLearningSteps
                  word={learningWord}
                  onComplete={handleCompleteLearning}
                />
              )}
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  activeTagChip: {
    backgroundColor: '#3B82F6',
  },
  tagChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  activeTagChipText: {
    color: '#FFFFFF',
  },
  wordsList: {
    flex: 1,
  },
  wordsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  addWordContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addWordTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  wordInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
  },
  addWordActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '80%',
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});