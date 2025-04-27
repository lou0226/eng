import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CircleCheck as CheckCircle2, Circle as XCircle, Volume2, Shuffle, List, Clock, Flag, Keyboard } from 'lucide-react-native';
import { useVocabulary } from '@/hooks/useVocabulary';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import SpellingChallenge from '@/components/SpellingChallenge';
import WordMatching from '@/components/WordMatching';

type PracticeMode = 'flash' | 'spelling' | 'matching';

export default function PracticeScreen() {
  const { vocabulary } = useVocabulary();
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  
  const practiceWords = vocabulary.slice(0, 10);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>No words available</Text>
      <Text style={styles.emptyStateText}>
        Add some words to your vocabulary to start practicing
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => setSelectedMode(null)}
      >
        <Text style={styles.emptyStateButtonText}>Go back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCompletedState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Practice Complete!</Text>
      <Text style={styles.emptyStateText}>
        You've reviewed {answers.filter(Boolean).length} out of {answers.length} words correctly
      </Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={() => setSelectedMode(null)}
      >
        <Text style={styles.emptyStateButtonText}>Back to Practice</Text>
      </TouchableOpacity>
    </View>
  );
  
  const handleSelectMode = (mode: PracticeMode) => {
    setSelectedMode(mode);
    setCurrentIndex(0);
    setIsFlipped(false);
    setAnswers([]);
  };
  
  const handleNext = (correct: boolean) => {
    setAnswers([...answers, correct]);
    
    if (currentIndex < practiceWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // End of practice session
      // We'd normally update the review status of words here
    }
  };
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const speakWord = (word: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(word);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
    }
  };

  const renderFlashcardMode = () => {
    if (practiceWords.length === 0) {
      return renderEmptyState();
    }

    if (currentIndex >= practiceWords.length) {
      return renderCompletedState();
    }

    const currentWord = practiceWords[currentIndex];

    return (
      <View style={styles.practiceContainer}>
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${((currentIndex + 1) / practiceWords.length) * 100}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.progressText}>
          {currentIndex + 1} / {practiceWords.length}
        </Text>

        <TouchableOpacity 
          style={styles.flashcard} 
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          <Animated.View 
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.flashcardContent}
          >
            <Text style={styles.flashcardText}>
              {isFlipped ? currentWord.definition : currentWord.term}
            </Text>
            {!isFlipped && currentWord.phonetic && (
              <Text style={styles.phoneticText}>{currentWord.phonetic}</Text>
            )}
          </Animated.View>
          <TouchableOpacity
            style={styles.speakButton}
            onPress={() => speakWord(currentWord.term)}
          >
            <Volume2 size={24} color="#3B82F6" />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.incorrectButton]}
            onPress={() => handleNext(false)}
          >
            <XCircle size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Incorrect</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.correctButton]}
            onPress={() => handleNext(true)}
          >
            <CheckCircle2 size={24} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Correct</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSpellingMode = () => {
    if (practiceWords.length === 0) {
      return renderEmptyState();
    }

    if (currentIndex >= practiceWords.length) {
      return renderCompletedState();
    }

    return (
      <View style={styles.practiceContainer}>
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${((currentIndex + 1) / practiceWords.length) * 100}%` }
            ]} 
          />
        </View>
        
        <Text style={styles.progressText}>
          {currentIndex + 1} / {practiceWords.length}
        </Text>

        <SpellingChallenge
          word={practiceWords[currentIndex]}
          onCorrect={() => handleNext(true)}
          onIncorrect={() => handleNext(false)}
        />
      </View>
    );
  };

  const renderMatchingMode = () => {
    if (practiceWords.length < 4) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Not enough words</Text>
          <Text style={styles.emptyStateText}>
            Add at least 4 words to your vocabulary to practice matching
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => setSelectedMode(null)}
          >
            <Text style={styles.emptyStateButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.practiceContainer}>
        <WordMatching
          words={practiceWords.slice(0, 4)}
          onComplete={(score) => {
            setAnswers([...answers, ...Array(4).fill(true)]);
            setCurrentIndex(currentIndex + 4);
          }}
        />
      </View>
    );
  };

  const renderModeSelection = () => (
    <ScrollView contentContainerStyle={styles.modeContainer}>
      <Text style={styles.headerTitle}>Practice Modes</Text>
      <Text style={styles.headerSubtitle}>Choose how you want to practice today</Text>
      
      <TouchableOpacity 
        style={styles.modeCard}
        onPress={() => handleSelectMode('flash')}
      >
        <View style={styles.modeIcon}>
          <List size={24} color="#3B82F6" />
        </View>
        <View style={styles.modeContent}>
          <Text style={styles.modeName}>Flashcards</Text>
          <Text style={styles.modeDescription}>
            Traditional flashcard practice with word-definition pairs
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.modeCard}
        onPress={() => handleSelectMode('spelling')}
      >
        <View style={styles.modeIcon}>
          <Keyboard size={24} color="#3B82F6" />
        </View>
        <View style={styles.modeContent}>
          <Text style={styles.modeName}>Spelling Challenge</Text>
          <Text style={styles.modeDescription}>
            Test your spelling skills by typing the word you hear
          </Text>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.modeCard}
        onPress={() => handleSelectMode('matching')}
      >
        <View style={styles.modeIcon}>
          <Shuffle size={24} color="#3B82F6" />
        </View>
        <View style={styles.modeContent}>
          <Text style={styles.modeName}>Word Matching</Text>
          <Text style={styles.modeDescription}>
            Match words with their correct definitions
          </Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.statsSection}>
        <Text style={styles.statsSectionTitle}>Daily Stats</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Clock size={20} color="#3B82F6" />
            <Text style={styles.statValue}>25 min</Text>
            <Text style={styles.statLabel}>Study Time</Text>
          </View>
          <View style={styles.statItem}>
            <CheckCircle2 size={20} color="#10B981" />
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Words Reviewed</Text>
          </View>
          <View style={styles.statItem}>
            <XCircle size={20} color="#EF4444" />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Incorrect</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {selectedMode ? (
        <>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backIconButton}
              onPress={() => setSelectedMode(null)}
            >
              <ArrowLeft size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text style={styles.practiceTitle}>
              {selectedMode === 'flash' ? 'Flashcards' : 
               selectedMode === 'spelling' ? 'Spelling Challenge' : 'Word Matching'}
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          {selectedMode === 'flash' && renderFlashcardMode()}
          {selectedMode === 'spelling' && renderSpellingMode()}
          {selectedMode === 'matching' && renderMatchingMode()}
        </>
      ) : (
        renderModeSelection()
      )}
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
    marginHorizontal: 16,
    marginTop: 8,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  modeContainer: {
    padding: 16,
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeName: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 4,
  },
  modeDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  statsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  statsSectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  practiceTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  practiceContainer: {
    flex: 1,
    padding: 16,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'right',
    marginBottom: 16,
  },
  flashcard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginVertical: 24,
    minHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcardContent: {
    alignItems: 'center',
  },
  flashcardText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneticText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  speakButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: '48%',
    justifyContent: 'center',
  },
  incorrectButton: {
    backgroundColor: '#EF4444',
  },
  correctButton: {
    backgroundColor: '#10B981',
  },
  actionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});