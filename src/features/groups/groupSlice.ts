import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Group } from '../../models/group.types';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  currentGroup: null,
  isLoading: false,
  error: null,
};

const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    fetchGroups: state => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGroupsSuccess: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
      state.isLoading = false;
    },
    fetchGroupsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    createGroup: (state, action: PayloadAction<any>) => {
      state.isLoading = true;
    },
    createGroupSuccess: (state, action: PayloadAction<Group>) => {
      state.groups = [...state.groups, action.payload];
      state.isLoading = false;
    },
    createGroupFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateGroupTotalSpend: (
      state,
      action: PayloadAction<{ groupId: string; amount: number }>,
    ) => {
      const group = state.groups.find(g => g.id === action.payload.groupId);
      if (group) {
        group.totalSpend = (group.totalSpend || 0) + action.payload.amount;
        group.lastActivity = new Date().toISOString();
      }
      if (
        state.currentGroup?.id === action.payload.groupId &&
        state.currentGroup
      ) {
        state.currentGroup.totalSpend =
          (state.currentGroup.totalSpend || 0) + action.payload.amount;
        state.currentGroup.lastActivity = new Date().toISOString();
      }
    },
    archiveGroup: (state, action: PayloadAction<string>) => {
      const group = state.groups.find(g => g.id === action.payload);
      if (group) group.isArchived = true;
    },
    unarchiveGroup: (state, action: PayloadAction<string>) => {
      const group = state.groups.find(g => g.id === action.payload);
      if (group) group.isArchived = false;
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(g => g.id !== action.payload);
      if (state.currentGroup?.id === action.payload) {
        state.currentGroup = null;
      }
    },
    setCurrentGroup: (state, action: PayloadAction<string>) => {
      state.currentGroup =
        state.groups.find(g => g.id === action.payload) || null;
    },
    clearCurrentGroup: state => {
      state.currentGroup = null;
    },
  },
});

export const {
  fetchGroups,
  fetchGroupsSuccess,
  fetchGroupsFailure,
  createGroup,
  createGroupSuccess,
  createGroupFailure,
  updateGroupTotalSpend,
  archiveGroup,
  unarchiveGroup,
  setCurrentGroup,
  clearCurrentGroup,
  deleteGroup,
} = groupSlice.actions;

export default groupSlice.reducer;