export interface Dog {
  id: string;
  name: string;
  dateOfBirth: string;
  avatarUrl?: string;
  color: string;
}

export interface Person {
  id: string;
  name: string;
  initial: string;
}

export type EventType = 'pee_walk' | 'poop_walk' | 'both_walk' | 'pee_home' | 'poop_home';

export interface Walk {
  id: string;
  timestamp: string;
  dogId: string;
  personId: string;
  eventType: EventType;
}

// Legacy compatibility
export type ActionType = 'pee' | 'poop';
