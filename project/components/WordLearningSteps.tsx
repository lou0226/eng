import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, ArrowRight } from 'lucide-react-native';
import { WordType } from '@/types/vocabulary';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface WordLearningStepsProps {
  word: WordType;
  onComplete: () => void;
}

export default function WordLearningSteps({ word, onComplete }: WordLearningStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [repetitionCount, setRepetitionCount] = useState(0);
  
  const steps = [
    {
      title: 'Read Chinese Definition',
      content: word.definition,
      showSpeak: false,
    },
    {
      title: 'Read English Word',
      content: word.term,
      showSpeak: true,
    },
    {
      title: 'Spell Out Letters',
      content: word.term.split('').join('-'),
      showSpeak: false,
    },
    {
      title: 'Read English Word Again',
      content: word.term,
      showSpeak: true,
    },
  ];

  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (repetitionCount < 2) {
        setCurrentStep(0);
        setRepetitionCount(repetitionCount + 1);
      } else {
        onComplete();
      }
    }
  };

  useEffect(() => {
    // Auto-speak when showing English word
    if (steps[currentStep].showSpeak) {
      speakWord(word.term);
    }
  }, [currentStep]);

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressStep,
                currentStep >= index && styles.progressStepActive,
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          Repetition {repetitionCount + 1}/3
        </Text>
      </View>

      <Animated.View
        style={styles.contentContainer}
        entering={FadeIn}
        exiting={FadeOut}
      >
        <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
        <Text style={styles.content}>{steps[currentStep].content}</Text>

        {steps[currentStep].showSpeak && (
          <TouchableOpacity
            style={styles.speakButton}
            onPress={() => speakWord(word.term)}
          >
            <Volume2 size={24} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </Animated.View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {repetitionCount === 2 && currentStep === steps.length - 1
            ? 'Complete'
            : 'Next'}
        </Text>
        <ArrowRight size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStep: {
    width: '23%',
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#3B82F6',
  },
  progressText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  stepTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#3B82F6',
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
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});