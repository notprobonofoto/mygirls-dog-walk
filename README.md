# Pawsitive Pal

## 📱 PROMPT DO LOVABLE — DOG WALK / POTTY TRACKER (MOBILE APP)

### 🎯 CEL

Stwórz **mobilną aplikację (iOS + Android)** do **jednym kliknięciem** zapisywania spacerów psów i ich potrzeb fizjologicznych.

Aplikacja ma być:

* **ultra-prosta (1 klik)**
* **estetyczna**
* **lekko animowana**
* **styl wizualny = połączenie DWÓCH REFERENCJI UI**:

  * **Styl A:** clean, miękkie karty, jasne tło, spokojny „pet care”
  * **Styl B:** nowoczesny, pastelowy, ilustracyjny, lekko playful (rounded, cute)

---

## 🧠 GŁÓWNA ZASADA UX

➡️ **ŻADNYCH FORMULARZY**
➡️ **ŻADNYCH EKRANÓW POŚREDNICH**
➡️ **WSZYSTKO W JEDNYM OVERLAYU PO 1 TAPNIĘCIU**

---

## 🏠 HOME SCREEN (ONE-CLICK MODE)

### Layout:

* Pełnoekranowe tło pastelowe
* **Subtelnie animowane ilustracje shih tzu w tle**
  (bardzo wolny ruch / floating / parallax)

### Główna akcja:

* **JEDEN DUŻY PRZYCISK (70% ekranu):**
  👉 🐾 **SPACER ODBYTY**

* przycisk lekko „oddycha” (micro-animation)

---

## ⬆️ OVERLAY (BOTTOM SHEET – PO KLIKNIĘCIU)

Po kliknięciu:

* automatycznie zapisuje:

  * **datę i godzinę**
  * **czas: Europe/Warsaw**

### Overlay zawiera WSZYSTKO w jednym widoku:

#### 1️⃣ Co się wydarzyło (ikony – multi select):

* 💧 SIKU
* 💩 KUPA
* 💧💩 OBA

(ikony lekko się powiększają po kliknięciu)

#### 2️⃣ Wybór psa (karty z avatarami):

* **Coffee** – 3 lata, czarna shih tzu
* **Mokka** – 6 miesięcy, biało-brązowa shih tzu

➡️ **Użytkownik może WGRYWAĆ ZDJĘCIA PSÓW z telefonu**
➡️ Zdjęcia używane jako avatar w całej aplikacji

#### 3️⃣ Kto wyszedł (chips / pills):

* Grzegorz
* Ilona
* Marek

---

### ZAPIS

* **AUTO-SAVE** (brak przycisku „Zapisz”)
* krótka animacja łapki 🐾
* delikatny haptic feedback

---

## 📆 HISTORIA (MINIMAL)

* Lista kart:

  * godzina
  * miniatura psa
  * ikony 💧 💩
  * inicjał osoby (G / I / M)

Styl kart:
➡️ jak w referencji 1 (clean, rounded, white cards)

---

## 📊 STATYSTYKI (OSOBNA ZAKŁADKA)

### Psy:

* liczba siku / kup
* liczba spacerów
* proste wykresy słupkowe

### Ludzie:

* ile spacerów wykonał:

  * Grzegorz
  * Ilona
  * Marek

---

## 🐶 PROFIL PSA

Dla każdego psa:

* imię
* wiek
* **UPLOAD / ZMIANA ZDJĘCIA**
* zdjęcie widoczne:

  * na home
  * w historii
  * w statystykach

---

## 🎨 DESIGN SYSTEM (KONKRET – BEZ ZGADYWANIA)

### 🎨 Kolory:

* Background: `#FFF7F2`
* Primary: `#FFB703`
* Secondary: `#8ECAE6`
* Accent: `#FB8500`
* Text: `#2B2B2B`
* Cards: `#FFFFFF`

### 🔤 Fonty:

* Headings: **Poppins SemiBold**
* Body: **Inter Regular**
* Numbers: **Inter Medium**

### 🧱 Komponenty:

* Cards: radius 24px
* Buttons: radius 32px
* Chips: radius 20px
* Shadows: bardzo delikatne, soft

---

## 🎞️ RUCH / ANIMACJE

* **Ruchome tło z ilustracjami shih tzu**

  * bardzo wolny floating
  * niska intensywność (nie rozprasza)

* Boksy i ikony:

  * micro-bounce przy tapnięciu
  * scale 1.0 → 1.05

* Overlay:

  * slide-up
  * delikatny blur tła

---

## ⚙️ TECHNICZNIE (LOW-CODE FRIENDLY)

* local storage
* offline-first
* brak logowania
* architektura gotowa pod rozbudowę (jedzenie, zdrowie)

---

## 🧩 WAŻNE DLA LOVABLE

* NIE generuj zbędnych ekranów
* NIE komplikuj flow
* UX = 1 klik + overlay
* Styl = **połączenie obu załączonych referencji UI**

##LOGO (WAŻNE)

Branding / Logo:

Nazwa aplikacji: MyGirls

Logo aplikacji znajduje się w załączonym obrazie referencyjnym

Użyj tego logo jako:

logo aplikacji

ikona aplikacji (app icon)

logo na ekranie startowym

Nie projektuj nowego logo

Zachowaj:

pastelową kolorystykę

miękkie, zaokrąglone kształty

„cute premium pet app” vibe

Logo ma być spójne z całym UI i animacjami aplikacji

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://mygirls-dog-walk.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7516745c-47b8-404c-b57a-cb6a372fd318).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
