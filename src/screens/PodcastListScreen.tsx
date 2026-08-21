import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { signOut } from '../services/firebase/authService';

export default function PodcastListScreen({ navigation }: any) {
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      // RootNavigator watches auth state and will automatically switch
      // back to the Sign In screen once this resolves.
    } catch (e: any) {
      Alert.alert('Sign out failed', e?.message || 'Please try again.');
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cue</Text>
      <Text>No podcasts yet.</Text>
      <Button title="+ Add Podcast" onPress={() => navigation.navigate('Add')} />

      <View style={styles.signOutWrap}>
        {signingOut ? (
          <ActivityIndicator />
        ) : (
          <Button title="Sign Out" color="#c0392b" onPress={handleSignOut} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  signOutWrap: { marginTop: 32 },
});
