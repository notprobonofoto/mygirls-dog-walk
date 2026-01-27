import { useLocalStorage } from './useLocalStorage';

export function useCurrentUser() {
  const [currentPersonId, setCurrentPersonId] = useLocalStorage<string | null>('mygirls-current-person', null);

  const selectPerson = (personId: string) => {
    setCurrentPersonId(personId);
  };

  const clearPerson = () => {
    setCurrentPersonId(null);
  };

  return {
    currentPersonId,
    isSelected: currentPersonId !== null,
    selectPerson,
    clearPerson,
  };
}
