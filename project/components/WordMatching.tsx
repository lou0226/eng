import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WordType } from '@/types/vocabulary';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface WordMatchingProps {
  words: WordType[];
  onComplete: (score: number) => void;
}

export default function WordMatching({ words, onComplete }: WordMatchingProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [shuffledTerms, setShuffledTerms] = useState<string[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Shuffle terms and definitions
    const terms = words.map(w => w.term);
    const definitions = words.map(w => w.definition);
    setShuffledTerms(shuffle([...terms]));
    setShuffledDefinitions(shuffle([...definitions]));
    setMatchedPairs(new Set());
    setScore(0);
  }, [words]);

  const shuffle = (array: string[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleTermSelect = (term: string) => {
    if (matchedPairs.has(term)) return;
    setSelectedTerm(term);
  };

  const handleDefinitionSelect = (definition: string) => {
    if (!selectedTerm) return;
    
    const word = words.find(w => w.term === selectedTerm);
    if (word?.definition === definition) {
      // Correct match
      setMatchedPairs(prev => new Set([...prev, selectedTerm]));
      setScore(prev => prev + 1);
      
      if (matchedPairs.size + 1 === words.length) {
        // All pairs matched
        onComplete(score + 1);
      }
    }
    
    setSelectedTerm(null);
    setSelectedDefinition(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        {shuffledTerms.map((term, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              matchedPairs.has(term) && styles.matchedCard,
              selectedTerm === term && styles.selectedCard
            ]}
            onPress={() => handleTermSelect(term)}
            disabled={matchedPairs.has(term)}
          >
            <Text style={[
              styles.cardText,
              matchedPairs.has(term) && styles.matchedCardText
            ]}>
              {term}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.column}>
        {shuffledDefinitions.map((definition, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              selectedDefinition === definition && styles.selectedCard
            ]}
            onPress={() => handleDefinitionSelect(definition)}
          >
            <Text style={styles.cardText}>{definition}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {matchedPairs.size > 0 && (
        <Animated.View 
          style={styles.scoreContainer}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Text style={styles.scoreText}>
            Matched: {matchedPairs.size} / {words.length}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  column: {
    flex: 1,
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedCard: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  matchedCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  cardText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
  },
  matchedCardText: {
    color: '#10B981',
  },
  scoreContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});