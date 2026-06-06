import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface UserPreference {
  id: string;
  language: string;
  theme: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  userId: string;
}

export interface UpdatePreferenceInput {
  language?: string;
  theme?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export const usePreferencesQuery = () => {
  return useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const { data } = await api.get<{ data: UserPreference }>('/api/users/preferences');
      return data.data;
    },
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePreferenceInput) => {
      const { data } = await api.patch<{
        data: UserPreference;
        message: string;
      }>('/api/users/preferences', input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
};
