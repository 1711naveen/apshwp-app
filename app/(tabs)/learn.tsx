import { API_ENDPOINTS } from '@/constants/API';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CommonLayout from '../components/CommonLayout';

const { width } = Dimensions.get('window');

interface Theme {
  id: number;
  name: string;
  description: string;
  url: string;
  image_path: string;
  status: number;
  created_by: number | null;
  updated_by: number;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Sample API response data
const sampleThemes: Theme[] = [
  {
    "id": 1,
    "name": "Theme 1 - Growing up Healthy",
    "description": "<p>For healthy transition to adulthood, children need to Understand and manage changes within themselves as well as changing expectations from the outside world.</p>",
    "url": "http://127.0.0.1:8000/storage/media/09528907685e42d484174021d73709d0.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/1b414c5ec25aa59122cdbb38258716a9.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-27 01:06:21",
    "updated_at": "2022-04-29 03:37:57",
    "deleted_at": null
  },
  {
    "id": 2,
    "name": "Theme 2 - Emotional Well-being\r\nand Mental Health",
    "description": "<p>Develop awareness about mental health skills. Develop emotional well-being in self, and fostering and supporting one another in developing positive attitudes and accessing help when required.</p>",
    "url": "http://127.0.0.1:8000/storage/media/2abf61a6fc59fc37f71cc14d3cdf6380.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/764f25bc0e5a758e554a9d509cfa0f8f.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-27 02:34:28",
    "updated_at": "2022-04-29 03:38:40",
    "deleted_at": null
  },
  {
    "id": 3,
    "name": "Theme 3 - Interpersonal Relationships",
    "description": "<p>A strong, deep or close association between two or more people that may be for a short or long duration is referred to as an interpersonal relationship.</p>",
    "url": "http://127.0.0.1:8000/storage/media/ffe4ce333fb6dad4bcb4f582c8d042b2.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/758338bc4eae3b29320faed330bb8c2b.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-27 05:30:32",
    "updated_at": "2022-04-29 03:39:30",
    "deleted_at": null
  },
  {
    "id": 4,
    "name": "Theme 4 - Values and Responsible\r\nCitizenship",
    "description": "<p>Values are inner standards that provides the motivation to act, signifying what is important and worthwhile. Values also serve as a basis for moral codes and ethical reflection.</p>",
    "url": "http://127.0.0.1:8000/storage/media/8a2b0e51c5ee5ad400c9354ebae51631.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/f2b5f17a00541e4414ebb69a78edb6f4.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-28 03:12:21",
    "updated_at": "2022-04-29 03:40:09",
    "deleted_at": null
  },
  {
    "id": 5,
    "name": "Theme 5 - Gender Equality",
    "description": "<p>To develop knowledge and skills to counter gender based stereotypes, discrimination and violence, practice positive gender roles, and promote gender equity and rights in all situations.</p>",
    "url": "http://127.0.0.1:8000/storage/media/c61650e831b159ccb348ba185b03e80e.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/73d1972fedd2ea686660e271a9e21d9e.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-28 03:13:36",
    "updated_at": "2022-04-29 03:40:44",
    "deleted_at": null
  },
  {
    "id": 6,
    "name": "Theme 6 - Nutrition Health and Sanitation",
    "description": "<p>Help in developing positive attitude and enhancing knowledge to demonstrate healthy nutritional and hygienic practice. Introduce the nutritional needs of adolescents.</p>",
    "url": "http://127.0.0.1:8000/storage/media/71c8b65f12b3b9331b5a72b7123d8f8c.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/c9647ef553af31eaec7be9263e70189a.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-28 03:14:52",
    "updated_at": "2022-04-29 03:41:55",
    "deleted_at": null
  },
  {
    "id": 7,
    "name": "Theme 7 - Prevention and Management of\r\nSubstance abuse",
    "description": "<p>Develops understanding and prevention of habit for addiction; Creating awareness on adverse consequences of commonly misused substances; Developing skills to negotiate pressure from peers, family and popular culture to resist substance misuse and give up on harmful practices.</p>",
    "url": "http://127.0.0.1:8000/storage/media/3e943559f2303b3770695a3017377eba.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/392ff435359782369ff2a44929922725.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-28 03:17:04",
    "updated_at": "2022-04-29 03:42:24",
    "deleted_at": null
  },
  {
    "id": 8,
    "name": "Theme 8 - Promoting Healthy Lifestyle",
    "description": "<p>Help create awareness in the learner on how lifestyle choices contribute towards long term health and well-being.</p>",
    "url": "http://127.0.0.1:8000/storage/media/4bbf556a5f2776ac0ee672d8bb52918b.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/b8143acc9ea4a652021cc125bbc63f71.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-28 03:18:36",
    "updated_at": "2022-04-29 03:42:56",
    "deleted_at": null
  },
  {
    "id": 9,
    "name": "Theme 9 - Reproductive Health and HIV prevention",
    "description": "<p>This module emphasizes developing awareness on symptoms and ways to prevent Reproductive Tract Infections (RTIs) and ways to maintain personal hygiene. The module also builds knowledge on HIV and AIDS, transmission modes, symptoms, prevention, and its management.</p>",
    "url": "http://127.0.0.1:8000/storage/media/cf066af38c42653b83abba107a4bfeaf.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/bdb53897b1f75593f343c0061098885e.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 1,
    "deleted_by": null,
    "created_at": "2021-09-28 03:19:50",
    "updated_at": "2022-09-28 05:02:45",
    "deleted_at": null
  },
  {
    "id": 10,
    "name": "Theme 10 - Injuries and Violence",
    "description": "<p>Help each learner to develop the knowledge and skills to keep oneself safe from violence and injuries, as well as promote safe environment, for all. Develop basic understanding of violence, abuse, and unsafe situations, and effective ways to respond and seek help to keep self and others safe, including the role of assertive communication.</p>",
    "url": "http://127.0.0.1:8000/storage/media/43e78eacf3d23dbeffac5cd6f767f144.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/6013b87a0979e677d4e2acc241df552b.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 64,
    "deleted_by": null,
    "created_at": "2021-09-28 03:20:53",
    "updated_at": "2022-04-29 03:43:24",
    "deleted_at": null
  },
  {
    "id": 11,
    "name": "Theme 11 Promotion of safe use of Internet",
    "description": "<p>To develop the knowledge and skills to use media and internet effectively and safely; To analyze critically the various media platforms and the messages they propagate;</p>",
    "url": "http://127.0.0.1:8000/storage/media/6d61126532767c4342c36e5bbd7c4369.pdf",
    "image_path": "http://127.0.0.1:8000/storage/media/ee1fae7d5264febedccadcf4ed490cd6.jpg",
    "status": 1,
    "created_by": null,
    "updated_by": 990,
    "deleted_by": null,
    "created_at": "2021-09-28 03:21:57",
    "updated_at": "2024-06-12 01:09:47",
    "deleted_at": null
  }
];

export default function Learn() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.THEMES.LIST, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different possible response structures
      if (Array.isArray(data)) {
        setThemes(data);
      } else if (data.data && Array.isArray(data.data)) {
        setThemes(data.data);
      } else if (data.themes && Array.isArray(data.themes)) {
        setThemes(data.themes);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      setError('Failed to load themes. Please try again.');
      
      // Fallback to sample data for development
      setThemes(sampleThemes);
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = (index: number) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9F43', '#6C5CE7', '#A29BFE', '#FD79A8', '#00B894'];
    return colors[index % colors.length];
  };

  const getThemeIcon = (index: number) => {
    const icons = ['book-outline', 'heart-outline', 'people-outline', 'shield-outline', 'male-female-outline', 'nutrition-outline', 'warning-outline', 'fitness-outline', 'medical-outline', 'shield-checkmark-outline', 'globe-outline'];
    return icons[index % icons.length];
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handleThemePress = (theme: Theme) => {
    // Navigate to theme detail screen with theme ID
    console.log('theme id',theme.id.toString())
    router.push({
      pathname: '/theme/[id]' as any,
      params: { 
        id: theme.id.toString(),
        name: theme.name 
      }
    });
  };

  const renderThemeCard = (theme: Theme, index: number) => (
    <TouchableOpacity 
      key={theme.id} 
      style={styles.themeCard}
      onPress={() => handleThemePress(theme)}
      activeOpacity={0.7}
    >
      <View style={[styles.cardHeader, { backgroundColor: getThemeColor(index) }]}>
        <Ionicons
          name={getThemeIcon(index) as any}
          size={32}
          color="#FFFFFF"
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.themeTitle}>{theme.name}</Text>
        <Text style={styles.themeDescription} numberOfLines={3}>
          {stripHtml(theme.description)}
        </Text>

        <View style={styles.cardStats}>
          <View style={styles.statItem}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.statText}>Created: {new Date(theme.created_at).getFullYear()}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={Colors.primary} />
            <Text style={styles.statText}>Status: {theme.status === 1 ? 'Active' : 'Inactive'}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.statusBadge, { backgroundColor: theme.status === 1 ? '#2ECC71' : '#E74C3C' }]}>
            <Text style={styles.statusText}>{theme.status === 1 ? 'Available' : 'Unavailable'}</Text>
          </View>
          <View style={styles.exploreButton}>
            <Text style={styles.exploreButtonText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <CommonLayout title="Learn">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading themes...</Text>
        </View>
      </CommonLayout>
    );
  }

  if (error && themes.length === 0) {
    return (
      <CommonLayout title="Learn">
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={64} color="#E74C3C" />
          <Text style={styles.errorTitle}>Unable to load themes</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={fetchThemes}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout title="Learn">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Learning Themes</Text>
          <Text style={styles.subtitle}>
            Explore comprehensive learning paths designed for healthcare professionals
          </Text>
        </View>

        <View style={styles.statsOverview}>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>{themes.length}</Text>
            <Text style={styles.overviewLabel}>Available Themes</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.overviewNumber}>
              {themes.filter(theme => theme.status === 1).length}
            </Text>
            <Text style={styles.overviewLabel}>Active Themes</Text>
          </View>
        </View>

        <View style={styles.themesGrid}>
          {themes.map((theme, index) => renderThemeCard(theme, index))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  statsOverview: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  themesGrid: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  themeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardContent: {
    padding: 20,
  },
  themeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 8,
  },
  themeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardStats: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  exploreButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 20,
  },
});