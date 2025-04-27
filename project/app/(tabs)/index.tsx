import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, BookOpen, Clock, ChartBar as BarChart3 } from 'lucide-react-native';
import { useVocabulary } from '@/hooks/useVocabulary';
import { DailyProgress } from '@/components/DailyProgress';

export default function HomeScreen() {
  const { vocabulary, recentWords } = useVocabulary();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.headerTitle}>Ready to expand your vocabulary?</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/3807729/pexels-photo-3807729.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100' }}
            style={styles.avatar}
          />
        </View>

        <DailyProgress />
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <BookOpen size={24} color="#3B82F6" />
            <Text style={styles.statValue}>{vocabulary.length}</Text>
            <Text style={styles.statLabel}>Total Words</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#3B82F6" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Study Streak</Text>
          </View>
          <View style={styles.statCard}>
            <BarChart3 size={24} color="#3B82F6" />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Mastery</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentWords.length > 0 ? (
          recentWords.map((word, index) => (
            <View key={index} style={styles.wordCard}>
              <View>
                <Text style={styles.wordText}>{word.term}</Text>
                <Text style={styles.definitionText} numberOfLines={1}>
                  {word.definition}
                </Text>
              </View>
              <ChevronRight size={20} color="#94A3B8" />
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              You haven't added any words yet. Start building your vocabulary!
            </Text>
            <TouchableOpacity style={styles.addWordButton}>
              <Text style={styles.addWordButtonText}>Add your first word</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Due for Review</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reviewCard}>
          <Text style={styles.reviewTitle}>Daily Review</Text>
          <Text style={styles.reviewSubtitle}>
            5 words are ready for review today
          </Text>
          <TouchableOpacity style={styles.startReviewButton}>
            <Text style={styles.startReviewButtonText}>Start Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginTop: 4,
    maxWidth: Dimensions.get('window').width - 100,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
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
    fontSize: 20,
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  wordText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1E293B',
  },
  definitionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    maxWidth: Dimensions.get('window').width - 80,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  addWordButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  addWordButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  reviewCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  reviewTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  reviewSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#E0E7FF',
    marginTop: 4,
    marginBottom: 16,
  },
  startReviewButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  startReviewButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
  },
});