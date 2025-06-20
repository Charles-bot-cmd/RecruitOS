import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Candidate, InsertCandidate } from "@shared/schema";

export function useCandidates(phase?: number, search?: string) {
  return useQuery({
    queryKey: ['/api/candidates', { phase, search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (phase) params.append('phase', phase.toString());
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/candidates?${params}`);
      if (!response.ok) throw new Error('Failed to fetch candidates');
      return response.json() as Promise<Candidate[]>;
    },
  });
}

export function useCandidate(id: number) {
  return useQuery({
    queryKey: ['/api/candidates', id],
    queryFn: async () => {
      const response = await fetch(`/api/candidates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch candidate');
      return response.json() as Promise<Candidate>;
    },
    enabled: !!id,
  });
}

export function useCreateCandidate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (candidate: InsertCandidate) => {
      const response = await apiRequest('POST', '/api/candidates', candidate);
      return response.json() as Promise<Candidate>;
    },
    onSuccess: () => {
      // Invalidate and refetch candidates
      queryClient.invalidateQueries({ queryKey: ['/api/candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useUpdateCandidate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...candidate }: Partial<InsertCandidate> & { id: number }) => {
      const response = await apiRequest('PUT', `/api/candidates/${id}`, candidate);
      return response.json() as Promise<Candidate>;
    },
    onSuccess: (data) => {
      // Update the specific candidate in cache
      queryClient.setQueryData(['/api/candidates', data.id], data);
      // Invalidate the candidates list
      queryClient.invalidateQueries({ queryKey: ['/api/candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}

export function useDeleteCandidate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/candidates/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/candidates'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    },
  });
}
