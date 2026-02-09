
# Dodanie funkcji "Zapisz wstecz"

Funkcja pozwoli zapisywac spacery i zdarzenia z przeszlosci, wybierajac date i godzine recznie.

## Co sie zmieni

### 1. Nowa zakladka w dolnej nawigacji
- Dodanie piątej zakladki "Wstecz" z ikona `RotateCcw` (lub `History`) w `BottomNav.tsx`
- Nowy ekran `BackdateScreen.tsx` w pelnym stylu aplikacji (pastelowe karty, zaokraglone elementy, Poppins/Inter)

### 2. Ekran "Zapisz wstecz" (`BackdateScreen.tsx`)
Formularz identyczny jak obecny `WalkOverlay`, ale z dodatkowymi polami:
- **Wybor daty** -- kalendarz (komponent `react-day-picker` juz zainstalowany)
- **Wybor godziny** -- prosty selektor godziny i minut (np. scrollowalne pola lub input time)
- Pozostale pola jak w WalkOverlay:
  - Kto wyprowadzil (Grzegorz / Ilona / Marek / Gosc)
  - Ktory piesek (Coffee / Mokka)
  - Typ zdarzenia (spacerowe lub domowe)
- Przycisk "Zapisz"

### 3. Zmiany w `useSharedData.ts`
- Rozszerzenie funkcji `addWalk` o opcjonalny parametr `timestamp`
- Jesli `timestamp` jest podany, wstawienie go do bazy zamiast domyslnego `now()`

### 4. Zmiany w plikach
| Plik | Zmiana |
|------|--------|
| `src/components/BackdateScreen.tsx` | Nowy komponent -- formularz zapisu wstecz |
| `src/components/BottomNav.tsx` | Dodanie 5. zakladki "Wstecz" |
| `src/pages/Index.tsx` | Obsluga nowej zakladki |
| `src/hooks/useSharedData.ts` | Parametr `timestamp` w `addWalk` |

### 5. Szczegoly techniczne

**addWalk** -- zmiana sygnatury:
```typescript
addWalk(data: { dogId: string; personId: string; eventType: EventType; timestamp?: string })
```
Jesli `timestamp` jest podany, wstawiany do kolumny `timestamp` w tabeli `walks` (kolumna juz akceptuje wartosc -- typ `Insert` ma `timestamp?: string`).

**BackdateScreen** -- wykorzysta istniejace komponenty:
- `Calendar` z `react-day-picker` do wyboru dnia
- Inputy godziny/minuty jako proste selektory
- Ten sam uklad kart (piesek, zdarzenie, osoba) co WalkOverlay
- Strefa czasowa Europe/Warsaw (uzycie `date-fns-tz`)

**Brak zmian w bazie danych** -- kolumna `timestamp` juz istnieje i akceptuje dowolna wartosc.
