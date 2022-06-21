
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Dimensions, Button, Image } from 'react-native';
import { Context as AuthContext } from '../context/AuthContext';
import React, {useContext, useEffect, useState} from 'react';

const AccountScreen = () => {
  const { state, signout, generateKeys } = useContext(AuthContext);
/** 
  useEffect(() => {
    setTimeout(() => setLoading(false), 6000)
  }, [])
  */


  return <View style={styles.container}>
        <Text>Account Screen</Text>
        <Button title='logout' onPress={signout}/>
</View>
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
});

export default AccountScreen;
