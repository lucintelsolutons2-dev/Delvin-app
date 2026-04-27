import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GuideProvider } from './context/GuideContext';
import SplashScreen from './screens/SplashScreen';
import SpotsListScreen from './screens/SpotsListScreen';
import SpotDetailScreen from './screens/SpotDetailScreen';
import MyGuideScreen from './screens/MyGuideScreen';
import AddSpotScreen from './screens/AddSpotScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GuideProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="SpotsList" component={SpotsListScreen} />
            <Stack.Screen name="SpotDetail" component={SpotDetailScreen} />
            <Stack.Screen name="MyGuide" component={MyGuideScreen} />
            <Stack.Screen name="AddSpot" component={AddSpotScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GuideProvider>
    </SafeAreaProvider>
  );
}
