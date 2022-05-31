import React from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';

const HomeScreen = () => {
  return <View style={styles.viewStyle}>
    <Text>Sign in:</Text>
    <TextInput defaultValue='Username' onChangeText={()=>console.log('typed in stuff')}/>
    <TextInput defaultValue='Password' onChangeText={()=>console.log('typed in stuff')}/>
    <Button 
      title='Enter'
      onPress={() => console.log('tried to log in')}
    />
  </View>;
};

const {height} = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#009387'
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex:1,
      backgroundColor: '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingVertical: 50,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  title: {
      color: '#05375a',
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: 'grey',
      marginTop: 5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 150,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20,
      flexDirection: 'row'
  },
  textSign: {
      color: 'white',
      fontWeight: 'bold'
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backdrop: {
    flex:1,
    flexDirection: 'column'
  },
});

export default HomeScreen;
