import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4d8e18',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e8e5dd',
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 10,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'map.fill',
                android: 'location_on',
                web: 'map',
              }}
              tintColor={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vendas"
        options={{
          title: 'Vendas',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'calendar',
                android: 'event',
                web: 'calendar',
              }}
              tintColor={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="relatorio"
        options={{
          title: 'Relatório',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'doc.text',
                android: 'description',
                web: 'file',
              }}
              tintColor={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="metas"
        options={{
          title: 'Metas',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'clock',
                android: 'schedule',
                web: 'clock',
              }}
              tintColor={color}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
