import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, Check, X } from 'lucide-react-native';
import { WordType } from '@/types/vocabulary';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface SpellingChallengeProps {
  word: WordType;
  onCorrect: () => void;
  onIncorrect: () => void;
}

export default function SpellingChallenge({ word, onCorrect, onIncorrect }: SpellingChallengeProps) {
  const [input, setInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setInput('');
    setShowResult(false);
  }, [word]);

  const checkAnswer = () => {
    const correct = input.toLowerCase().trim() === word.term.toLowerCase().trim();
    setIsCorrect(correct);
    setShowResult(true);
    
    setTimeout(() => {
      if (correct) {
        onCorrect();
      } else {
        onIncorrect();
      }
      setShowResult(false);
    }, 1500);
  };

  const speakWord = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(word.term);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.speakButton}
        onPress={speakWord}
      >
        <Volume2 size={24} color="#3B82F6" />
        <Text style={styles.speakText}>Listen to the word</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Type what you hear..."
        value={input}
        onChangeText={setInput}
        onSubmitEditing={checkAnswer}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!showResult}
      />

      <TouchableOpacity
        style={[styles.submitButton, !input.trim() && styles.submitButtonDisabled]}
        onPress={checkAnswer}
        disabled={!input.trim() || showResult}
      >
        <Text style={styles.submitButtonText}>Check</Text>
      </TouchableOpacity>

      {showResult && (
        <Animated.View 
          style={[
            styles.resultContainer,
            isCorrect ? styles.correctResult : styles.incorrectResult
          ]}
          entering={FadeIn}
          exiting={FadeOut}
        >
          {isCorrect ? (
            <>
              <Check size={24} color="#FFFFFF" />
              <Text style={styles.resultText}>Correct!</Text>
            </>
          ) : (
            <>
              <X size={24} color="#FFFFFF" />
              <Text style={styles.resultText}>
                The correct spelling is "{word.term}"
              </Text>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  speakText: {
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3B82F6',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  correctResult: {
    backgroundColor: '#10B981',
  },
  incorrectResult: {
    backgroundColor: '#EF4444',
  },
  resultText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
});