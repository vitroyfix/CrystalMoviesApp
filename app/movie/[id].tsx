import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, ImageBackground, ScrollView, 
  TouchableOpacity, ActivityIndicator, Dimensions, Linking 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, Play, Plus, Send, ChevronRight } from 'lucide-react-native';
import { fetchMovieDetails } from '../../hooks/useMovies';

const { width } = Dimensions.get('window');

export default function MovieDetails() {
  const { id, type } = useLocalSearchParams(); 
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMovieDetails(id as string, (type as string) || "movie");
      setMovie(data);
      // Set default tab to Episodes if it's a TV show, otherwise Overview
      if (type === 'tv') setActiveTab('Episodes');
      setLoading(false);
    };
    loadData();
  }, [id, type]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator color="#E50914" size="large" /></View>
  );

  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <ImageBackground 
          source={{ uri: movie?.backdrop }} 
          style={styles.posterImage}
          resizeMode="cover"
        >
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <ChevronLeft color="#fff" size={28} />
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{movie?.title}</Text>
        
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{movie?.badgeYear}</Text>
          <View style={styles.hdBadge}><Text style={styles.hdText}>HD</Text></View>
          {type !== 'tv' && <Text style={styles.metaText}>{movie?.runtime}</Text>}
          <View style={styles.ratingBox}>
            <Star color="#E50914" fill="#E50914" size={14} />
            <Text style={styles.ratingText}>{movie?.rating}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.watchBtn}
          onPress={() => movie?.streams?.[0] && Linking.openURL(movie.streams[0].url)}
        >
          <Play fill="black" size={20} color="black" />
          <Text style={styles.watchText}>Watch Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listBtn}>
          <Plus color="#fff" size={22} />
          <Text style={styles.listText}>My List</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.trailerLink} 
          onPress={() => Linking.openURL(`https://www.youtube.com/results?search_query=${movie?.title}+trailer`)}
        >
          <Send color="#a3a3a3" size={16} style={styles.telegramIcon} />
          <Text style={styles.trailerLinkText}>Watch Trailer</Text>
        </TouchableOpacity>

        {/* --- DYNAMIC TABS --- */}
        <View style={styles.tabContainer}>
          {/* Only show Episodes tab if type is 'tv' */}
          {type === 'tv' && (
            <TouchableOpacity onPress={() => setActiveTab('Episodes')} style={[styles.tab, activeTab === 'Episodes' && styles.activeTab]}>
              <Text style={[styles.tabLabel, activeTab === 'Episodes' && styles.activeTabLabel]}>Episodes</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => setActiveTab('Overview')} style={[styles.tab, activeTab === 'Overview' && styles.activeTab]}>
            <Text style={[styles.tabLabel, activeTab === 'Overview' && styles.activeTabLabel]}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Related')} style={[styles.tab, activeTab === 'Related' && styles.activeTab]}>
            <Text style={[styles.tabLabel, activeTab === 'Related' && styles.activeTabLabel]}>Related</Text>
          </TouchableOpacity>
        </View>

        {/* --- EPISODES CONTENT --- */}
        {activeTab === 'Episodes' && movie?.seasons && (
          <View style={styles.episodesList}>
            {movie.seasons.map((season: any, index: number) => (
              <TouchableOpacity key={index} style={styles.episodeItem}>
                <View style={styles.episodeNumberContainer}>
                  <Text style={styles.episodeNumber}>{index + 1}</Text>
                </View>
                <View style={styles.episodeInfo}>
                  <Text style={styles.episodeTitle}>{season.name || `Season ${season.season_number}`}</Text>
                  <Text style={styles.episodeSubText}>{season.episode_count} Episodes</Text>
                </View>
                <Play color="#444" size={18} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* --- OVERVIEW CONTENT --- */}
        {activeTab === 'Overview' && (
          <View>
            <Text style={styles.plotText}>{movie?.plot}</Text>
            <View style={styles.metaDetails}>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Cast:</Text><Text style={styles.detailValue}>{movie?.cast}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Director:</Text><Text style={styles.detailValue}>{movie?.director}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Genre:</Text><Text style={styles.detailValue}>{movie?.genre}</Text></View>
            </View>
          </View>
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  centered: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: width, height: 400 },
  posterImage: { width: '100%', height: '100%' },
  backBtn: { marginTop: 50, marginLeft: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  contentContainer: { paddingHorizontal: 20, marginTop: 15 }, 
  title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  metaText: { color: '#a3a3a3', fontSize: 14, fontWeight: '600' },
  hdBadge: { borderWidth: 1, borderColor: '#a3a3a3', paddingHorizontal: 4, borderRadius: 2 },
  hdText: { color: '#a3a3a3', fontSize: 10, fontWeight: 'bold' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: '#E50914', fontWeight: 'bold' },
  watchBtn: { backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 4, marginBottom: 12 },
  watchText: { color: '#000', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  listBtn: { backgroundColor: '#262626', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 4, marginBottom: 15 },
  listText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  trailerLink: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 20, marginLeft: 5 },
  telegramIcon: { transform: [{ rotate: '-20deg' }], marginRight: 8 },
  trailerLinkText: { color: '#a3a3a3', fontSize: 13, fontWeight: '500' },
  tabContainer: { flexDirection: 'row', gap: 30, borderBottomWidth: 1, borderBottomColor: '#222', marginBottom: 20 },
  tab: { paddingBottom: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#E50914' },
  tabLabel: { color: '#a3a3a3', fontSize: 16, fontWeight: 'bold' },
  activeTabLabel: { color: '#fff' },
  plotText: { color: '#fff', fontSize: 15, lineHeight: 22, marginBottom: 25, textAlign: 'justify' },
  metaDetails: { gap: 12 },
  detailRow: { flexDirection: 'row' },
  detailLabel: { color: '#fff', fontWeight: 'bold', width: 80, fontSize: 14 },
  detailValue: { color: '#a3a3a3', flex: 1, fontSize: 14, lineHeight: 20 },
  
  // EPISODE STYLES
  episodesList: { marginTop: 5 },
  episodeItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#111' },
  episodeNumberContainer: { width: 40 },
  episodeNumber: { color: '#666', fontSize: 18, fontWeight: 'bold' },
  episodeInfo: { flex: 1 },
  episodeTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 2 },
  episodeSubText: { color: '#666', fontSize: 12 }
});