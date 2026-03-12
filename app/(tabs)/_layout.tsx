import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';
// Using Lucide icons to match your UI style
import { Home, Film, Tv, Menu } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E50914', // Crystal Red
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
        // This adds the "Glassmorphism" effect to the bottom bar
        tabBarBackground: () => (
          <BlurView 
            intensity={90} 
            tint="dark" 
            style={StyleSheet.absoluteFill} 
          />
        ),
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="movies"
        options={{
          title: 'Movies',
          tabBarIcon: ({ color }) => <Film color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="tv"
        options={{
          title: 'TV Shows',
          tabBarIcon: ({ color }) => <Tv color={color} size={24} />,
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Menu color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 88 : 65,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    backgroundColor: 'transparent', // Crucial for BlurView to work
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: -5,
  },
});