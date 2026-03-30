import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { createGroup } from '../groupSlice';
import { RootState } from '../../../app/store';
import { MOCK_CONTACTS } from '../../../constants/mockContacts';
import { Colors } from '../../../constants/colors';
import { styles } from '../styles/AddGroupStyle';

const GROUP_ICONS = [
  '👥',
  '🍽️',
  '✈️',
  '🏠',
  '🎉',
  '💼',
  '🎓',
  '🏋️',
  '🎨',
  '🎮',
];

const schema = yup.object({
  name: yup
    .string()
    .required('Group name is required')
    .min(3, 'Name must be at least 3 characters'),
  description: yup.string().optional(),
});

type FormData = {
  name: string;
  description: string;
};

export const AddGroupScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedIcon, setSelectedIcon] = useState(GROUP_ICONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    user?.id ? [user.id] : [],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const toggleMember = (memberId: string) => {
    if (memberId === user?.id) return;
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const filteredContacts = MOCK_CONTACTS.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onSubmit = (data: FormData) => {
    if (selectedMembers.length < 2) {
      Alert.alert('Error', 'Group must have at least 2 members');
      return;
    }

    dispatch(
      createGroup({
        name: data.name,
        icon: selectedIcon,
        description: data.description,
        members: selectedMembers,
        createdBy: user?.id || '',
      }),
    );

    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.formContainer}>
        <Text style={styles.sectionLabel}>Group Icon</Text>
        <View style={styles.iconGridContainer}>
          {GROUP_ICONS.map(icon => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconOption,
                selectedIcon === icon && styles.iconOptionSelected,
              ]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Text style={styles.iconEmoji}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Group Name"
              placeholder="Enter group name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <Input
              label="Description (Optional)"
              placeholder="What's this group about?"
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={3}
              error={errors.description?.message}
            />
          )}
        />

        <Text style={styles.sectionLabel}>Add Members</Text>
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInputContainer}
        />

        <View style={styles.membersListContainer}>
          <Text style={styles.selectedCountText}>
            Selected: {selectedMembers.length} members
          </Text>
          {filteredContacts.map(contact => (
            <TouchableOpacity
              key={contact.id}
              style={[
                styles.memberRow,
                selectedMembers.includes(contact.id) &&
                  styles.memberRowSelected,
                contact.id === user?.id && styles.memberRowCurrentUser,
              ]}
              onPress={() => toggleMember(contact.id)}
              disabled={contact.id === user?.id}
            >
              <View
                style={[
                  styles.memberAvatarCircle,
                  { backgroundColor: contact.avatarColor },
                ]}
              >
                <Text style={styles.memberInitialText}>
                  {contact.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.memberInfoContainer}>
                <Text style={styles.memberNameText}>
                  {contact.name}
                  {contact.id === user?.id && ' (You)'}
                </Text>
                <Text style={styles.memberEmailText}>{contact.email}</Text>
              </View>
              {selectedMembers.includes(contact.id) && (
                <Icon name="check-circle" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Button
          title="Create Group"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};
