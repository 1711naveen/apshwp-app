import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

const modules = [
  {
    id: "1",
    title: "Metabolic Health (NCDs Prevention)",
    image: require("../../assets/images/app-images/illustration_1.png"),
  },
  {
    id: "2",
    title: "Road Safety",
    image: require("../../assets/images/app-images/illustration_2.png"),
  },
  {
    id: "3",
    title: "Heart Health Awareness",
    image: require("../../assets/images/app-images/illustration_3.png"),
  },
];

function Home() {
  const [name, setName] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userInfo');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserInfo(user);
          // Try different possible name fields from the JWT token
          const userName = user.name || user.username || user.full_name || user.firstName || 'User';
          setName(userName);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
        setName('User');
      }
    };
    loadUser();
  }, []);

  const router = useRouter();

  const openResourcesLink = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://apshwp.ap.gov.in/en#resourceSection');
      setMenuVisible(false);
    } catch (error) {
      console.error('Error opening browser:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');
      setMenuVisible(false);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.hamburgerButton}
          onPress={() => setMenuVisible(true)}
        >
          <Ionicons name="menu-outline" size={28} color="#0D0D26" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Hi, {name || 'User'}!</Text>
          <Text style={styles.subGreeting}>Let's start learning</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Image
            source={require("../../assets/images/app-images/Avatar.png")}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Flowchart Box */}
      <View >
        <Image
          source={require("../../assets/images/app-images/flowchart.png")}
          style={styles.flowchartImage}
          resizeMode="contain"
        />
      </View>

      {/* E-Module Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>E-Module</Text>
        <TouchableOpacity onPress={() => router.push('/course')}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moduleScroll}
      >
        <TouchableOpacity
          onPress={() => console.log("Pressed: Metabolic Health (NCDs Prevention)")}
          style={styles.imageWrapper}
        >
          <Image
            source={require("../../assets/images/app-images/illustration_1.png")}
            style={styles.moduleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log("Pressed: Road Safety")}
          style={styles.imageWrapper}
        >
          <Image
            source={require("../../assets/images/app-images/illustration_1.png")}
            style={styles.moduleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => console.log("Pressed: Heart Health Awareness")}
          style={styles.imageWrapper}
        >
          <Image
            source={require("../../assets/images/app-images/illustration_1.png")}
            style={styles.moduleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.menuContainer}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <Image
                source={require("../../assets/images/app-images/Avatar.png")}
                style={styles.menuAvatar}
              />
              <Text style={styles.menuUserName}>{name || 'User'}</Text>
              <Text style={styles.menuUserEmail}>
                {userInfo?.email || userInfo?.login || 'user@example.com'}
              </Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={openResourcesLink}
              >
                <Ionicons name="library-outline" size={24} color="#3D5CFF" />
                <Text style={styles.menuItemText}>Resources</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#A0A0B2" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/course');
                }}
              >
                <Ionicons name="book-outline" size={24} color="#3D5CFF" />
                <Text style={styles.menuItemText}>Courses</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#A0A0B2" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/quiz');
                }}
              >
                <Ionicons name="help-circle-outline" size={24} color="#3D5CFF" />
                <Text style={styles.menuItemText}>Quiz</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#A0A0B2" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  router.push('/account');
                }}
              >
                <Ionicons name="person-outline" size={24} color="#3D5CFF" />
                <Text style={styles.menuItemText}>Profile</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#A0A0B2" />
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity 
                style={styles.menuItem}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
                <Text style={[styles.menuItemText, { color: '#FF6B6B' }]}>Logout</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#A0A0B2" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F5",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hamburgerButton: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    marginLeft: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D0D26",
  },
  subGreeting: {
    fontSize: 14,
    color: "#A0A0B2",
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
  },
  flowchartBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  flowchartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  flowchartImage: {
    width: "100%",
    height: 180,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D0D26",
  },
  viewAll: {
    color: "#3D5CFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  moduleScroll: {
    paddingBottom: 20,
  },
  imageWrapper: {
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  moduleImage: {
    width: 200,
    height: 120,
    borderRadius: 12,
  },
  // Hamburger Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    width: width * 0.8,
    height: '100%',
    paddingTop: 50,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 20,
  },
  menuAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  menuUserName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 4,
  },
  menuUserEmail: {
    fontSize: 14,
    color: '#A0A0B2',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    color: '#0D0D26',
    marginLeft: 16,
    flex: 1,
    fontWeight: '500',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 16,
  },
});

export default Home;

