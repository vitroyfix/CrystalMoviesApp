import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, ImageBackground, ScrollView, 
  TouchableOpacity, Dimensions, FlatList, ActivityIndicator 
} from 'react-native';
import { BlurView } from 'expo-blur'; 
import { Play, Plus, Search, User, Info } from 'lucide-react-native';
import { useHomeData } from '../../hooks/useMovies';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { trending, action, loading } = useHomeData();
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  // 1. THE AUTOMATIC TRANSITION ENGINE
  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        let nextIndex = activeHeroIndex + 1;
        if (nextIndex >= 5) nextIndex = 0; // Loop back after 5 movies

        setActiveHeroIndex(nextIndex);
        
        // This is the command that creates the physical movement
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 4000); // 4 seconds so you can see it happening

      return () => clearInterval(interval);
    }
  }, [trending, activeHeroIndex]);

  const renderMovieCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <ImageBackground source={{ uri: item.uri }} style={styles.poster} imageStyle={{ borderRadius: 4 }} />
    </TouchableOpacity>
  );

  // 2. HERO PAGE RENDER
  const renderHeroItem = ({ item }: { item: any }) => (
    <ImageBackground source={{ uri: item?.uri }} style={styles.heroImage}>
      <View style={styles.heroActionsContainer}>
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.actionBtn}><Plus color="#fff" size={28} /><Text style={styles.actionText}>My List</Text></TouchableOpacity>
          <TouchableOpacity style={styles.playBtn}><Play fill="black" color="black" size={22} /><Text style={styles.playLabel}>Play</Text></TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}><Info color="#fff" size={28} /><Text style={styles.actionText}>Info</Text></TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity><Search color="#fff" size={26} strokeWidth={2.5} /></TouchableOpacity>
        <TouchableOpacity>
          <BlurView intensity={40} tint="dark" style={styles.profileGlass}><User color="#fff" size={22} /></BlurView>
        </TouchableOpacity>
      </View>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* 3. THE NATIVE SLIDER */}
        <FlatList
          ref={flatListRef}
          data={trending.slice(0, 5)}
          renderItem={renderHeroItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `hero-${item.id}`}
          // CRUCIAL: This tells the list exactly how wide each "page" is
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          // Handles manual swipes
          onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveHeroIndex(newIndex);
          }}
        />

        {/* ROWS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <FlatList horizontal data={trending} renderItem={renderMovieCard} keyExtractor={item => item.id} showsHorizontalScrollIndicator={false} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Action Hits</Text>
          <FlatList horizontal data={action} renderItem={renderMovieCard} keyExtractor={item => item.id} showsHorizontalScrollIndicator={false} />
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  navBar: { position: 'absolute', top: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, zIndex: 10 },
  profileGlass: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  heroImage: { width: width, height: 600, justifyContent: 'flex-end' },
  heroActionsContainer: { paddingBottom: 30, width: '100%' },
  heroActions: { flexDirection: 'row', alignItems: 'center', width: '100%', justifyContent: 'space-evenly' },
  playBtn: { backgroundColor: '#fff', flexDirection: 'row', paddingHorizontal: 35, paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  playLabel: { color: '#000', fontWeight: 'bold', fontSize: 18, marginLeft: 8 },
  actionBtn: { alignItems: 'center' },
  actionText: { color: '#fff', fontSize: 12, marginTop: 4, fontWeight: '600' },
  section: { marginTop: 25, paddingLeft: 15 },
  sectionTitle: { color: '#fff', fontSize: 19, fontWeight: 'bold', marginBottom: 12 },
  card: { marginRight: 12 },
  poster: { width: 130, height: 190 },
});