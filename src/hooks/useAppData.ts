import { useLocalStorage } from './useLocalStorage';
import { Dog, Person, Walk } from '@/types';
import { calculateAge } from '@/lib/dateUtils';
import coffeeAvatar from '@/assets/coffee-avatar.png';
import mokkaAvatar from '@/assets/mokka-avatar.png';

const DEFAULT_DOGS: Dog[] = [
  { id: 'coffee', name: 'Coffee', dateOfBirth: '2022-11-03', color: '#4A4A4A', avatarUrl: coffeeAvatar },
  { id: 'mokka', name: 'Mokka', dateOfBirth: '2025-08-15', color: '#D4A574', avatarUrl: mokkaAvatar },
];

const DEFAULT_PEOPLE: Person[] = [
  { id: 'grzegorz', name: 'Grzegorz', initial: 'G' },
  { id: 'ilona', name: 'Ilona', initial: 'I' },
  { id: 'marek', name: 'Marek', initial: 'M' },
];

export function useAppData() {
  const [dogs, setDogs] = useLocalStorage<Dog[]>('mygirls-dogs', DEFAULT_DOGS);
  const [people] = useLocalStorage<Person[]>('mygirls-people', DEFAULT_PEOPLE);
  const [walks, setWalks] = useLocalStorage<Walk[]>('mygirls-walks', []);

  const addWalk = (walk: Omit<Walk, 'id' | 'timestamp'>) => {
    const newWalk: Walk = {
      ...walk,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    setWalks((prev) => [newWalk, ...prev]);
    return newWalk;
  };

  const updateDog = (dogId: string, updates: Partial<Dog>) => {
    setDogs((prev) =>
      prev.map((dog) => (dog.id === dogId ? { ...dog, ...updates } : dog))
    );
  };

  const getDogById = (id: string) => dogs.find((d) => d.id === id);
  const getPersonById = (id: string) => people.find((p) => p.id === id);

  // Stats calculations
  const getWalksByDog = (dogId: string) => walks.filter((w) => w.dogId === dogId);
  const getWalksByPerson = (personId: string) => walks.filter((w) => w.personId === personId);
  
  const getDogStats = (dogId: string) => {
    const dogWalks = getWalksByDog(dogId);
    return {
      totalWalks: dogWalks.length,
      totalPee: dogWalks.filter((w) => w.actions.includes('pee')).length,
      totalPoop: dogWalks.filter((w) => w.actions.includes('poop')).length,
    };
  };

  const getPersonStats = (personId: string) => {
    const personWalks = getWalksByPerson(personId);
    return {
      totalWalks: personWalks.length,
    };
  };

  const getDogAge = (dogId: string) => {
    const dog = getDogById(dogId);
    return dog ? calculateAge(dog.dateOfBirth) : '';
  };

  return {
    dogs,
    people,
    walks,
    addWalk,
    updateDog,
    getDogById,
    getPersonById,
    getDogStats,
    getPersonStats,
    getDogAge,
    calculateAge,
  };
}
