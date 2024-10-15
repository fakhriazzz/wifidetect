import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View
} from 'react-native';

import WifiManager from 'react-native-wifi-reborn';

const App = () => {
  const [ssid, setSsid] = useState("")
  const [bssid, setBssid] = useState("")
  const [granted, setgranted] = useState("")
  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      getWifiInfo()
      setRefreshing(false)
    }, 1000)
  }, [])

  const dataArray = [
    { id: 1, value: "04:F3:52:71:05:C8" },
    { id: 2, value: "04:F3:52:71:05:CC" },
    { id: 3, value: "02:17:D4:00:03:00" },
    { id: 4, value: "02:18:E5:00:04:00" },
    { id: 5, value: "02:19:F6:00:05:00" }
  ];

  const cekValid = () => {
    const searchValue = bssid;
    const isValuePresent = dataArray.some(item => item.value === searchValue);
    if (isValuePresent) {
      ToastAndroid.show(`Berhasil presensi dengan wifi : ${ssid}`, ToastAndroid.SHORT)
    } else {
      ToastAndroid.show('Presensi gagal, harap hubungkan ke wifi', ToastAndroid.SHORT)
    }
  }

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need access to your location to get WiFi information.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setgranted(granted)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getWifiInfo();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getWifiInfo();
    }
  };

  const getWifiInfo = async () => {
    try {
      const currentSsid = await WifiManager.getCurrentWifiSSID();
      setSsid(currentSsid);

      const currentBssid = await WifiManager.getBSSID();
      setBssid(currentBssid);

    } catch (error) {
      console.log('Error getting WiFi info:', error);
    }
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar backgroundColor='#FFFFFF' barStyle='dark-content' />
      <Text style={[styles.infoTitle, { marginBottom: 24, fontSize: 24 }]}>Presensi WiFi</Text>
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Permission Wifi</Text>
          <Text style={styles.infoValue}>{granted}</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: 'green', padding: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 8 }} onPress={cekValid}>
          <Text style={[styles.infoTitle, { color: 'white' }]}>Presensi</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.card, { marginTop: 12 }]}>
        <View style={styles.infoRow}>
          <Text style={styles.infoTitle}>Nama wifi (ssid) :</Text>
          <Text style={styles.infoValue}>{ssid}</Text>
        </View>
        <View style={[styles.infoRow, { marginBottom: 0 }]}>
          <Text style={styles.infoTitle}>bssid :</Text>
          <Text style={styles.infoValue}>{bssid}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Background color abu-abu
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  infoValue: {
    color: '#666',
  },
});

export default App;