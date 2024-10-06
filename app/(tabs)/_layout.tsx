import React from 'react';
import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color }) => <FontAwesome name="list" color={color} size={24} />,
        }}
      />
      {/* <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart Summary',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" color={color} size={24} />,
        }}
      /> */}
    </Tabs>
  );
}
