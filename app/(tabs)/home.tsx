import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import CommonLayout from "../components/CommonLayout";
import { useAnalytics } from "../hooks/useAnalytics";
import { getUserInfo } from "../utils/appStorage";

const HomeScreen = () => {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    loadUserInfo();
    setCurrentDate(new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
  }, []);

  const loadUserInfo = async () => {
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleNavigateToQuiz = () => {
    trackEvent('quiz_navigate_from_home');
    router.push('/(tabs)/quiz');
  };

  const handleNavigateToCourses = () => {
    trackEvent('courses_navigate_from_home');
    router.push('/(tabs)/course');
  };

  const handleCalculateBMI = async () => {
    trackEvent('bmi_calculator_clicked');
    // Open BMI calculator in in-app browser
    try {
      await WebBrowser.openBrowserAsync('https://apshwp.ap.gov.in/en/bmi');
    } catch (error) {
      console.error('Error opening BMI calculator:', error);
    }
  };

  return (
    <CommonLayout title="Home">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.date}>{currentDate}</Text>
        <Text style={styles.welcome}>
          Welcome, <Text style={styles.name}>{userInfo?.name || 'Student'}!</Text>
        </Text>
        <Text style={styles.subtitle}>Always Stay Updated in Your Student Portal</Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="school" size={28} color={Colors.primary} />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Quiz Attempted</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="ribbon" size={28} color={Colors.primary} />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Certificate Earned</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={28} color={Colors.primary} />
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Total Referral</Text>
          </View>
        </View>

        {/* Completed Quiz */}
        <Text style={styles.sectionTitle}>Completed Quiz</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Quiz: </Text>
            <Text style={styles.cardValue}>Quiz on HIV / AIDS Prevention</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Score ( % ): </Text>
            <Text style={styles.cardValue}>80</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Certificate: </Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="download" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Badge: </Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="medal" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Completed Module */}
        <Text style={styles.sectionTitle}>Completed Module</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Module: </Text>
            <Text style={styles.cardValue}>E - Module on Metabolic Health (NCDs Prevention)</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Score ( % ): </Text>
            <Text style={styles.cardValue}>80</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Certificate: </Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="download" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Badge: </Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="medal" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.bottomRow}>
          <TouchableOpacity style={styles.bottomBtn} onPress={handleNavigateToQuiz}>
            <Ionicons name="help-circle" size={20} color={Colors.primary} />
            <Text style={styles.bottomBtnText}>PLAY QUIZ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBtn} onPress={handleCalculateBMI}>
            <Ionicons name="calculator" size={20} color={Colors.primary} />
            <Text style={styles.bottomBtnText}>CALCULATE BMI</Text>
          </TouchableOpacity>
        </View>

        {/* E-Modules Section */}
        <Text style={styles.sectionTitle}>Available E-Modules</Text>
        <TouchableOpacity style={styles.moduleCard} onPress={handleNavigateToCourses}>
          <View style={styles.moduleCardContent}>
            <Ionicons name="book" size={24} color={Colors.primary} />
            <View style={styles.moduleCardText}>
              <Text style={styles.moduleTitle}>Explore E-Modules</Text>
              <Text style={styles.moduleSubtitle}>Learn with interactive courses</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </CommonLayout>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  date: {
    marginTop: 20,
    marginLeft: 16,
    color: Colors.text.secondary
  },
  welcome: {
    fontSize: 28,
    marginLeft: 16,
    marginTop: 4,
    color: Colors.text.primary
  },
  name: {
    color: Colors.primary,
    fontWeight: "bold"
  },
  subtitle: {
    marginLeft: 16,
    marginBottom: 12,
    color: Colors.text.secondary
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16
  },
  statCard: {
    alignItems: "center",
    backgroundColor: Colors.background.secondary,
    padding: 12,
    borderRadius: 10,
    width: 100,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.text.primary
  },

  sectionTitle: {
    marginLeft: 16,
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary
  },
  card: {
    backgroundColor: Colors.white,
    margin: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primary
  },
  cardValue: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  downloadButton: {
    alignSelf: 'flex-start',
    padding: 4,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  bottomBtn: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    width: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background.primary,
  },
  bottomBtnText: {
    marginLeft: 6,
    color: Colors.primary,
    fontWeight: "bold"
  },

  moduleCard: {
    backgroundColor: Colors.white,
    margin: 12,
    borderRadius: 10,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleCardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  moduleCardText: {
    flex: 1,
    marginLeft: 12,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.white,
  },
  navText: {
    fontSize: 12,
    textAlign: "center",
    color: Colors.text.secondary
  },
});
