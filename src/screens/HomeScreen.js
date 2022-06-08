import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from  '@react-navigation/native';
import SplashScreen from "./src/screens/SplashScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";


const HomeScreen = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Splash" component={SplashScreen} />
        <Drawer.Screen name="SignIn" component={SignInScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};




const styles = StyleSheet.create({
  
});

export default HomeScreen;
