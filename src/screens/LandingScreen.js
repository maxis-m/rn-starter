import { View, TouchableOpacity, Text, StyleSheet, TextInput, Dimensions, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';


const LandingScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState('Not yet scanned');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }


  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{height: 400, width: 400}}
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>
      {scanned && <Button title={'Scan Again'} onPress={() => setScanned(false)} color='tomato'/>}
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
    alignItems: 'center',
    justifyContent:'center',
  },
  barcodebox: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300, 
    width: 300,
    overflow: 'hidden',
    borderRadius: 30,
    backgroundColor: 'tomato'
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  }
});

export default LandingScreen;
