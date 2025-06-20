import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Interview, InsertInterview } from "@shared/schema";

export function useInterviews(candidateId?: number, date?: Date) {
  return useQuery({
    queryKey: ['/api/interviews', { candidateId, date: date?.toISOString() }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (candidateId) params.append('candidateId', candidateId.toString());
      if (date) params.append('date', date.toISOString());
      
      const response = await fetch(`/api/interviews?${params}`);
      if (!response.ok) throw new Error('Failed to fetch interviews');
      return response.json() as Promise<Interview[]>;
    },
  });
}

export function useInterview(id: number) {
  return useQuery({
    queryKey: ['/api/interviews', id],
    queryFn: async () => {
      const response = await fetch(`/api/interviews/${id}`);
      if (!response.ok) throw new Error('Failed to fetch interview');
      return response.json() as Promise<Interview>;
    },
    enabled: !!id,
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (interview: InsertInterview) => {
      const response = await apiRequest('POST', '/api/interviews', interview);
      return response.json() as Promise<Interview>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/interviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...interview }: Partial<InsertInterview> & { id: number }) => {
      const response = await apiRequest('PUT', `/api/interviews/${id}`, interview);
      return response.json() as Promise<Interview>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/interviews', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['/api/interviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useDeleteInterview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/interviews/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/interviews'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}
