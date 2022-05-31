import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import SplashScreen from "./src/screens/SplashScreen";

const navigator = createStackNavigator(
  {
    Home: HomeScreen,
    Splash: SplashScreen,
  },
  {
    initialRouteName: "Splash",
    defaultNavigationOptions: {
      title: "App",
    },
  }
);

export default createAppContainer(navigator);
