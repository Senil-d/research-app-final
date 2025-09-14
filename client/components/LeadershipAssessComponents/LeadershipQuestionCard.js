// components/LeadershipQuestionCard.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Animated, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import TimedProgressCircle from './TimedProgressCircle';
import RoleplayDialog from './RoleplayDialog';
import DragAndDropSorter from './DragAndDropSorter';
import MicrocopyBanner from './MicrocopyBanner';

const typeIcons = {
  timed: 'timer',
  roleplay: 'theater-comedy',
  drag_drop: 'import-export',
  msq: 'check-circle',
};

export default function LeadershipQuestionCard({
  question,
  onAnswerSelect,
  selectedAnswer,
  onDragDropAnswer,
  timerDuration = 15,
  onTimerEnd,
  trait,
  avatarImage,
}) {
  const [localSelected, setLocalSelected] = useState(null);

  useEffect(() => {
    setLocalSelected(null); // reset when question changes
  }, [question]);

  const handleSelect = (index) => {
    setLocalSelected(index);
    onAnswerSelect(index);
  };

  const renderOptions = () => {
    return question.options.map((option, index) => {
      const isSelected = localSelected === index;
      return (
        <TouchableOpacity
          key={index}
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => handleSelect(index)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      );
    });
  };

  const renderQuestionType = () => {
    switch (question.type) {
      case 'timed':
        return (
          <>
            <TimedProgressCircle duration={timerDuration} onComplete={onTimerEnd} />
            <Text style={styles.questionText}>{question.question}</Text>
            {renderOptions()}
          </>
        );
      case 'roleplay':
        return (
          <RoleplayDialog
            question={question}
            avatarImage={avatarImage}
            onSelect={handleSelect}
            selectedIndex={localSelected}
          />
        );
      case 'drag_drop':
        return (
          <DragAndDropSorter
            options={question.options}
            onComplete={onDragDropAnswer}
          />
        );
      case 'msq':
      default:
        return (
          <>
            <Text style={styles.questionText}>{question.question}</Text>
            {renderOptions()}
          </>
        );
    }
  };

  return (
    <Animatable.View animation="fadeInUp" duration={500} style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.traitBadge}>
          <MaterialIcons name="star" size={16} color="#fff" />
          <Text style={styles.traitText}>{trait}</Text>
        </View>
        <MaterialIcons name={typeIcons[question.type] || 'help'} size={24} color="#444" />
      </View>

      {/* Microcopy Banner */}
      <MicrocopyBanner trait={trait} />

      {/* Question Body */}
      <View style={styles.cardBody}>
        {renderQuestionType()}
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  traitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A2647',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  traitText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
    color: '#1A1A1A',
  },
  option: {
    backgroundColor: '#F0F0F0',
    padding: 14,
    borderRadius: 12,
    marginVertical: 8,
  },
  optionSelected: {
    backgroundColor: '#1A73E8',
  },
  optionText: {
    color: '#000',
    fontSize: 16,
  },
  cardBody: {
    marginTop: 12,
  },
});
