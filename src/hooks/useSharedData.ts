import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dog, Person, Walk, EventType } from '@/types';
import { calculateAge } from '@/lib/dateUtils';
import coffeeAvatar from '@/assets/coffee-avatar.png';
import mokkaAvatar from '@/assets/mokka-avatar.png';

const DEFAULT_AVATARS: Record<string, string> = {
  coffee: coffeeAvatar,
  mokka: mokkaAvatar,
};

export function useSharedData() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [walks, setWalks] = useState<Walk[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [dogsRes, peopleRes, walksRes] = await Promise.all([
        supabase.from('dogs').select('*'),
        supabase.from('people').select('*'),
        supabase.from('walks').select('*').order('timestamp', { ascending: false }),
      ]);

      if (dogsRes.data) {
        setDogs(dogsRes.data.map(d => ({
          id: d.id,
          name: d.name,
          dateOfBirth: d.date_of_birth,
          color: d.color,
          avatarUrl: d.avatar_url || DEFAULT_AVATARS[d.id],
        })));
      }

      if (peopleRes.data) {
        setPeople(peopleRes.data.map(p => ({
          id: p.id,
          name: p.name,
          initial: p.initial,
        })));
      }

      if (walksRes.data) {
        setWalks(walksRes.data.map(w => ({
          id: w.id,
          timestamp: w.timestamp,
          dogId: w.dog_id,
          personId: w.person_id,
          eventType: w.event_type as EventType,
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Subscribe to realtime updates for walks
  useEffect(() => {
    const channel = supabase
      .channel('walks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'walks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const w = payload.new;
            const newWalk: Walk = {
              id: w.id,
              timestamp: w.timestamp,
              dogId: w.dog_id,
              personId: w.person_id,
              eventType: w.event_type as EventType,
            };
            setWalks(prev => [newWalk, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const w = payload.new;
            const updated: Walk = {
              id: w.id,
              timestamp: w.timestamp,
              dogId: w.dog_id,
              personId: w.person_id,
              eventType: w.event_type as EventType,
            };
            setWalks(prev => prev.map(walk => walk.id === updated.id ? updated : walk));
          } else if (payload.eventType === 'DELETE') {
            setWalks(prev => prev.filter(w => w.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addWalk = async (data: { dogId: string; personId: string; eventType: EventType; timestamp?: string }) => {
    const insertData: { dog_id: string; person_id: string; event_type: string; timestamp?: string } = {
      dog_id: data.dogId,
      person_id: data.personId,
      event_type: data.eventType,
    };
    if (data.timestamp) {
      insertData.timestamp = data.timestamp;
    }
    const { data: newWalk, error } = await supabase
      .from('walks')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error adding walk:', error);
      throw error;
    }

    return newWalk;
  };

  const updateDog = async (dogId: string, updates: Partial<Dog>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth;
    if (updates.color !== undefined) dbUpdates.color = updates.color;

    const { error } = await supabase
      .from('dogs')
      .update(dbUpdates)
      .eq('id', dogId);

    if (error) {
      console.error('Error updating dog:', error);
      throw error;
    }

    setDogs(prev =>
      prev.map(dog => (dog.id === dogId ? { ...dog, ...updates } : dog))
    );
  };

  const updateWalk = async (walkId: string, updates: { dogId?: string; personId?: string; eventType?: EventType; timestamp?: string }) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.dogId !== undefined) dbUpdates.dog_id = updates.dogId;
    if (updates.personId !== undefined) dbUpdates.person_id = updates.personId;
    if (updates.eventType !== undefined) dbUpdates.event_type = updates.eventType;
    if (updates.timestamp !== undefined) dbUpdates.timestamp = updates.timestamp;

    const { error } = await supabase.from('walks').update(dbUpdates).eq('id', walkId);
    if (error) { console.error('Error updating walk:', error); throw error; }
  };

  const deleteWalk = async (walkId: string) => {
    const { error } = await supabase.from('walks').delete().eq('id', walkId);
    if (error) { console.error('Error deleting walk:', error); throw error; }
  };

  const getDogById = (id: string) => dogs.find((d) => d.id === id);
  const getPersonById = (id: string) => people.find((p) => p.id === id);

  const getWalksByDog = (dogId: string) => walks.filter((w) => w.dogId === dogId);
  const getWalksByPerson = (personId: string) => walks.filter((w) => w.personId === personId);

  const getDogStats = (dogId: string) => {
    const dogWalks = getWalksByDog(dogId);
    const walkEvents = dogWalks.filter(w => w.eventType.endsWith('_walk'));
    const homeEvents = dogWalks.filter(w => w.eventType.endsWith('_home'));
    
    return {
      totalWalks: walkEvents.length,
      totalPee: dogWalks.filter(w => w.eventType.includes('pee') || w.eventType === 'both_walk').length,
      totalPoop: dogWalks.filter(w => w.eventType.includes('poop') || w.eventType === 'both_walk').length,
      homeEvents: homeEvents.length,
      homePee: homeEvents.filter(w => w.eventType === 'pee_home').length,
      homePoop: homeEvents.filter(w => w.eventType === 'poop_home').length,
    };
  };

  const getPersonStats = (personId: string) => {
    const personWalks = getWalksByPerson(personId);
    return {
      totalWalks: personWalks.filter(w => w.eventType.endsWith('_walk')).length,
      totalEvents: personWalks.length,
    };
  };

  const getDogAge = (dogId: string) => {
    const dog = getDogById(dogId);
    return dog ? calculateAge(dog.dateOfBirth) : '';
  };

  const isHomeEvent = (eventType: EventType) => eventType.endsWith('_home');
  const isWalkEvent = (eventType: EventType) => eventType.endsWith('_walk');

  return {
    dogs,
    people,
    walks,
    loading,
    addWalk,
    updateWalk,
    deleteWalk,
    updateDog,
    getDogById,
    getPersonById,
    getDogStats,
    getPersonStats,
    getDogAge,
    isHomeEvent,
    isWalkEvent,
    refetch: fetchData,
  };
}
