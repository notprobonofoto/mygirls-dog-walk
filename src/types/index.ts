export interface Dog {
  id: string;
  name: string;
  age: string;
  avatarUrl?: string;
  color: string;
}

export interface Person {
  id: string;
  name: string;
  initial: string;
}

export interface Walk {
  id: string;
  timestamp: string;
  dogId: string;
  personId: string;
  actions: ('pee' | 'poop')[];
}

export type ActionType = 'pee' | 'poop';
