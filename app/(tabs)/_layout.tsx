// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Film, Tv, Search } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false, 
      tabBarActiveTintColor: '#E50914',
      tabBarInactiveTintColor: '#888',
      tabBarStyle: { 
        backgroundColor: '#000', 
        borderTopWidth: 0,
        height: 60,
        paddingBottom: 8
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="movies" // This will be app/(tabs)/movies.tsx
        options={{
          title: 'Movies',
          tabBarIcon: ({ color }) => <Film color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="tv" // This will be app/(tabs)/tv.tsx
        options={{
          title: 'TV Shows',
          tabBarIcon: ({ color }) => <Tv color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}