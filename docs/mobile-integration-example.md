# RecruitFlow Mobile Integration Example

This document provides examples for integrating RecruitFlow APIs with mobile applications using React Native.

## React Native API Client

```typescript
// api/client.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-api-domain.com/api';

class ApiClient {
  private baseURL: string;
  
  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Candidate methods
  async getCandidates(params?: {
    phase?: number;
    search?: string;
    status?: string;
    source?: string;
    limit?: number;
    offset?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<Candidate[]>(`/candidates?${queryParams}`);
  }

  async getCandidate(id: number) {
    return this.request<Candidate>(`/candidates/${id}`);
  }

  async createCandidate(candidate: CandidateCreate) {
    return this.request<Candidate>('/candidates', {
      method: 'POST',
      body: JSON.stringify(candidate),
    });
  }

  async updateCandidate(id: number, updates: CandidateUpdate) {
    return this.request<Candidate>(`/candidates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Interview methods
  async getInterviews(params?: {
    candidateId?: number;
    date?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<Interview[]>(`/interviews?${queryParams}`);
  }

  async createInterview(interview: InterviewCreate) {
    return this.request<Interview>('/interviews', {
      method: 'POST',
      body: JSON.stringify(interview),
    });
  }

  // Dashboard methods
  async getDashboardStats() {
    return this.request<DashboardStats>('/dashboard/stats');
  }

  async getActivity() {
    return this.request<ActivityItem[]>('/activity');
  }
}

export const apiClient = new ApiClient();
```

## React Native Components

### Candidate List Component
```typescript
// components/CandidateList.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { apiClient } from '../api/client';

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  status: string;
  phase: number;
}

interface CandidateListProps {
  phase?: number;
  onCandidatePress: (candidate: Candidate) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  phase,
  onCandidatePress,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCandidates = async () => {
    try {
      const data = await apiClient.getCandidates({ phase });
      setCandidates(data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [phase]);

  const onRefresh = () => {
    setRefreshing(true);
    loadCandidates();
  };

  const renderCandidate = ({ item }: { item: Candidate }) => (
    <TouchableOpacity
      style={styles.candidateItem}
      onPress={() => onCandidatePress(item)}
    >
      <View style={styles.candidateInfo}>
        <Text style={styles.candidateName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.candidatePosition}>{item.position}</Text>
        <Text style={styles.candidateEmail}>{item.email}</Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.status, getStatusStyle(item.status)]}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={candidates}
      renderItem={renderCandidate}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={styles.container}
    />
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'New':
      return { backgroundColor: '#e3f2fd', color: '#1976d2' };
    case 'Phone Interview':
      return { backgroundColor: '#fff3e0', color: '#f57c00' };
    case 'Technical Interview':
      return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
    case 'Hired':
      return { backgroundColor: '#e8f5e8', color: '#388e3c' };
    case 'Rejected':
      return { backgroundColor: '#ffebee', color: '#d32f2f' };
    default:
      return { backgroundColor: '#f5f5f5', color: '#666' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  candidateItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  candidatePosition: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  candidateEmail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statusContainer: {
    justifyContent: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
  },
});
```

### Dashboard Component
```typescript
// components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { apiClient } from '../api/client';

interface DashboardStats {
  totalCandidates: number;
  phase1Count: number;
  phase2Count: number;
  hiredCount: number;
  interviewsToday: number;
  syncStatus: string;
  lastSync: string;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const data = await apiClient.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading || !stats) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalCandidates}</Text>
          <Text style={styles.statLabel}>Total Candidates</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.phase1Count}</Text>
          <Text style={styles.statLabel}>Phase 1</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.phase2Count}</Text>
          <Text style={styles.statLabel}>Phase 2</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.hiredCount}</Text>
          <Text style={styles.statLabel}>Hired</Text>
        </View>
      </View>

      <View style={styles.interviewsCard}>
        <Text style={styles.cardTitle}>Today's Interviews</Text>
        <Text style={styles.interviewCount}>{stats.interviewsToday}</Text>
      </View>

      <View style={styles.syncCard}>
        <Text style={styles.cardTitle}>Sync Status</Text>
        <View style={styles.syncStatus}>
          <Text style={[styles.syncText, getSyncStatusStyle(stats.syncStatus)]}>
            {stats.syncStatus.toUpperCase()}
          </Text>
          <Text style={styles.lastSync}>
            Last sync: {new Date(stats.lastSync).toLocaleString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const getSyncStatusStyle = (status: string) => {
  switch (status) {
    case 'synced':
      return { color: '#4caf50' };
    case 'syncing':
      return { color: '#ff9800' };
    case 'error':
      return { color: '#f44336' };
    default:
      return { color: '#666' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    marginHorizontal: '1%',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  interviewsCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  interviewCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196f3',
  },
  syncCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  syncStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  syncText: {
    fontSize: 14,
    fontWeight: '600',
  },
  lastSync: {
    fontSize: 12,
    color: '#666',
  },
});
```

## Usage Example

```typescript
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dashboard } from './components/Dashboard';
import { CandidateList } from './components/CandidateList';

const Tab = createBottomTabNavigator();

export default function App() {
  const handleCandidatePress = (candidate: any) => {
    // Navigate to candidate detail screen
    console.log('Selected candidate:', candidate);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Phase 1">
          {() => (
            <CandidateList
              phase={1}
              onCandidatePress={handleCandidatePress}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Phase 2">
          {() => (
            <CandidateList
              phase={2}
              onCandidatePress={handleCandidatePress}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

This mobile integration example demonstrates how to consume the RecruitFlow APIs in a React Native application with proper error handling, loading states, and offline support.