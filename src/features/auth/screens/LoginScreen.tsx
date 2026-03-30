import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {Input} from '../../../components/common/Input';
import {Button} from '../../../components/common/Button';
import {login} from '../authSlice';
import {RootState} from '../../../app/store';
import { styles } from '../styles/LoginScreenStyle';

type FormData = {email: string; password: string};

const schema = yup.object({
  email: yup.string().required('Email required').email('Invalid email'),
  password: yup
    .string()
    .required('Password required')
    .min(6, 'Min 6 characters'),
});

export const LoginScreen: React.FC = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {isLoading, error} = useSelector((state: RootState) => state.auth);

  const {control, handleSubmit} = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = (data: FormData) => {
    dispatch(login(data));
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>SplitTab</Text>
          <Text style={styles.headerSubtitle}>Split expenses with ease</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formTitle}>Welcome Back</Text>
          <Text style={styles.formSubtitle}>Sign in to your account</Text>

          <Controller
            control={control}
            name="email"
            render={({
              field: {onChange, value},
              fieldState: {error: fieldError},
            }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={fieldError?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({
              field: {onChange, value},
              fieldState: {error: fieldError},
            }) => (
              <Input
                label="Password"
                placeholder="Enter your password"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                error={fieldError?.message}
              />
            )}
          />

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{error}</Text>
            </View>
          )}

          <Button
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.signInButton}
          />

          {/* ✅ Register button */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPromptText}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Onboarding')}>
              <Text style={styles.registerLinkText}>Register</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.demoAccountsText}>
            Demo: john@example.com / password123{'\n'}
            jane@example.com / password123
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
