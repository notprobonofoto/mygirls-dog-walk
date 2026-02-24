import { useApp } from '@/contexts/AppContext';

export type VisualStyleName = 'standard' | 'slim' | 'fun' | 'glass' | 'bold';

interface VisualStyleClasses {
  // Main action button on Home
  mainButton: string;
  mainButtonInner: string;
  // Cards
  card: string;
  // Small buttons (chips, selectors)
  chip: string;
  chipSelected: string;
  // Event buttons in overlay
  eventButton: string;
  eventButtonSelected: string;
  // Save/action buttons
  actionButton: string;
  // Nav bar
  navBar: string;
  navActive: string;
  // Border radius for general use
  radius: string;
  // Gallery: whether to show sub-tabs
  galleryTabs: boolean;
  // Walk timer feature
  walkTimer: boolean;
  // Walk notes feature
  walkNotes: boolean;
  // Last walk widget on Home
  lastWalkWidget: boolean;
  // Background paw animations
  showPawAnimations: boolean;
  // Upload button
  uploadButton: string;
}

const styles: Record<VisualStyleName, VisualStyleClasses> = {
  standard: {
    mainButton: 'w-full max-w-sm aspect-square rounded-[3rem] btn-main flex flex-col items-center justify-center gap-4 animate-breathe',
    mainButtonInner: 'rounded-[3rem]',
    card: 'bg-card rounded-3xl shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-soft)]',
    chip: 'px-4 py-2 rounded-full border-2 transition-all',
    chipSelected: 'border-primary bg-primary/10',
    eventButton: 'p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all',
    eventButtonSelected: 'border-primary bg-primary/10',
    actionButton: 'w-full py-4 rounded-2xl font-semibold text-lg',
    navBar: 'bg-card/95 backdrop-blur-lg border-t border-border',
    navActive: 'bg-primary/10 rounded-2xl',
    radius: 'rounded-3xl',
    galleryTabs: true,
    walkTimer: false,
    walkNotes: false,
    lastWalkWidget: false,
    showPawAnimations: true,
    uploadButton: 'rounded-full',
  },
  slim: {
    mainButton: 'w-full max-w-sm py-8 rounded-xl bg-primary text-primary-foreground flex flex-col items-center justify-center gap-3 shadow-sm',
    mainButtonInner: 'rounded-xl',
    card: 'bg-card rounded-lg border border-border transition-all duration-150',
    chip: 'px-3 py-1.5 rounded-md border transition-all text-sm',
    chipSelected: 'border-primary bg-primary/10',
    eventButton: 'p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all',
    eventButtonSelected: 'border-primary bg-primary/5',
    actionButton: 'w-full py-3 rounded-lg font-medium text-base',
    navBar: 'bg-card border-t border-border',
    navActive: 'bg-muted rounded-lg',
    radius: 'rounded-lg',
    galleryTabs: false,
    walkTimer: false,
    walkNotes: false,
    lastWalkWidget: false,
    showPawAnimations: false,
    uploadButton: 'rounded-lg',
  },
  fun: {
    mainButton: 'w-64 h-64 rounded-full btn-main flex flex-col items-center justify-center gap-3 animate-breathe shadow-[0_0_40px_hsl(var(--primary)/0.5)]',
    mainButtonInner: 'rounded-full',
    card: 'bg-card rounded-[2rem] shadow-[var(--shadow-card)] border-2 border-primary/20 transition-all duration-300 hover:shadow-[var(--shadow-soft)] hover:border-primary/40',
    chip: 'px-4 py-2 rounded-full border-2 transition-all font-semibold',
    chipSelected: 'border-primary bg-primary/15 shadow-md',
    eventButton: 'p-3 rounded-[1.5rem] border-2 border-dashed flex flex-col items-center gap-1 transition-all',
    eventButtonSelected: 'border-primary bg-primary/15 border-solid scale-105',
    actionButton: 'w-full py-4 rounded-full font-bold text-lg tracking-wide',
    navBar: 'bg-card/90 backdrop-blur-xl border-t-2 border-primary/20',
    navActive: 'bg-primary/15 rounded-full',
    radius: 'rounded-[2rem]',
    galleryTabs: true,
    walkTimer: true,
    walkNotes: false,
    lastWalkWidget: false,
    showPawAnimations: true,
    uploadButton: 'rounded-full',
  },
  glass: {
    mainButton: 'w-full max-w-sm py-12 rounded-[2rem] bg-primary/80 backdrop-blur-xl text-primary-foreground flex flex-col items-center justify-center gap-4 shadow-[0_8px_32px_hsl(var(--primary)/0.3)] border border-primary-foreground/20',
    mainButtonInner: 'rounded-[2rem]',
    card: 'bg-card/60 backdrop-blur-xl rounded-2xl border border-border/50 shadow-sm transition-all duration-200 hover:bg-card/80',
    chip: 'px-4 py-2 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all',
    chipSelected: 'border-primary/60 bg-primary/10 backdrop-blur-md',
    eventButton: 'p-3 rounded-xl border border-border/40 bg-card/30 backdrop-blur-sm flex flex-col items-center gap-1 transition-all',
    eventButtonSelected: 'border-primary/50 bg-primary/10',
    actionButton: 'w-full py-4 rounded-xl font-semibold text-lg backdrop-blur-sm',
    navBar: 'bg-card/60 backdrop-blur-2xl border-t border-border/30',
    navActive: 'bg-primary/10 backdrop-blur-md rounded-xl',
    radius: 'rounded-2xl',
    galleryTabs: true,
    walkTimer: false,
    walkNotes: true,
    lastWalkWidget: false,
    showPawAnimations: false,
    uploadButton: 'rounded-xl',
  },
  bold: {
    mainButton: 'w-full max-w-sm py-10 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center gap-4 border-4 border-foreground/20 shadow-[8px_8px_0px_hsl(var(--foreground)/0.15)]',
    mainButtonInner: 'rounded-2xl',
    card: 'bg-card rounded-xl border-3 border-border shadow-[4px_4px_0px_hsl(var(--foreground)/0.08)] transition-all duration-200',
    chip: 'px-4 py-2 rounded-lg border-2 transition-all font-bold',
    chipSelected: 'border-primary bg-primary/15 shadow-[2px_2px_0px_hsl(var(--primary)/0.3)]',
    eventButton: 'p-3 rounded-xl border-3 flex flex-col items-center gap-1 transition-all font-bold',
    eventButtonSelected: 'border-primary bg-primary/10 shadow-[3px_3px_0px_hsl(var(--primary)/0.2)]',
    actionButton: 'w-full py-4 rounded-xl font-bold text-lg border-2 border-foreground/10 shadow-[4px_4px_0px_hsl(var(--primary)/0.3)]',
    navBar: 'bg-card border-t-3 border-foreground/15',
    navActive: 'bg-primary/15 rounded-xl border-2 border-primary/30',
    radius: 'rounded-xl',
    galleryTabs: true,
    walkTimer: false,
    walkNotes: false,
    lastWalkWidget: true,
    showPawAnimations: true,
    uploadButton: 'rounded-xl',
  },
};

export function useVisualStyle(): VisualStyleClasses & { styleName: VisualStyleName } {
  const { visualStyle } = useApp();
  return { ...styles[visualStyle], styleName: visualStyle };
}
