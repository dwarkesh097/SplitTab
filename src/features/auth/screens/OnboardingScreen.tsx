import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Avatar } from '../../../components/common/Avatar';
import { onboardUser } from '../authSlice';
import { AvatarColor, CurrencyCode } from '../../../models/user.types';
import { styles } from '../styles/OnboardingStyle';

const AVATAR_COLORS: AvatarColor[] = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#FFB347',
  '#B0C4DE',
];

const CURRENCIES: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
});

type FormData = {
  name: string;
  email: string;
};

export const OnboardingScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState<AvatarColor>(
    AVATAR_COLORS[0],
  );
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  const watchedName = watch('name');
  const watchedEmail = watch('email');

  const onSubmit = (data: FormData) => {
    dispatch(
      onboardUser({
        name: data.name,
        email: data.email,
        avatarColor: selectedColor,
        currency: selectedCurrency,
      }),
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Join SplitTab today</Text>
        </View>

        <View style={styles.formSection}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="Enter your email"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Text style={styles.sectionLabel}>Choose Avatar Color</Text>
          <View style={styles.colorPickerGrid}>
            {AVATAR_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorCircleSelected,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Default Currency</Text>
          <View style={styles.currencyPickerRow}>
            {CURRENCIES.map(currency => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyOption,
                  selectedCurrency === currency.code &&
                    styles.currencyOptionSelected,
                ]}
                onPress={() => setSelectedCurrency(currency.code)}
              >
                <Text style={styles.currencySymbolText}>{currency.symbol}</Text>
                <Text style={styles.currencyNameText}>{currency.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ✅ Profile Preview */}
          <View style={styles.previewSection}>
            <Text style={styles.previewLabel}>Your Profile Preview</Text>
            <Avatar
              name={watchedName || 'You'}
              color={selectedColor}
              size="large"
            />
            <Text style={styles.previewNameText}>
              {watchedName || 'Your Name'}
            </Text>
            <Text style={styles.previewEmailText}>
              {watchedEmail || 'email@example.com'}
            </Text>
          </View>

          <Button
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            style={styles.submitButton}
          />

          {/* ✅ Already have account */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPromptText}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


