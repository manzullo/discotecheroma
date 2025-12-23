// Tipi per l'app Discoteche Roma

export interface Evento {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  featured_media: number;
  featured_image_url?: string;
  acf?: {
    data_evento?: string;
    ora_inizio?: string;
    ora_fine?: string;
    prezzo?: string;
    prezzo_prevendita?: string;
    location?: string;
    indirizzo?: string;
    dress_code?: string;
    eta_minima?: string;
    artisti?: string;
    genere_musicale?: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
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
