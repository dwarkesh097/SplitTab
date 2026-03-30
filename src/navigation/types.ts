import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Main: undefined;
  GroupDetail: {groupId: string};
  ExpenseDetail: {expenseId: string; groupId: string};
  AddExpense: {groupId: string};
  AddGroup: undefined;
  Profile: undefined;
  Settlements: {groupId: string};
  Analytics: undefined;
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};