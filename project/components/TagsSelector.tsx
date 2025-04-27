import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Tag, Plus } from 'lucide-react-native';
import { useState } from 'react';

type TagsSelectorProps = {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
};

export default function TagsSelector({ selectedTags, onTagSelect }: TagsSelectorProps) {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onTagSelect(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Add Tags</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTag}
          onChangeText={setNewTag}
          placeholder="Enter a new tag"
          onSubmitEditing={handleAddTag}
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddTag}
          disabled={!newTag.trim()}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tagsContainer}>
        {selectedTags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tagChip}
            onPress={() => onTagSelect(tag)}
          >
            <Tag size={12} color="#FFFFFF" />
            <Text style={styles.tagChipText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E293B',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
});