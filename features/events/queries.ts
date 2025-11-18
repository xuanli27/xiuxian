'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { generateNewEvent, processEventChoice } from './actions';
import type { AIEvent } from './types';

export const useEvent = () => {
  const queryClient = useQueryClient();

  const { data: eventData, isFetching: isGenerating, refetch: triggerNewEvent } = useQuery({
    queryKey: ['newEvent'],
    queryFn: () => generateNewEvent(),
    enabled: false, // Initially disabled, triggered manually
    refetchOnWindowFocus: false,
  });

  const processChoiceMutation = useMutation({
    mutationFn: (variables: { event: AIEvent, choiceId: string }) => processEventChoice(variables),
    onSuccess: () => {
      // Invalidate player data to reflect changes
      queryClient.invalidateQueries({ queryKey: ['player'] });
    },
  });

  return {
    event: eventData?.event,
    isGenerating,
    triggerNewEvent,
    processChoice: processChoiceMutation.mutate,
    isProcessing: processChoiceMutation.isPending,
    result: processChoiceMutation.data,
    error: processChoiceMutation.error,
  };
};