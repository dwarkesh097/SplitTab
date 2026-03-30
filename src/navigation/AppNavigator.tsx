import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {RootState} from '../app/store';
import {RootStackParamList} from './types';
import {MainTabNavigator} from './MainTabNavigator';
import {OnboardingScreen} from '../features/auth/screens/OnboardingScreen';
import {LoginScreen} from '../features/auth/screens/LoginScreen';
import {GroupDetailScreen} from '../features/groups/screens/GroupDetailScreen';
import {ExpenseDetailScreen} from '../features/expenses/screens/ExpenseDetailScreen';
import {AddExpenseScreen} from '../features/expenses/screens/AddExpenseScreen';
import {AddGroupScreen} from '../features/groups/screens/AddGroupScreen';
import {ProfileScreen} from '../features/profile/screens/ProfileScreen';
import {SettlementsScreen} from '../features/settlements/screens/SettlementsScreen';
import {Colors} from '../constants/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerStyle: {backgroundColor: Colors.primary},
  headerTintColor: Colors.surface,
  headerTitleStyle: {fontWeight: 'bold' as const},
};

export const AppNavigator: React.FC = () => {
  const {user} = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={screenOptions}>
        {!user ? (
          // ✅ User nahi hai — Login aur Onboarding dikhao
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{headerShown: false}}
            />
          </>
        ) : (
          // ✅ User logged in hai — Main app dikhao
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="GroupDetail"
              component={GroupDetailScreen}
              options={{title: 'Group Details'}}
            />
            <Stack.Screen
              name="ExpenseDetail"
              component={ExpenseDetailScreen}
              options={{title: 'Expense Details'}}
            />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{title: 'Add Expense'}}
            />
            <Stack.Screen
              name="AddGroup"
              component={AddGroupScreen}
              options={{title: 'Create Group'}}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{title: 'Profile'}}
            />
            <Stack.Screen
              name="Settlements"
              component={SettlementsScreen}
              options={{title: 'Settlements'}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};