import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
//import HomeScreen from "./src/screens/HomeScreen";
import SplashScreen from "./src/screens/SplashScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import TestScreen from "./src/screens/TestScreen";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from  '@react-navigation/native';
import MainTabScreen from "./src/screens/MainTabScreen";

//tconst HomeStack = createStackNavigator();
//const SignInStack = createStackNavigator();
//const SignUpStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = () => {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={MainTabScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
}

const navigator = createStackNavigator(
  {
    //Home: HomeScreen,
    Splash: SplashScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    Test: TestScreen,
  },
  {
    initialRouteName: "Home",
    defaultNavigationOptions: {
      title: "App",
    },
  }
);

//export default createAppContainer(navigator);*/

export default App;

/*
<Drawer.Screen name="SignIn" component={SignInScreen} />
          <Drawer.Screen name="SignUp" component={SignUpScreen} />
          */