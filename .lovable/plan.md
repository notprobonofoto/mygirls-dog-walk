
# Dodanie opcji "Nic" na spacerze

Nowy typ zdarzenia oznaczajacy, ze pies byl na spacerze, ale nic nie zrobil.

## Zmiany

### 1. Typ zdarzenia (`src/types/index.ts`)
Dodanie `'nothing_walk'` do `EventType`:
```
export type EventType = 'pee_walk' | 'poop_walk' | 'both_walk' | 'nothing_walk' | 'pee_home' | 'poop_home';
```

### 2. Przyciski w WalkOverlay i BackdateScreen
Dodanie czwartego przycisku w sekcji "Na spacerze":
- Ikona: `🚶` (lub `❌`)
- Label: "Nic"
- Typ: `nothing_walk`

Dotyczy plikow:
- `src/components/WalkOverlay.tsx` -- dodanie wpisu w tablicy `walkEvents`
- `src/components/BackdateScreen.tsx` -- dodanie wpisu w tablicy `walkEvents`

### 3. Statystyki (`src/hooks/useSharedData.ts`)
`nothing_walk` konczy sie na `_walk`, wiec `isWalkEvent` i filtry w `weekUtils.ts` beda go automatycznie liczyc jako spacer. Nie wymaga zmian w `getDogStats` poza tym, ze nie bedzie liczony w `totalPee` ani `totalPoop` (co jest poprawne).

### 4. Historia i wyswietlanie (`src/components/HistoryScreen.tsx`)
`nothing_walk` nie jest `_home`, wiec wyswietli sie jako zwykly spacer. Nalezy dodac odpowiednia ikone/etykiete w renderowaniu historii, aby poprawnie pokazac "Nic".

### 5. Szczegoly techniczne

| Plik | Zmiana |
|------|--------|
| `src/types/index.ts` | Dodanie `'nothing_walk'` do unii `EventType` |
| `src/components/WalkOverlay.tsx` | Nowy przycisk w `walkEvents` |
| `src/components/BackdateScreen.tsx` | Nowy przycisk w `walkEvents` |
| `src/components/HistoryScreen.tsx` | Obsluga ikony/etykiety dla `nothing_walk` |

Brak zmian w bazie danych -- kolumna `event_type` jest typu `text` i przyjmie nowa wartosc.
