import React from 'react';
import { 
  StyleSheet, Text, View, ImageBackground, ScrollView, 
  TouchableOpacity, Dimensions, FlatList 
} from 'react-native';
import { BlurView } from 'expo-blur'; 
import { Play, Plus, Search, User, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// 1. SELECTIVE CATEGORIES TO DISPLAY AS ROWS
const SELECTED_GENRES = [
  { id: 'gen1', title: 'Action'},
  { id: 'gen2', title: 'Horror' },
  { id: 'gen3', title: 'Sci-Fi' }
];

// Mock Data for posters (We will replace this with your actual scraping/TMDB data)
const MOCK_MOVIES = [
  { id: '1', uri: 'https://image.tmdb.org/t/p/w500/reEMDx9pY3icQ9YvjNpS9vT4B4u.jpg' },
  { id: '2', uri: 'https://image.tmdb.org/t/p/w500/279y996mb75vLy60ishq366Ynuh.jpg' },
  { id: '3', uri: 'https://image.tmdb.org/t/p/w500/u3b99Hc9Mgi7pjaZ14PsySLcUMw.jpg' },
  { id: '4', uri: 'https://image.tmdb.org/t/p/w500/8GxvA9zDZ96lbJA7nG1oQ0Yp6cy.jpg' },
];

export default function HomeScreen() {
  
  const renderMovieCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <ImageBackground 
        source={{ uri: item.uri }} 
        style={styles.poster} 
        imageStyle={{ borderRadius: 4 }} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* GLASSMORPHIC NAVBAR */}
      <View style={styles.navBar}>
        <TouchableOpacity><Search color="#fff" size={26} strokeWidth={2.5} /></TouchableOpacity>
        <TouchableOpacity>
          <BlurView intensity={40} tint="dark" style={styles.profileGlass}>
            <User color="#fff" size={22} />
          </BlurView>
        </TouchableOpacity>
      </View>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION */}
        <ImageBackground 
          source={{ uri: 'https://image.tmdb.org/t/p/original/t56oO949q79S99v9696gnMBMG9y.jpg' }} 
          style={styles.heroImage}
        >
          <View style={styles.heroGradient}>
            <Text style={styles.heroTitle}>MONEY HEIST</Text>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.actionBtn}><Plus color="#fff" size={28} /><Text style={styles.actionText}>My List</Text></TouchableOpacity>
              <TouchableOpacity style={styles.playBtn}><Play fill="black" color="black" size={22} /><Text style={styles.playLabel}>Play</Text></TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}><Info color="#fff" size={28} /><Text style={styles.actionText}>Info</Text></TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* --- MAIN CONTENT ROWS --- */}

        {/* 1. MANDATORY TRENDING ROW */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <FlatList 
            horizontal
            data={MOCK_MOVIES}
            renderItem={renderMovieCard}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* 2. DYNAMIC SELECTED CATEGORY ROWS */}
        {SELECTED_GENRES.map((genre) => (
          <View key={genre.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{genre.title}</Text>
            <FlatList 
              horizontal
              data={[...MOCK_MOVIES].reverse()} // Reverse just to look different for now
              renderItem={renderMovieCard}
              keyExtractor={item => `${genre.id}-${item.id}`}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  navBar: { position: 'absolute', top: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, zIndex: 10 },
  profileGlass: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  heroImage: { width: width, height: 550, justifyContent: 'flex-end' },
  heroGradient: { backgroundColor: 'rgba(0,0,0,0.3)', paddingBottom: 30, alignItems: 'center' },
  heroNavPills: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  pillText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  heroTitle: { color: '#fff', fontSize: 48, fontWeight: 'bold', letterSpacing: -1, marginBottom: 20, textAlign: 'center' },
  heroActions: { flexDirection: 'row', alignItems: 'center', width: '90%', justifyContent: 'space-around' },
  playBtn: { backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: 35, paddingVertical: 10, borderRadius: 4, alignItems: 'center' },
  playLabel: { color: '#000', fontWeight: 'bold', fontSize: 18, marginLeft: 8 },
  actionBtn: { alignItems: 'center' },
  actionText: { color: '#fff', fontSize: 12, marginTop: 4 },
  
  // ROW STYLES
  section: { marginTop: 25, paddingLeft: 15 },
  sectionTitle: { color: '#fff', fontSize: 19, fontWeight: 'bold', marginBottom: 12 },
  card: { marginRight: 12 },
  poster: { width: 130, height: 190 },
});