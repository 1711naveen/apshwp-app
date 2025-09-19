import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface AppHeaderProps {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
}

export default function AppHeader({ title, showBackButton = false, onBackPress }: AppHeaderProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [name, setName] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('userInfo');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setUserInfo(user);
                const userName = user.name || user.username || user.full_name || user.firstName || 'User';
                setName(userName);
            }
        } catch (error) {
            console.error('Error loading user info:', error);
            setName('User');
        }
    };

    const openResourcesLink = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://apshwp.ap.gov.in/en#resourceSection');
            setMenuVisible(false);
        } catch (error) {
            console.error('Error opening browser:', error);
        }
    };

    const openNewsLink = async () => {
        try {
            await WebBrowser.openBrowserAsync('https://apshwp.ap.gov.in/en/category/2');
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

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            router.back();
        }
    };

    return (
        <>
            <View style={styles.header}>
                {showBackButton ? (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleBackPress}
                    >
                        <Ionicons name="arrow-back" size={24} color="#0D0D26" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Ionicons name="menu-outline" size={28} color="#0D0D26" />
                    </TouchableOpacity>
                )}

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>

                <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    <Image
                        source={require("../../assets/images/app-images/Avatar.png")}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
            </View>

            {/* Hamburger Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setMenuVisible(false)}
                    activeOpacity={1}
                >
                    <TouchableOpacity
                        style={styles.menuContainer}
                        activeOpacity={1}
                    >
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
                                <Ionicons name="library-outline" size={24} color={Colors.primary} />
                                <Text style={styles.menuItemText}>Resources</Text>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={openNewsLink}
                            >
                                <Ionicons name="newspaper-outline" size={24} color={Colors.primary} />
                                <Text style={styles.menuItemText}>News</Text>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    router.push('/learn');
                                }}
                            >
                                <Ionicons name="school-outline" size={24} color={Colors.primary} />
                                <Text style={styles.menuItemText}>Learn</Text>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    router.push('/course');
                                }}
                            >
                                <Ionicons name="book-outline" size={24} color={Colors.primary} />
                                <Text style={styles.menuItemText}>Courses</Text>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    router.push('/quiz');
                                }}
                            >
                                <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
                                <Text style={styles.menuItemText}>Quiz</Text>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    router.push('/account');
                                }}
                            >
                                <Ionicons name="person-outline" size={24} color={Colors.primary} />
                                <Text style={styles.menuItemText}>Profile</Text>
                                <Ionicons name="chevron-forward-outline" size={20} color={Colors.primary} />
                            </TouchableOpacity>

                            <View style={styles.menuDivider} />

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleLogout}
                            >
                                <Ionicons name="log-out-outline" size={24} color={Colors.primary} />
                                <Text style={[styles.menuItemText, { color: Colors.primary }]}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#F2F2F5",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
    },
    actionButton: {
        padding: 4,
    },
    headerCenter: {
        flex: 1,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0D0D26",
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#ddd",
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    menuContainer: {
        backgroundColor: '#fff',
        width: '100%',
        maxHeight: '75%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingHorizontal: 20,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
        marginBottom: 20,
    },
    menuAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 12,
    },
    menuUserName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D0D26',
        marginBottom: 4,
    },
    menuUserEmail: {
        fontSize: 14,
        color: '#A0A0B2',
    },
    menuItems: {
        paddingVertical: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 4,
        backgroundColor: '#F8F9FA',
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
        marginVertical: 12,
    },
});
