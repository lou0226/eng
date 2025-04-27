import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { WordType } from '@/types/vocabulary';

type WordCardProps = {
  word: WordType;
  onPlay: () => void;
};

export default function WordCard({ word, onPlay }: WordCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.term}>{word.term}</Text>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={onPlay}
        >
          <Volume2 size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.phonetic}>{word.phonetic}</Text>
      
      <Text style={styles.definition}>{word.definition}</Text>
      
      <View style={styles.tagContainer}>
        {word.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.dateText}>
          Added {new Date(word.createdAt).toLocaleDateString()}
        </Text>
        <View style={styles.masteryContainer}>
          <Text style={styles.masteryText}>Mastery:</Text>
          <View style={styles.masteryBar}>
            <View 
              style={[
                styles.masteryProgress, 
                { width: `${word.mastery}%` }
              ]} 
            />
          </View>
          <Text style={styles.masteryPercentage}>{word.mastery}%</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  term: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phonetic: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  definition: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginBottom: 16,
    lineHeight: 24,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#3B82F6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
  },
  masteryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  masteryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginRight: 4,
  },
  masteryBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginRight: 4,
  },
  masteryProgress: {
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  masteryPercentage: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#3B82F6',
  },
});