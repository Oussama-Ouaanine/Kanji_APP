/**
 * Navigation principale
 */
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultsScreen from '../screens/ResultsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LibraryScreen from '../screens/LibraryScreen';
import { palette } from '../styles/theme';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.accent,
    background: palette.background,
    card: palette.surface,
    text: palette.ink,
    border: palette.line,
  },
};

function PlayStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.background } }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

function TabLabel({ label, focused }) {
  return (
    <Text style={{ color: focused ? palette.accent : palette.muted, fontWeight: focused ? '800' : '700', fontSize: 12 }}>
      {label}
    </Text>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: palette.surface, borderTopColor: palette.line, height: 64, paddingBottom: 10, paddingTop: 8 },
        }}
      >
        <Tab.Screen
          name="Jouer"
          component={PlayStack}
          options={{
            tabBarLabel: ({ focused }) => <TabLabel label="Jouer" focused={focused} />,
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'game-controller' : 'game-controller-outline'} size={size} color={focused ? palette.accent : palette.muted} />
            ),
          }}
        />
        <Tab.Screen
          name="Progression"
          component={ProgressScreen}
          options={{
            tabBarLabel: ({ focused }) => <TabLabel label="Progression" focused={focused} />,
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'trending-up' : 'trending-up-outline'} size={size} color={focused ? palette.accent : palette.muted} />
            ),
          }}
        />
        <Tab.Screen
          name="Bibliothèque"
          component={LibraryScreen}
          options={{
            tabBarLabel: ({ focused }) => <TabLabel label="Bibliothèque" focused={focused} />,
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={focused ? palette.accent : palette.muted} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
