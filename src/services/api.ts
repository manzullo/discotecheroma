// API Service per Discoteche Roma
import { Evento, Prenotazione } from '../types';

const API_BASE_URL = 'https://www.discotecheroma.com/wp-json/wp/v2';

// Dati mock per testing (da rimuovere quando l'API sarà accessibile)
const MOCK_EVENTI: Evento[] = [
  {
    id: 1,
    title: { rendered: 'Sabato Notte @ Goa Club' },
    content: {
      rendered: `<p>Una serata indimenticabile con i migliori DJ della scena romana.
      Musica techno e house fino all'alba. Open bar disponibile fino alle 2:00.</p>
      <p>Special guest: Marco Carola</p>`,
    },
    excerpt: { rendered: 'Una serata indimenticabile con i migliori DJ della scena romana.' },
    date: '2025-12-28T23:00:00',
    featured_media: 1,
    featured_image_url: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
    acf: {
      data_evento: '28/12/2025',
      ora_inizio: '23:00',
      ora_fine: '06:00',
      prezzo: '25€',
      prezzo_prevendita: '20€',
      location: 'Goa Club',
      indirizzo: 'Via Giuseppe Libetta, 13, Roma',
      dress_code: 'Elegante sportivo',
      eta_minima: '21',
      artisti: 'Marco Carola, Loco Dice',
      genere_musicale: 'Techno, House',
    },
  },
  {
    id: 2,
    title: { rendered: 'Venerdì Latino @ Piper Club' },
    content: {
      rendered: `<p>La serata latina più caliente di Roma!
      Salsa, bachata, reggaeton e musica latina tutta la notte.</p>
      <p>Lezione di salsa gratuita alle 22:00</p>`,
    },
    excerpt: { rendered: 'La serata latina più caliente di Roma!' },
    date: '2025-12-27T22:00:00',
    featured_media: 2,
    featured_image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    acf: {
      data_evento: '27/12/2025',
      ora_inizio: '22:00',
      ora_fine: '04:00',
      prezzo: '15€',
      prezzo_prevendita: '10€',
      location: 'Piper Club',
      indirizzo: 'Via Tagliamento, 9, Roma',
      dress_code: 'Casual elegante',
      eta_minima: '18',
      artisti: 'DJ Latino Mix',
      genere_musicale: 'Reggaeton, Salsa, Bachata',
    },
  },
  {
    id: 3,
    title: { rendered: 'New Year\'s Eve 2026 @ Spazio 900' },
    content: {
      rendered: `<p>Il Capodanno più esclusivo di Roma!
      Cena di gala, open bar premium, countdown con fuochi d'artificio.</p>
      <p>DJ set internazionali fino alle 7 del mattino.</p>`,
    },
    excerpt: { rendered: 'Il Capodanno più esclusivo di Roma!' },
    date: '2025-12-31T21:00:00',
    featured_media: 3,
    featured_image_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    acf: {
      data_evento: '31/12/2025',
      ora_inizio: '21:00',
      ora_fine: '07:00',
      prezzo: '150€',
      prezzo_prevendita: '120€',
      location: 'Spazio 900',
      indirizzo: 'Via di Portonaccio, 212, Roma',
      dress_code: 'Black Tie',
      eta_minima: '21',
      artisti: 'Carl Cox, Nina Kraviz, Amelie Lens',
      genere_musicale: 'Techno, Electronic',
    },
  },
  {
    id: 4,
    title: { rendered: 'Hip Hop Night @ Qube' },
    content: {
      rendered: `<p>La migliore serata Hip Hop e R&B della capitale!
      Due sale, due generi, una notte indimenticabile.</p>`,
    },
    excerpt: { rendered: 'La migliore serata Hip Hop e R&B della capitale!' },
    date: '2025-12-26T23:30:00',
    featured_media: 4,
    featured_image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    acf: {
      data_evento: '26/12/2025',
      ora_inizio: '23:30',
      ora_fine: '05:00',
      prezzo: '20€',
      prezzo_prevendita: '15€',
      location: 'Qube',
      indirizzo: 'Via di Portonaccio, 212, Roma',
      dress_code: 'Street Style',
      eta_minima: '18',
      artisti: 'DJ Shorty, MC Roma',
      genere_musicale: 'Hip Hop, R&B, Trap',
    },
  },
  {
    id: 5,
    title: { rendered: 'Sunday Aperitivo @ Lanificio 159' },
    content: {
      rendered: `<p>Aperitivo con musica dal vivo nel cuore di Roma.
      Drink, finger food e atmosfera rilassata per iniziare la settimana con stile.</p>`,
    },
    excerpt: { rendered: 'Aperitivo con musica dal vivo nel cuore di Roma.' },
    date: '2025-12-29T18:00:00',
    featured_media: 5,
    featured_image_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
    acf: {
      data_evento: '29/12/2025',
      ora_inizio: '18:00',
      ora_fine: '24:00',
      prezzo: '10€',
      prezzo_prevendita: '8€',
      location: 'Lanificio 159',
      indirizzo: 'Via di Pietralata, 159, Roma',
      dress_code: 'Casual',
      eta_minima: '18',
      artisti: 'Live Band, DJ Set',
      genere_musicale: 'Indie, Electronic, Chill',
    },
  },
];

// Flag per usare dati mock o API reale
const USE_MOCK_DATA = true;

export const fetchEventi = async (): Promise<Evento[]> => {
  if (USE_MOCK_DATA) {
    // Simula delay di rete
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_EVENTI;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/eventi?_embed&per_page=20`, {
      headers: {
        'User-Agent': 'DiscotecheRoma-App/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Processa gli eventi per estrarre l'immagine featured
    return data.map((evento: Evento) => ({
      ...evento,
      featured_image_url:
        evento._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    }));
  } catch (error) {
    console.error('Errore nel caricamento eventi:', error);
    // Fallback ai dati mock in caso di errore
    return MOCK_EVENTI;
  }
};

export const fetchEventoById = async (id: number): Promise<Evento | null> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_EVENTI.find((e) => e.id === id) || null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/eventi/${id}?_embed`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const evento = await response.json();
    return {
      ...evento,
      featured_image_url:
        evento._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    };
  } catch (error) {
    console.error('Errore nel caricamento evento:', error);
    return null;
  }
};

// Storage locale per le prenotazioni (in produzione useresti un backend)
let prenotazioni: Prenotazione[] = [];

export const savePrenotazione = async (
  prenotazione: Omit<Prenotazione, 'id' | 'dataPrenotazione' | 'status'>
): Promise<Prenotazione> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newPrenotazione: Prenotazione = {
    ...prenotazione,
    id: `PRE-${Date.now()}`,
    dataPrenotazione: new Date().toISOString(),
    status: 'confirmed',
  };

  prenotazioni.push(newPrenotazione);
  return newPrenotazione;
};

export const getPrenotazioni = async (): Promise<Prenotazione[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return prenotazioni;
};

export const cancelPrenotazione = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = prenotazioni.findIndex((p) => p.id === id);
  if (index !== -1) {
    prenotazioni[index].status = 'cancelled';
    return true;
  }
  return false;
};
