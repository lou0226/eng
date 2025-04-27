import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Volume2, Trash2, Download, Upload, Repeat, Bell, User, LogOut, Globe, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useVocabulary } from '@/hooks/useVocabulary';

export default function SettingsScreen() {
  const { clearVocabulary } = useVocabulary();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'female',
    speed: 'normal',
    accent: 'american'
  });
  
  const confirmClearVocabulary = () => {
    if (Platform.OS === 'web') {
      if (confirm('Are you sure you want to clear all vocabulary? This action cannot be undone.')) {
        clearVocabulary();
      }
    } else {
      Alert.alert(
        'Clear Vocabulary',
        'Are you sure you want to clear all vocabulary? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: () => clearVocabulary() }
        ]
      );
    }
  };
  
  const testVoice = () => {
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance("This is a test of the voice settings.");
      speech.lang = voiceSettings.accent === 'american' ? 'en-US' : 'en-GB';
      speech.rate = voiceSettings.speed === 'slow' ? 0.8 : voiceSettings.speed === 'fast' ? 1.2 : 1;
      window.speechSynthesis.speak(speech);
    } else {
      Alert.alert('Voice Test', 'Speech synthesis is not available on this platform');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.headerTitle}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Moon size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={darkMode ? '#3B82F6' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={notifications ? '#3B82F6' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Globe size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <TouchableOpacity style={styles.settingButton}>
              <Text style={styles.settingButtonText}>English</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Volume2 size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Auto-play Pronunciation</Text>
            </View>
            <Switch
              value={autoPlay}
              onValueChange={setAutoPlay}
              trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
              thumbColor={autoPlay ? '#3B82F6' : '#FFFFFF'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <User size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Voice Gender</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[
                  styles.groupButton, 
                  voiceSettings.voice === 'male' && styles.activeGroupButton,
                  { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
                ]}
                onPress={() => setVoiceSettings({...voiceSettings, voice: 'male'})}
              >
                <Text 
                  style={[
                    styles.groupButtonText,
                    voiceSettings.voice === 'male' && styles.activeGroupButtonText
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.groupButton, 
                  voiceSettings.voice === 'female' && styles.activeGroupButton,
                  { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
                ]}
                onPress={() => setVoiceSettings({...voiceSettings, voice: 'female'})}
              >
                <Text 
                  style={[
                    styles.groupButtonText,
                    voiceSettings.voice === 'female' && styles.activeGroupButtonText
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Globe size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Accent</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[
                  styles.groupButton, 
                  voiceSettings.accent === 'american' && styles.activeGroupButton,
                  { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
                ]}
                onPress={() => setVoiceSettings({...voiceSettings, accent: 'american'})}
              >
                <Text 
                  style={[
                    styles.groupButtonText,
                    voiceSettings.accent === 'american' && styles.activeGroupButtonText
                  ]}
                >
                  American
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.groupButton, 
                  voiceSettings.accent === 'british' && styles.activeGroupButton,
                  { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
                ]}
                onPress={() => setVoiceSettings({...voiceSettings, accent: 'british'})}
              >
                <Text 
                  style={[
                    styles.groupButtonText,
                    voiceSettings.accent === 'british' && styles.activeGroupButtonText
                  ]}
                >
                  British
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Repeat size={20} color="#3B82F6" />
              <Text style={styles.settingLabel}>Speech Speed</Text>
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[
                  styles.groupButton, 
                  voiceSettings.speed === 'slow' && styles.activeGroupButton,
                  { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }
                ]}
                onPress={() => setVoiceSettings({...voiceSettings, speed: 'slow'})}
              >
                <Text 
                  style={[
                    styles.groupButtonText,
                    voiceSettings.speed === 'slow' && styles.activeGroupButtonText
                  ]}
                >
                  Slow
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.groupButton, 
                  voiceSettings.speed === 'normal' && styles.activeGroupButton
                ]}
                onPress={() => setVoiceSettings({...voiceSettings, speed: 'normal'})}
              >
                <Text 
                  style={[
                    styles.groupButtonText,
                    voiceSettings.speed === 'normal' && styles.activeGroupButtonText
                  ]}
                >
                  Normal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.groupButton, 
                  voiceSettings.speed === 'fast' && styles.activeGroupButton,
                  { borderTopRightRadius: 8, borderBottomRightRadius: 8 }
                ]}
                onPress={() => setVoiceSettings({...voiceSettings, speed: 'fast'})}
              >
                <Text 
                  style={[
                    styles.groupButtonText,
                    voiceSettings.speed === 'fast' && styles.activeGroupButtonText
                  ]}
                >
                  Fast
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.testVoiceButton}
            onPress={testVoice}
          >
            <Volume2 size={20} color="#FFFFFF" />
            <Text style={styles.testVoiceButtonText}>Test Voice Settings</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Download size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Export Vocabulary</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Upload size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Import Vocabulary</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={confirmClearVocabulary}
          >
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Clear All Vocabulary</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <HelpCircle size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Help Center</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LogOut size={20} color="#3B82F6" />
            <Text style={styles.actionButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1E293B',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1E293B',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  settingButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  settingButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  buttonGroup: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  groupButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
  },
  activeGroupButton: {
    backgroundColor: '#3B82F6',
  },
  groupButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  activeGroupButtonText: {
    color: '#FFFFFF',
  },
  testVoiceButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  testVoiceButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dangerButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 12,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
  },
});