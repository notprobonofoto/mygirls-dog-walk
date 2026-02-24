export type Language = 'pl' | 'en';

type TranslationKeys = typeof translations['pl'];

const translations = {
  pl: {
    // Nav
    'nav.home': 'Start',
    'nav.history': 'Historia',
    'nav.backdate': 'Wstecz',
    'nav.stats': 'Statystyki',
    'nav.gallery': 'Galeria',
    'nav.dogs': 'Pieski',

    // Home
    'home.subtitle': 'Śledź spacery swoich piesków 🐕',
    'home.today': 'Dzisiaj',
    'home.walks_one': 'spacer',
    'home.walks_few': 'spacery',
    'home.walks_many': 'spacerów',
    'home.home_events_one': 'zdarzenie w domu',
    'home.home_events_many': 'zdarzenia w domu',
    'home.main_button': 'SPACER ODBYTY',
    'home.tap_to_save': 'Tapnij aby zapisać',
    'home.change': 'zmień',

    // Walk overlay
    'walk.who': 'Kto wyprowadził?',
    'walk.which_dog': 'Który piesek?',
    'walk.on_walk': 'Na spacerze',
    'walk.at_home': 'W domu (alert)',
    'walk.save': 'Zapisz',
    'walk.saved': 'Zapisano!',
    'walk.guest': 'Gość',
    'walk.pee': 'Siku',
    'walk.poop': 'Kupa',
    'walk.both': 'Oba',
    'walk.nothing': 'Nic',
    'walk.pee_home': 'Siku w domu',
    'walk.poop_home': 'Kupa w domu',

    // History
    'history.title': 'Historia',
    'history.subtitle': 'Dotknij spacer aby edytować lub usunąć',
    'history.empty': 'Brak zapisanych spacerów',
    'history.empty_hint': 'Wróć na stronę główną i zapisz pierwszy spacer!',
    'history.edit_title': 'Edytuj spacer',
    'history.edit_desc': 'Zmień szczegóły lub usuń wpis',
    'history.event_type': 'Typ zdarzenia',
    'history.dog': 'Piesek',
    'history.person': 'Osoba',
    'history.date': 'Data',
    'history.time': 'Godzina',
    'history.delete': 'Usuń',
    'history.cancel': 'Anuluj',
    'history.save': 'Zapisz',
    'history.saving': 'Zapisuję...',
    'history.updated': 'Spacer zaktualizowany',
    'history.deleted': 'Spacer usunięty',
    'history.delete_confirm': 'Usunąć spacer?',
    'history.delete_irreversible': 'Ta operacja jest nieodwracalna.',
    'history.at_home': 'W domu',
    'history.unknown': 'Nieznany',
    'history.pee': 'Siku',
    'history.poop': 'Kupa',
    'history.both': 'Oba',
    'history.nothing': 'Nic',
    'history.pee_home': 'Siku (dom)',
    'history.poop_home': 'Kupa (dom)',

    // Stats
    'stats.title': 'Statystyki',
    'stats.subtitle': 'Podsumowanie spacerów',
    'stats.week': 'Tydzień',
    'stats.month': 'Miesiąc',
    'stats.this_week': 'Ten tydzień',
    'stats.this_month': 'Ten miesiąc',
    'stats.walks': 'Spacerów',
    'stats.pee': '💧 Siku',
    'stats.poop': '💩 Kupa',
    'stats.avg_hours': '🕐 Średnie godziny spacerów',
    'stats.walks_count': 'spacerów',
    'stats.home_events': 'Zdarzenia w domu',
    'stats.pee_home': '💧 Siku w domu',
    'stats.poop_home': '💩 Kupa w domu',
    'stats.dogs_section': 'Pieski',
    'stats.calendar': '📅 Kalendarz',
    'stats.caretakers': 'Opiekunowie',
    'stats.at_home': 'w domu',

    // Gallery
    'gallery.title': 'Galeria',
    'gallery.subtitle': '📸 Zdjęcia naszych piesków',
    'gallery.empty': 'Brak zdjęć. Dodaj pierwsze!',
    'gallery.new_photo': 'Nowe zdjęcie',
    'gallery.description_placeholder': 'Opis zdjęcia (opcjonalnie)',
    'gallery.upload': 'Dodaj zdjęcie 📸',
    'gallery.uploading': 'Wgrywanie...',
    'gallery.uploaded': 'Zdjęcie dodane! 📸',
    'gallery.deleted': 'Zdjęcie usunięte',
    'gallery.upload_error': 'Błąd podczas wgrywania',
    'gallery.delete_error': 'Błąd podczas usuwania',
    'gallery.together': 'Razem',
    'gallery.share': 'Udostępnij',
    'gallery.share_error': 'Nie można udostępnić',

    // Dogs
    'dogs.title': 'Pieski',
    'dogs.subtitle': 'Zarządzaj profilami swoich piesków',
    'dogs.this_week': 'Ten tydzień',
    'dogs.based_on_7_days': 'Na podstawie ostatnich 7 dni',

    // Backdate
    'backdate.title': '📝 Zapisz wstecz',
    'backdate.select_date': 'Wybierz datę',
    'backdate.hour': 'Godzina',
    'backdate.save': 'Zapisz wstecz',
    'backdate.summary': 'Zapis na:',

    // Person selector
    'person.title': 'Kto używa aplikacji?',
    'person.subtitle': 'Wybierz swoje imię',

    // Password
    'password.title': 'Wpisz hasło',
    'password.placeholder': 'Hasło...',
    'password.submit': 'Wejdź',
    'password.error': 'Nieprawidłowe hasło',

    // Settings
    'settings.title': 'Ustawienia',
    'settings.theme': 'Motyw',
    'settings.language': 'Język',
    'settings.password': 'Hasło aplikacji',
    'settings.current_password': 'Aktualne hasło:',
    'settings.new_password': 'Nowe hasło',
    'settings.change_password': 'Zmień hasło',
    'settings.password_changed': 'Hasło zmienione!',
    'settings.password_empty': 'Hasło nie może być puste',
    'settings.logout': 'Wyloguj się',
    'settings.logout_desc': 'Przy następnym wejściu trzeba będzie wpisać hasło',
    'settings.theme_standard': 'Standard',
    'settings.theme_dark': 'Dark',
    'settings.theme_blue': 'Ocean',
    'settings.theme_neon': 'Neon',
    'settings.theme_pink': 'Pink',
    'settings.visual_style': 'Styl wizualny',
    'settings.style_standard': 'Standard',
    'settings.style_slim': 'Slim',
    'settings.style_fun': 'Fun',
    'settings.style_glass': 'Glass',
    'settings.style_bold': 'Bold',
    'settings.style_standard_desc': 'Klasyczny wygląd',
    'settings.style_slim_desc': 'Minimalizm',
    'settings.style_fun_desc': 'Zabawa i animacje',
    'settings.style_glass_desc': 'Przezroczystość',
    'settings.style_bold_desc': 'Mocne linie',

    // Walk bonus
    'walk.timer': 'Czas spaceru',
    'walk.note_placeholder': 'Notatka do spaceru...',
    'walk.last_walk': 'Ostatni spacer',
    'walk.ago': 'temu',
    'walk.no_walks_yet': 'Brak spacerów',

    // Common
    'common.error': 'Błąd',
    'common.save_error': 'Błąd podczas zapisywania',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.history': 'History',
    'nav.backdate': 'Backdate',
    'nav.stats': 'Stats',
    'nav.gallery': 'Gallery',
    'nav.dogs': 'Dogs',

    // Home
    'home.subtitle': 'Track your dogs\' walks 🐕',
    'home.today': 'Today',
    'home.walks_one': 'walk',
    'home.walks_few': 'walks',
    'home.walks_many': 'walks',
    'home.home_events_one': 'home event',
    'home.home_events_many': 'home events',
    'home.main_button': 'WALK DONE',
    'home.tap_to_save': 'Tap to save',
    'home.change': 'change',

    // Walk overlay
    'walk.who': 'Who walked?',
    'walk.which_dog': 'Which dog?',
    'walk.on_walk': 'On walk',
    'walk.at_home': 'At home (alert)',
    'walk.save': 'Save',
    'walk.saved': 'Saved!',
    'walk.guest': 'Guest',
    'walk.pee': 'Pee',
    'walk.poop': 'Poop',
    'walk.both': 'Both',
    'walk.nothing': 'Nothing',
    'walk.pee_home': 'Pee at home',
    'walk.poop_home': 'Poop at home',

    // History
    'history.title': 'History',
    'history.subtitle': 'Tap a walk to edit or delete',
    'history.empty': 'No walks recorded',
    'history.empty_hint': 'Go to home and record your first walk!',
    'history.edit_title': 'Edit walk',
    'history.edit_desc': 'Change details or delete entry',
    'history.event_type': 'Event type',
    'history.dog': 'Dog',
    'history.person': 'Person',
    'history.date': 'Date',
    'history.time': 'Time',
    'history.delete': 'Delete',
    'history.cancel': 'Cancel',
    'history.save': 'Save',
    'history.saving': 'Saving...',
    'history.updated': 'Walk updated',
    'history.deleted': 'Walk deleted',
    'history.delete_confirm': 'Delete walk?',
    'history.delete_irreversible': 'This action is irreversible.',
    'history.at_home': 'At home',
    'history.unknown': 'Unknown',
    'history.pee': 'Pee',
    'history.poop': 'Poop',
    'history.both': 'Both',
    'history.nothing': 'Nothing',
    'history.pee_home': 'Pee (home)',
    'history.poop_home': 'Poop (home)',

    // Stats
    'stats.title': 'Stats',
    'stats.subtitle': 'Walk summary',
    'stats.week': 'Week',
    'stats.month': 'Month',
    'stats.this_week': 'This week',
    'stats.this_month': 'This month',
    'stats.walks': 'Walks',
    'stats.pee': '💧 Pee',
    'stats.poop': '💩 Poop',
    'stats.avg_hours': '🕐 Average walk hours',
    'stats.walks_count': 'walks',
    'stats.home_events': 'Home events',
    'stats.pee_home': '💧 Pee at home',
    'stats.poop_home': '💩 Poop at home',
    'stats.dogs_section': 'Dogs',
    'stats.calendar': '📅 Calendar',
    'stats.caretakers': 'Caretakers',
    'stats.at_home': 'at home',

    // Gallery
    'gallery.title': 'Gallery',
    'gallery.subtitle': '📸 Photos of our dogs',
    'gallery.empty': 'No photos yet. Add the first one!',
    'gallery.new_photo': 'New photo',
    'gallery.description_placeholder': 'Description (optional)',
    'gallery.upload': 'Add photo 📸',
    'gallery.uploading': 'Uploading...',
    'gallery.uploaded': 'Photo added! 📸',
    'gallery.deleted': 'Photo deleted',
    'gallery.upload_error': 'Upload error',
    'gallery.delete_error': 'Delete error',
    'gallery.together': 'Together',
    'gallery.share': 'Share',
    'gallery.share_error': 'Cannot share',

    // Dogs
    'dogs.title': 'Dogs',
    'dogs.subtitle': 'Manage your dogs\' profiles',
    'dogs.this_week': 'This week',
    'dogs.based_on_7_days': 'Based on last 7 days',

    // Backdate
    'backdate.title': '📝 Backdate entry',
    'backdate.select_date': 'Select date',
    'backdate.hour': 'Time',
    'backdate.save': 'Save backdate',
    'backdate.summary': 'Entry for:',

    // Person selector
    'person.title': 'Who is using the app?',
    'person.subtitle': 'Select your name',

    // Password
    'password.title': 'Enter password',
    'password.placeholder': 'Password...',
    'password.submit': 'Enter',
    'password.error': 'Wrong password',

    // Settings
    'settings.title': 'Settings',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.password': 'App password',
    'settings.current_password': 'Current password:',
    'settings.new_password': 'New password',
    'settings.change_password': 'Change password',
    'settings.password_changed': 'Password changed!',
    'settings.password_empty': 'Password cannot be empty',
    'settings.logout': 'Log out',
    'settings.logout_desc': 'You will need to enter the password next time',
    'settings.theme_standard': 'Standard',
    'settings.theme_dark': 'Dark',
    'settings.theme_blue': 'Ocean',
    'settings.theme_neon': 'Neon',
    'settings.theme_pink': 'Pink',
    'settings.visual_style': 'Visual Style',
    'settings.style_standard': 'Standard',
    'settings.style_slim': 'Slim',
    'settings.style_fun': 'Fun',
    'settings.style_glass': 'Glass',
    'settings.style_bold': 'Bold',
    'settings.style_standard_desc': 'Classic look',
    'settings.style_slim_desc': 'Minimalism',
    'settings.style_fun_desc': 'Fun & animations',
    'settings.style_glass_desc': 'Transparency',
    'settings.style_bold_desc': 'Strong lines',

    // Walk bonus
    'walk.timer': 'Walk time',
    'walk.note_placeholder': 'Walk note...',
    'walk.last_walk': 'Last walk',
    'walk.ago': 'ago',
    'walk.no_walks_yet': 'No walks yet',

    // Common
    'common.error': 'Error',
    'common.save_error': 'Error saving',
  },
} as const;

export type TranslationKey = keyof typeof translations['pl'];

export function t(key: TranslationKey, lang: Language): string {
  return translations[lang]?.[key] || translations['pl'][key] || key;
}

export function getWalkCountLabel(count: number, lang: Language): string {
  if (lang === 'en') return count === 1 ? t('home.walks_one', lang) : t('home.walks_many', lang);
  if (count === 1) return t('home.walks_one', lang);
  if (count >= 2 && count <= 4) return t('home.walks_few', lang);
  return t('home.walks_many', lang);
}
