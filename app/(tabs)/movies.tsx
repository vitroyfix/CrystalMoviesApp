import { View, Text, StyleSheet } from 'react-native';

export default function TabScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Crystal Movies Content Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});