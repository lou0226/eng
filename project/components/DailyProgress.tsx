import { View, Text, StyleSheet } from 'react-native';

type DayProgress = {
  day: string;
  count: number;
  percentage: number;
};

// Mock data for the weekly progress chart
const weekProgress: DayProgress[] = [
  { day: 'Mon', count: 15, percentage: 0.6 },
  { day: 'Tue', count: 20, percentage: 0.8 },
  { day: 'Wed', count: 10, percentage: 0.4 },
  { day: 'Thu', count: 25, percentage: 1 },
  { day: 'Fri', count: 5, percentage: 0.2 },
  { day: 'Sat', count: 12, percentage: 0.48 },
  { day: 'Sun', count: 18, percentage: 0.72 },
];

export function DailyProgress() {
  const maxBarHeight = 100; // Maximum height for the tallest bar in pixels
  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Weekly Activity</Text>
        <Text style={styles.subtitle}>Daily words reviewed</Text>
      </View>
      
      <View style={styles.chartContainer}>
        {weekProgress.map((day, index) => (
          <View key={index} style={styles.barColumn}>
            <View style={styles.barLabelContainer}>
              <Text style={styles.barValue}>{day.count}</Text>
            </View>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: day.percentage * maxBarHeight,
                    backgroundColor: day.percentage >= 0.7 ? '#3B82F6' : day.percentage >= 0.4 ? '#60A5FA' : '#93C5FD'
                  }
                ]} 
              />
            </View>
            <Text style={styles.dayLabel}>{day.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
  },
  barColumn: {
    alignItems: 'center',
    width: '12%',
  },
  barLabelContainer: {
    position: 'absolute',
    top: -20,
    width: '100%',
    alignItems: 'center',
  },
  barValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
  },
  barContainer: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '60%',
    borderRadius: 4,
    alignSelf: 'center',
  },
  dayLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
});