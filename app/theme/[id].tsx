import { API_ENDPOINTS } from '@/constants/API';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonLayout from '../components/CommonLayout';

const { width } = Dimensions.get('window');

interface Media {
  id: number;
  url: string;
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pivot: {
    theme_id: number;
    media_id: number;
  };
}

interface ThemeDetail {
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
  medias: Media[];
}

interface ApiResponse {
  success: boolean;
  data: {
    theme: ThemeDetail;
    theme_medias: Media[];
  };
  message: string;
}

export default function ThemeDetail() {
  const { id, name } = useLocalSearchParams();
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeDetail | null>(null);
  const [medias, setMedias] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchThemeDetail();
    }
  }, [id]);

  const fetchThemeDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.THEMES.DETAIL(id as string), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log('data', data);

      // Handle the correct response structure
      if (data.success && data.data && data.data.theme) {
        setTheme(data.data.theme);
        setMedias(data.data.theme_medias || data.data.theme.medias || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching theme details:', error);
      setError('Failed to load theme details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  const handleOpenPDF = async () => {
    if (theme?.url) {
      try {
        await WebBrowser.openBrowserAsync(theme.url);
      } catch (error) {
        console.error('Error opening PDF:', error);
      }
    }
  };

  const handleOpenImage = async () => {
    if (theme?.image_path) {
      try {
        await WebBrowser.openBrowserAsync(theme.image_path);
      } catch (error) {
        console.error('Error opening image:', error);
      }
    }
  };

  const handlePlayVideo = async (videoUrl: string, videoName: string) => {
    try {
      await WebBrowser.openBrowserAsync(videoUrl);
    } catch (error) {
      console.error('Error opening video:', error);
    }
  };

  const renderMediaCard = (media: Media, index: number) => (
    <TouchableOpacity 
      key={media.id} 
      style={styles.mediaCard}
      onPress={() => handlePlayVideo(media.url, media.name)}
      activeOpacity={0.7}
    >
      <View style={styles.mediaIconContainer}>
        <Ionicons name="play-circle" size={40} color={Colors.primary} />
      </View>
      <View style={styles.mediaContent}>
        <Text style={styles.mediaTitle} numberOfLines={2}>
          {media.name}
        </Text>
        <Text style={styles.mediaDate}>
          Added: {new Date(media.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <CommonLayout title={name as string || 'Theme Details'} showBackButton onBackPress={() => router.back()}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading theme details...</Text>
        </View>
      </CommonLayout>
    );
  }

  if (error || !theme) {
    return (
      <CommonLayout title={name as string || 'Theme Details'} showBackButton onBackPress={() => router.back()}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={64} color="#E74C3C" />
          <Text style={styles.errorTitle}>Unable to load theme</Text>
          <Text style={styles.errorMessage}>{error || 'Theme not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchThemeDetail}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout title="Theme Details" showBackButton onBackPress={() => router.back()}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: theme.status === 1 ? '#2ECC71' : '#E74C3C' }
            ]}>
              <Text style={styles.statusText}>
                {theme.status === 1 ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>
          <Text style={styles.themeTitle}>{theme.name}</Text>
        </View>

        {/* Image Section */}
        {theme.image_path && (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleOpenImage}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: theme.image_path }}
              style={styles.themeImage}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Ionicons name="expand-outline" size={24} color="#FFFFFF" />
              <Text style={styles.imageOverlayText}>Tap to view full image</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {stripHtml(theme.description)}
          </Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="calendar-outline" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Created</Text>
            <Text style={styles.infoValue}>
              {new Date(theme.created_at).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="play-outline" size={24} color={Colors.primary} />
            <Text style={styles.infoLabel}>Videos</Text>
            <Text style={styles.infoValue}>
              {medias.length} Activities
            </Text>
          </View>
        </View>

        {/* Media/Videos Section */}
        {medias.length > 0 && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>Video Activities</Text>
            <Text style={styles.sectionSubtitle}>
              Watch these educational videos to learn more about this theme
            </Text>
            
            <View style={styles.mediaList}>
              {medias.map((media, index) => renderMediaCard(media, index))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {theme.url && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleOpenPDF}
            >
              <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>View PDF Document</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back-outline" size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Back to Themes</Text>
          </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
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
  themeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D0D26',
    lineHeight: 32,
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  themeImage: {
    width: '100%',
    height: 200,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  mediaSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mediaList: {
    gap: 12,
  },
  mediaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  mediaIconContainer: {
    marginRight: 16,
  },
  mediaContent: {
    flex: 1,
    marginRight: 12,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D0D26',
    marginBottom: 4,
  },
  mediaDate: {
    fontSize: 12,
    color: '#666',
  },
  infoGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 16,
  },
  infoCard: {
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
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D0D26',
    textAlign: 'center',
  },
  actionSection: {
    marginHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    gap: 8,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 40,
  },
});