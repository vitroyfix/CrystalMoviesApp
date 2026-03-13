import React from 'react';
import { 
  StyleSheet, Text, View, FlatList, 
  TouchableOpacity, ImageBackground, ActivityIndicator, Dimensions 
} from 'react-native';
// Remember: 2 levels up to reach the hooks folder
import { useTVData } from '../../hooks/useMovies'; 

const { width } = Dimensions.get('window');

export default function TVScreen() {
  const { sections, loading } = useTVData();

  const renderTVCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <ImageBackground 
        source={{ uri: item.uri }} 
        style={styles.poster} 
        imageStyle={{ borderRadius: 8 }} 
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TV Shows</Text>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              horizontal
              data={item.data}
              renderItem={renderTVCard}
              keyExtractor={(m) => m.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        // Ensures the last row isn't cut off by the TabBar
        ListFooterComponent={<View style={{ height: 100 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000', 
    paddingTop: 60 
  },
  loaderContainer: { 
    flex: 1, 
    backgroundColor: '#000', 
    justifyContent: 'center' 
  },
  header: { 
    paddingHorizontal: 20, 
    marginBottom: 15 
  },
  headerTitle: { 
    color: '#fff', 
    fontSize: 32, 
    fontWeight: 'bold' 
  },
  section: { 
    marginBottom: 25, 
    paddingLeft: 15 
  },
  sectionTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 10, 
    opacity: 0.9 
  },
  card: { 
    marginRight: 12 
  },
  poster: { 
    width: 115, 
    height: 170 
  },
});