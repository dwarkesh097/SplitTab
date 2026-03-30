import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {GroupsScreen} from '../features/groups/screens/GroupsScreen';
import {AnalyticsScreen} from '../features/analytics/screens/AnalyticsScreen';
import {ProfileScreen} from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';
          
          if (route.name === 'Groups') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4ECDC4',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#4ECDC4',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}>
      <Tab.Screen 
        name="Groups" 
        component={GroupsScreen} 
        options={{title: 'My Groups'}}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen} 
        options={{title: 'Analytics'}}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
};