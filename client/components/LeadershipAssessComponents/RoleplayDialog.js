// components/RoleplayDialog.js

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons';

export default function RoleplayDialog({
  question,
  avatarImage,
  onSelect,
  selectedIndex
}) {
  const renderOption = ({ item, index }) => {
    const isSelected = selectedIndex === index;

    return (
      <TouchableOpacity
        onPress={() => onSelect(index)}
        style={[styles.userReply, isSelected && styles.selectedReply]}
      >
        <Text style={styles.replyText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Avatar + Dialog Box */}
      <View style={styles.dialogRow}>
        <Image
          source={
            avatarImage
              ? { uri: avatarImage }
              : require('../assets/avatar.png') // fallback avatar image
          }
          style={styles.avatar}
        />
        <Animatable.View
          animation="fadeInLeft"
          duration={600}
          style={styles.dialogBox}
        >
          <Text style={styles.dialogText}>{question.question}</Text>
        </Animatable.View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* User Response Options */}
      <FlatList
        data={question.options}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOption}
        contentContainerStyle={{ paddingBottom: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  dialogRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  dialogBox: {
    backgroundColor: '#EDF3FB',
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  dialogText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  userReply: {
    backgroundColor: '#F2F2F2',
    padding: 14,
    marginVertical: 6,
    borderRadius: 10,
  },
  selectedReply: {
    backgroundColor: '#1A73E8',
  },
  replyText: {
    fontSize: 16,
    color: '#000',
  },
});
