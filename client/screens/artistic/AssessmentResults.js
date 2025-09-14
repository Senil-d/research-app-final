// RIASEC Assessment Results Component - Displays comprehensive skill assessment results
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { 
  processAssessmentResults, 
  getSkillLevelColor,
  getOverallScoreColor,
  calculateFinalScore,
  convertToScoreOutOf10
} from './RIASECScoring';

const APP_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6', 
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  light: '#f8fafc',
  dark: '#0f172a',
  darkCard: '#1e293b',
  darkBorder: '#334155',
  darkText: '#e2e8f0',
  darkSubtext: '#94a3b8'
};

const RIASEC_TYPES = {
  Realistic: { name: 'Realistic', description: 'Doers - practical, physical, hands-on, tool-oriented' },
  Investigative: { name: 'Investigative', description: 'Thinkers - analytical, intellectual, scientific, explorative' },
  Artistic: { name: 'Artistic', description: 'Creators - creative, intuitive, imaginative, expressive' },
  Social: { name: 'Social', description: 'Helpers - cooperative, supportive, healing, nurturing' },
  Enterprising: { name: 'Enterprising', description: 'Persuaders - competitive, ambitious, energetic, leadership' },
  Conventional: { name: 'Conventional', description: 'Organizers - detail-oriented, structured, organized, clerical' }
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 350;
const isMediumScreen = width >= 350 && width <= 400;
const isLargeScreen = width > 400;

const getResponsiveValue = (small, medium, large) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

const AssessmentResults = ({ 
  scores, 
  questions, 
  totalCorrect, 
  totalQuestions, 
  careerOptions, 
  careerCompatibility,
  onContinue,
  onProceedToCV,
  showCVOption = false,
  cvAnalysis = null
}) => {
  const navigation = useNavigation();


  // Process all results using the scoring system
  const results = processAssessmentResults({
    scores,
    questions,
    totalCorrect,
    totalQuestions,
    careerOptions,
    careerCompatibility,
    cvAnalysis
  });

  const {
    topSkills,
    recommendations,
    percentageScore,
    scoreColor,
    scoreMessage,
    assessmentScoreOut10,
    finalScoreData
  } = results;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.stepContainer}>
        <Text style={styles.title}>Your RIASEC Skill Assessment</Text>
        
        {/* Overall Score Summary */}
        <View style={[styles.scoreSummary, { borderColor: scoreColor }]}>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreCircleText, { color: scoreColor }]}>
              {percentageScore}%
            </Text>
          </View>
          <Text style={[styles.scoreMessage, { color: scoreColor }]}>
            {scoreMessage}
          </Text>
          <Text style={styles.detailText}>
            You answered {totalCorrect} out of {totalQuestions} questions correctly
          </Text>
          <Text style={styles.assessmentScoreText}>
            Assessment Score: {assessmentScoreOut10}/10
          </Text>
        </View>

        {/* Final Score Display */}
        {finalScoreData && (
          <View style={[styles.finalScoreContainer, { borderColor: finalScoreData.level.color }]}>
            <Text style={styles.finalScoreTitle}>🎯 Final Combined Score</Text>
            
            <View style={styles.scoreBreakdownContainer}>
              <View style={styles.scoreBreakdownRow}>
                <Text style={styles.scoreLabel}>Assessment Score:</Text>
                <Text style={styles.scoreValue}>{finalScoreData.assessmentScore}/10</Text>
              </View>
              
              {finalScoreData.bonusPoints > 0 && (
                <View style={styles.scoreBreakdownRow}>
                  <Text style={[styles.scoreLabel, styles.bonusLabel]}>Bonus Points:</Text>
                  <Text style={[styles.scoreValue, styles.bonusValue]}>+{finalScoreData.bonusPoints}</Text>
                </View>
              )}
              
              {finalScoreData.bonusReason && (
                <Text style={styles.bonusReason}>🎨 {finalScoreData.bonusReason}</Text>
              )}
              
              <View style={styles.divider} />
              
              <View style={[styles.finalScoreBadge, { backgroundColor: finalScoreData.level.color }]}>
                <Text style={styles.finalScoreText}>
                  Final Score: {finalScoreData.finalScore}/10
                </Text>
                <Text style={styles.finalLevelText}>
                  Level: {finalScoreData.level.name}
                </Text>
              </View>
              
              <Text style={styles.levelDescription}>
                {finalScoreData.level.description}
              </Text>
            </View>
          </View>
        )}

        {/* Top Skills Highlight */}
        <View style={styles.topSkillsSection}>
          <Text style={styles.sectionTitle}>🏆 Your Top RIASEC Skills</Text>
          {topSkills && topSkills.length > 0 ? (
            topSkills.slice(0, 3).map((skill, index) => (
              <View key={skill.type} style={styles.topSkillCard}>
                <View style={styles.skillHeader}>
                  <View style={styles.skillRank}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillName}>{RIASEC_TYPES[skill.type].name}</Text>
                    <Text style={styles.skillSubtitle}>{RIASEC_TYPES[skill.type].description}</Text>
                  </View>
                  <View style={[styles.skillLevelBadge, { backgroundColor: skill.color }]}>
                    <Text style={styles.skillLevelText}>{skill.level}</Text>
                  </View>
                </View>
                
                <View style={styles.skillProgress}>
                  <View style={styles.skillBarContainer}>
                    <View 
                      style={[styles.skillBar, { 
                        width: `${skill.percentage}%`,
                        backgroundColor: skill.color
                      }]} 
                    />
                  </View>
                  <Text style={[styles.skillPercentage, { color: skill.color }]}>
                    {skill.percentage}%
                  </Text>
                </View>
                
                <Text style={styles.skillDescription}>{skill.description}</Text>
                
                <View style={styles.skillStats}>
                  <Text style={styles.skillStatsText}>
                    Correct Answers: {skill.score}/{skill.maxScore}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No skill data available. Please complete the assessment.</Text>
            </View>
          )}
        </View>

        {/* Detailed RIASEC Profile */}
        <View style={styles.detailedProfileSection}>
          <Text style={styles.sectionTitle}>📈 Complete RIASEC Profile</Text>
          {topSkills && topSkills.length > 0 ? (
            topSkills.map((skill) => (
              <View key={skill.type} style={styles.profileRow}>
                <View style={styles.profileHeader}>
                  <Text style={styles.profileLabel}>{RIASEC_TYPES[skill.type].name}</Text>
                  <View style={[styles.profileLevelBadge, { backgroundColor: skill.color }]}>
                    <Text style={styles.profileLevelText}>{skill.level}</Text>
                  </View>
                </View>
                
                <View style={styles.profileProgress}>
                  <View style={styles.profileBarContainer}>
                    <View 
                      style={[styles.profileBar, { 
                        width: `${skill.percentage}%`,
                        backgroundColor: skill.color
                      }]} 
                    />
                  </View>
                  <Text style={[styles.profileScore, { color: skill.color }]}>
                    {skill.score}/{skill.maxScore}
                  </Text>
                </View>
                
                <Text style={styles.profileDescription}>
                  {RIASEC_TYPES[skill.type].description}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>Complete the assessment to see your detailed profile.</Text>
            </View>
          )}
        </View>

        {/* Career Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>🎯 Recommended Career Paths</Text>
            {recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationCard}>
                <View style={styles.recHeader}>
                  <Text style={styles.recCareer}>{rec.career}</Text>
                  <View style={[styles.recCompatibility, { backgroundColor: getOverallScoreColor(rec.compatibility) }]}>
                    <Text style={styles.recCompatibilityText}>{rec.compatibility}%</Text>
                  </View>
                </View>
                <Text style={styles.recReason}>{rec.matchReason}</Text>
                <View style={styles.recProgressBar}>
                  <View 
                    style={[styles.recProgress, { 
                      width: `${rec.compatibility}%`,
                      backgroundColor: getOverallScoreColor(rec.compatibility)
                    }]} 
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Career Compatibility Overview */}
        <View style={styles.compatibilitySection}>
          <Text style={styles.sectionTitle}>💼 All Career Compatibility</Text>
          {careerOptions.map((career) => {
            const compatibility = careerCompatibility[career.id] || 0;
            const compatibilityColor = getOverallScoreColor(compatibility);
            
            return (
              <View key={career.id} style={styles.compatibilityRow}>
                <View style={styles.compatibilityHeader}>
                  <Text style={styles.compatibilityLabel}>{career.name}</Text>
                  <Text style={[styles.compatibilityValue, { color: compatibilityColor }]}>
                    {compatibility}%
                  </Text>
                </View>
                <View style={styles.compatibilityBarContainer}>
                  <View 
                    style={[styles.compatibilityBar, { 
                      width: `${compatibility}%`,
                      backgroundColor: compatibilityColor
                    }]} 
                  />
                </View>
                <Text style={styles.compatibilityTypes}>
                  Matches: {career.riasec.join(', ')}
                </Text>
              </View>
            );
          })}
        </View>

        {showCVOption ? (
          <View>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={onContinue}
            >
              <Text style={styles.primaryButtonText}>✅ View Final Assessment Score</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: '#10b981', marginTop: 12 }]}
              onPress={() => {
                // Navigate to CV with assessment results and callback
                const assessmentScore = convertToScoreOutOf10(totalCorrect, totalQuestions);
                navigation.navigate('cv', {
                  assessmentResults: {
                    selectedCareer: careerOptions[0],
                    assessmentScoreOut10: assessmentScore,
                    totalCorrect,
                    totalQuestions
                  },
                  onCVComplete: (cvResult) => {
                    // Navigate to final score with CV results
                    navigation.navigate('finalscore', {
                      assessmentScore: assessmentScore,
                      cvPrediction: cvResult?.prediction,
                      cvConfidence: cvResult?.confidence || 0,
                      selectedCareer: careerOptions[0]
                    });
                  }
                });
              }}
            >
              <Text style={styles.primaryButtonText}>📄 Continue to CV Analysis (Optional)</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('finalscore', {
              assessmentScore: convertToScoreOutOf10(totalCorrect, totalQuestions),
              selectedCareer: careerOptions[0] // Default career if none specified
            })}
          >
            <Text style={styles.primaryButtonText}>View Final Score</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLORS.dark,
  },
  stepContainer: {
    flex: 1,
    padding: getResponsiveValue(12, 16, 20),
    backgroundColor: APP_COLORS.dark,
  },
  title: {
    fontSize: getResponsiveValue(20, 22, 24),
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: getResponsiveValue(16, 18, 20),
    paddingHorizontal: getResponsiveValue(8, 12, 16),
    textShadowColor: 'rgba(99, 102, 241, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Score Summary Styles
  scoreSummary: {
    backgroundColor: APP_COLORS.darkCard,
    padding: getResponsiveValue(24, 28, 32),
    borderRadius: 24,
    marginBottom: getResponsiveValue(20, 24, 28),
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  scoreCircle: {
    width: getResponsiveValue(90, 100, 110),
    height: getResponsiveValue(90, 100, 110),
    borderRadius: getResponsiveValue(45, 50, 55),
    backgroundColor: APP_COLORS.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    marginBottom: getResponsiveValue(16, 18, 20),
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  scoreCircleText: {
    fontSize: getResponsiveValue(26, 28, 30),
    fontWeight: 'bold',
  },
  scoreMessage: {
    fontSize: getResponsiveValue(18, 20, 22),
    fontWeight: 'bold',
    marginBottom: getResponsiveValue(10, 12, 14),
    textAlign: 'center',
  },
  detailText: {
    fontSize: getResponsiveValue(14, 15, 16),
    color: APP_COLORS.darkSubtext,
    textAlign: 'center',
  },
  assessmentScoreText: {
    fontSize: getResponsiveValue(16, 17, 18),
    fontWeight: 'bold',
    color: APP_COLORS.primary,
    textAlign: 'center',
    marginTop: getResponsiveValue(8, 10, 12),
  },
  
  // Final Score Styles
  finalScoreContainer: {
    backgroundColor: APP_COLORS.darkCard,
    padding: getResponsiveValue(20, 24, 28),
    borderRadius: 20,
    marginBottom: getResponsiveValue(20, 24, 28),
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  finalScoreTitle: {
    fontSize: getResponsiveValue(20, 22, 24),
    fontWeight: 'bold',
    color: APP_COLORS.darkText,
    textAlign: 'center',
    marginBottom: getResponsiveValue(20, 24, 28),
  },
  scoreBreakdownContainer: {
    alignItems: 'center',
  },
  scoreBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: getResponsiveValue(8, 10, 12),
    paddingHorizontal: getResponsiveValue(16, 20, 24),
  },
  scoreLabel: {
    fontSize: getResponsiveValue(15, 16, 17),
    color: APP_COLORS.darkSubtext,
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: getResponsiveValue(15, 16, 17),
    color: APP_COLORS.darkText,
    fontWeight: 'bold',
  },
  bonusLabel: {
    color: '#059669',
  },
  bonusValue: {
    color: '#059669',
  },
  bonusReason: {
    fontSize: getResponsiveValue(13, 14, 15),
    color: '#059669',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: getResponsiveValue(12, 14, 16),
    fontWeight: '500',
  },
  divider: {
    width: '80%',
    height: 2,
    backgroundColor: '#e5e7eb',
    marginVertical: getResponsiveValue(12, 14, 16),
    borderRadius: 1,
  },
  finalScoreBadge: {
    paddingHorizontal: getResponsiveValue(24, 28, 32),
    paddingVertical: getResponsiveValue(16, 18, 20),
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: getResponsiveValue(12, 14, 16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    minWidth: '80%',
  },
  finalScoreText: {
    color: 'white',
    fontSize: getResponsiveValue(18, 20, 22),
    fontWeight: 'bold',
    marginBottom: getResponsiveValue(4, 5, 6),
  },
  finalLevelText: {
    color: 'white',
    fontSize: getResponsiveValue(16, 17, 18),
    fontWeight: '600',
  },
  levelDescription: {
    fontSize: getResponsiveValue(14, 15, 16),
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: getResponsiveValue(20, 22, 24),
    paddingHorizontal: getResponsiveValue(16, 20, 24),
  },
  
  // Section Styles
  sectionTitle: {
    fontSize: getResponsiveValue(18, 20, 22),
    fontWeight: 'bold',
    color: APP_COLORS.darkText,
    marginBottom: getResponsiveValue(16, 18, 20),
    textAlign: 'center',
  },
  
  // Top Skills Section
  topSkillsSection: {
    marginBottom: getResponsiveValue(24, 28, 32),
  },
  topSkillCard: {
    backgroundColor: APP_COLORS.darkCard,
    borderRadius: 20,
    padding: getResponsiveValue(20, 24, 28),
    marginBottom: getResponsiveValue(16, 18, 20),
    borderWidth: 2,
    borderColor: APP_COLORS.darkBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveValue(16, 18, 20),
  },
  skillRank: {
    width: getResponsiveValue(40, 45, 50),
    height: getResponsiveValue(40, 45, 50),
    borderRadius: getResponsiveValue(20, 22, 25),
    backgroundColor: APP_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveValue(12, 14, 16),
  },
  rankText: {
    color: 'white',
    fontSize: getResponsiveValue(16, 18, 20),
    fontWeight: 'bold',
  },
  skillInfo: {
    flex: 1,
    marginRight: getResponsiveValue(8, 10, 12),
  },
  skillName: {
    fontSize: getResponsiveValue(18, 20, 22),
    fontWeight: 'bold',
    color: APP_COLORS.darkText,
    marginBottom: getResponsiveValue(2, 3, 4),
  },
  skillSubtitle: {
    fontSize: getResponsiveValue(12, 13, 14),
    color: APP_COLORS.darkSubtext,
    lineHeight: getResponsiveValue(16, 18, 20),
  },
  skillLevelBadge: {
    paddingHorizontal: getResponsiveValue(12, 14, 16),
    paddingVertical: getResponsiveValue(6, 7, 8),
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillLevelText: {
    color: 'white',
    fontSize: getResponsiveValue(12, 13, 14),
    fontWeight: 'bold',
  },
  skillProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveValue(12, 14, 16),
  },
  skillBarContainer: {
    flex: 1,
    height: getResponsiveValue(12, 14, 16),
    backgroundColor: APP_COLORS.dark,
    borderRadius: getResponsiveValue(6, 7, 8),
    overflow: 'hidden',
    marginRight: getResponsiveValue(12, 14, 16),
    borderWidth: 1,
    borderColor: APP_COLORS.darkBorder,
  },
  skillBar: {
    height: '100%',
    borderRadius: getResponsiveValue(6, 7, 8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  skillPercentage: {
    fontSize: getResponsiveValue(16, 18, 20),
    fontWeight: 'bold',
    minWidth: getResponsiveValue(50, 55, 60),
    textAlign: 'right',
  },
  skillDescription: {
    fontSize: getResponsiveValue(14, 15, 16),
    color: APP_COLORS.darkSubtext,
    lineHeight: getResponsiveValue(20, 22, 24),
    marginBottom: getResponsiveValue(12, 14, 16),
    fontStyle: 'italic',
  },
  skillStats: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: getResponsiveValue(8, 10, 12),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: APP_COLORS.darkBorder,
  },
  skillStatsText: {
    fontSize: getResponsiveValue(12, 13, 14),
    color: APP_COLORS.darkSubtext,
    textAlign: 'center',
    fontWeight: '600',
  },
  
  // Profile Section
  detailedProfileSection: {
    marginBottom: getResponsiveValue(24, 28, 32),
  },
  profileRow: {
    backgroundColor: APP_COLORS.darkCard,
    borderRadius: 16,
    padding: getResponsiveValue(16, 18, 20),
    marginBottom: getResponsiveValue(12, 14, 16),
    borderWidth: 1,
    borderColor: APP_COLORS.darkBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveValue(10, 12, 14),
  },
  profileLabel: {
    fontSize: getResponsiveValue(16, 17, 18),
    fontWeight: 'bold',
    color: APP_COLORS.darkText,
    flex: 1,
  },
  profileLevelBadge: {
    paddingHorizontal: getResponsiveValue(10, 12, 14),
    paddingVertical: getResponsiveValue(4, 5, 6),
    borderRadius: 12,
  },
  profileLevelText: {
    color: 'white',
    fontSize: getResponsiveValue(11, 12, 13),
    fontWeight: 'bold',
  },
  profileProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveValue(8, 10, 12),
  },
  profileBarContainer: {
    flex: 1,
    height: getResponsiveValue(8, 10, 12),
    backgroundColor: APP_COLORS.dark,
    borderRadius: getResponsiveValue(4, 5, 6),
    overflow: 'hidden',
    marginRight: getResponsiveValue(10, 12, 14),
    borderWidth: 1,
    borderColor: APP_COLORS.darkBorder,
  },
  profileBar: {
    height: '100%',
    borderRadius: getResponsiveValue(4, 5, 6),
  },
  profileScore: {
    fontSize: getResponsiveValue(14, 15, 16),
    fontWeight: 'bold',
    minWidth: getResponsiveValue(40, 45, 50),
    textAlign: 'right',
  },
  profileDescription: {
    fontSize: getResponsiveValue(12, 13, 14),
    color: APP_COLORS.darkSubtext,
    lineHeight: getResponsiveValue(16, 18, 20),
  },
  
  // Recommendations Section
  recommendationsSection: {
    marginBottom: getResponsiveValue(24, 28, 32),
  },
  recommendationCard: {
    backgroundColor: APP_COLORS.darkCard,
    borderRadius: 16,
    padding: getResponsiveValue(18, 20, 22),
    marginBottom: getResponsiveValue(12, 14, 16),
    borderWidth: 2,
    borderColor: APP_COLORS.success,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveValue(8, 10, 12),
  },
  recCareer: {
    fontSize: getResponsiveValue(16, 17, 18),
    fontWeight: 'bold',
    color: APP_COLORS.darkText,
    flex: 1,
  },
  recCompatibility: {
    paddingHorizontal: getResponsiveValue(12, 14, 16),
    paddingVertical: getResponsiveValue(6, 7, 8),
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recCompatibilityText: {
    color: 'white',
    fontSize: getResponsiveValue(12, 13, 14),
    fontWeight: 'bold',
  },
  recReason: {
    fontSize: getResponsiveValue(13, 14, 15),
    color: APP_COLORS.darkSubtext,
    marginBottom: getResponsiveValue(10, 12, 14),
    fontStyle: 'italic',
  },
  recProgressBar: {
    height: getResponsiveValue(6, 8, 10),
    backgroundColor: APP_COLORS.dark,
    borderRadius: getResponsiveValue(3, 4, 5),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: APP_COLORS.darkBorder,
  },
  recProgress: {
    height: '100%',
    borderRadius: getResponsiveValue(3, 4, 5),
  },
  
  // Compatibility Section
  compatibilitySection: {
    marginBottom: getResponsiveValue(24, 28, 32),
  },
  compatibilityRow: {
    backgroundColor: APP_COLORS.darkCard,
    borderRadius: 12,
    padding: getResponsiveValue(16, 18, 20),
    marginBottom: getResponsiveValue(10, 12, 14),
    borderWidth: 1,
    borderColor: APP_COLORS.darkBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getResponsiveValue(8, 10, 12),
  },
  compatibilityLabel: {
    fontSize: getResponsiveValue(15, 16, 17),
    fontWeight: 'bold',
    color: APP_COLORS.darkText,
    flex: 1,
  },
  compatibilityValue: {
    fontSize: getResponsiveValue(15, 16, 17),
    fontWeight: 'bold',
  },
  compatibilityBarContainer: {
    height: getResponsiveValue(8, 10, 12),
    backgroundColor: APP_COLORS.dark,
    borderRadius: getResponsiveValue(4, 5, 6),
    overflow: 'hidden',
    marginBottom: getResponsiveValue(6, 8, 10),
    borderWidth: 1,
    borderColor: APP_COLORS.darkBorder,
  },
  compatibilityBar: {
    height: '100%',
    borderRadius: getResponsiveValue(4, 5, 6),
  },
  compatibilityTypes: {
    fontSize: getResponsiveValue(11, 12, 13),
    color: APP_COLORS.darkSubtext,
    fontStyle: 'italic',
  },
  
  // No data styles
  noDataContainer: {
    backgroundColor: APP_COLORS.darkCard,
    borderRadius: 16,
    padding: getResponsiveValue(20, 24, 28),
    marginBottom: getResponsiveValue(16, 18, 20),
    borderWidth: 2,
    borderColor: APP_COLORS.darkBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    fontSize: getResponsiveValue(14, 15, 16),
    color: APP_COLORS.darkSubtext,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: APP_COLORS.primary,
    padding: getResponsiveValue(16, 18, 20),
    borderRadius: 16,
    alignItems: 'center',
    marginTop: getResponsiveValue(8, 9, 10),
    shadowColor: APP_COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: getResponsiveValue(15, 16, 17),
  },
});

export default AssessmentResults;