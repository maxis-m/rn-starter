import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from  '@react-navigation/native';
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import HomeScreen from "./src/screens/HomeScreen";
import SplashScreen from "./src/screens/SplashScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import AccountScreen from './src/screens/AccountScreen';
import LandingScreen from './src/screens/LandingScreen';
import TestScreen from "./src/screens/TestScreen";
import { DrawerScreen } from './src/screens/DrawerScreen';

import MainTabScreen from "./src/screens/MainTabScreen";
import { Provider } from './src/context/AuthContext';
import { setNavigator } from './src/navigationRef';

const Drawer = createDrawerNavigator();
function drawerScreen(){
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <DrawerScreen {...props} /> } screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Account" component={AccountScreen} />
        <Drawer.Screen name="Landing" component={LandingScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    Splash: SplashScreen,
    SignUp: SignUpScreen,
    SignIn: SignInScreen,
  }),
  mainFlow: createStackNavigator({
    Drawer: drawerScreen
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <Provider>
      <App
        ref={(navigator) => {
          setNavigator(navigator);
        }}
      />
    </Provider>
  );
};
