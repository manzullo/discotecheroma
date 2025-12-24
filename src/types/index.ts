// Tipi per l'app Discoteche Roma

// Struttura dell'API PartySpot
export interface EventoAPI {
  ID: number;
  post_title: string;
  featured_image: string | false;
  'giorno-della-settimana'?: Array<{ slug: string }>;
  'genere-musicale-evento'?: Array<{ name: string }>;
  'eta-minima'?: string;
  'costi-liste-evento'?: string;
  'costi-tavoli-evento'?: string;
  'costi-pacchetti-evento'?: string;
  'stato-evento-ricorrente'?: Array<{ slug: string }>;
  'costi-formule-a-partire-da'?: string;
  'note-evento'?: string;
}

// Struttura normalizzata per l'app
export interface Evento {
  id: number;
  titolo: string;
  immagine: string | null;
  giorno: string;
  generiMusicali: string[];
  etaMinima: string | null;
  costiListe: string | null;
  costiTavoli: string | null;
  costiPacchetti: string | null;
  prezzoMinimo: string | null;
  stato: string[];
  note: string | null;
}

export interface Prenotazione {
  id?: string;
  eventoId: number;
  nomeEvento: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
  numeroPosti: number;
  dataPrenotazione: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface User {
  id: string;
  nome: string;
  cognome: string;
  email: string;
  telefono: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  EventDetail: { evento: Evento };
  Booking: { evento: Evento };
  BookingConfirmation: { prenotazione: Prenotazione };
};

export type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  MyBookings: undefined;
  Profile: undefined;
};
