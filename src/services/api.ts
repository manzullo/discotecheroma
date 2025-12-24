// API Service per Discoteche Roma
import { Evento, EventoAPI, Prenotazione } from '../types';

const API_BASE_URL = 'https://www.partyspot.it/wp-json/eventi';

// Mappa dei giorni della settimana con ordine
const GIORNI_MAP: Record<string, string> = {
  lunedi: 'Lunedì',
  martedi: 'Martedì',
  mercoledi: 'Mercoledì',
  giovedi: 'Giovedì',
  venerdi: 'Venerdì',
  sabato: 'Sabato',
  domenica: 'Domenica',
};

// Ordine dei giorni per ordinamento
const GIORNI_ORDINE: Record<string, number> = {
  'Lunedì': 1,
  'Martedì': 2,
  'Mercoledì': 3,
  'Giovedì': 4,
  'Venerdì': 5,
  'Sabato': 6,
  'Domenica': 7,
};

// Funzione per ordinare eventi per giorno della settimana
const ordinaPerGiorno = (eventi: Evento[]): Evento[] => {
  return eventi.sort((a, b) => {
    const ordineA = GIORNI_ORDINE[a.giorno] || 99;
    const ordineB = GIORNI_ORDINE[b.giorno] || 99;
    return ordineA - ordineB;
  });
};

// Funzione per rimuovere i tag HTML
const stripHtml = (html: string): string => {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/€/g, '€')
    .replace(/\u20ac/g, '€')
    .trim();
};

// Trasforma l'evento dall'API al formato dell'app
const trasformaEvento = (eventoApi: EventoAPI): Evento => {
  const giorni = eventoApi['giorno-della-settimana'];
  const giorno = giorni && giorni.length > 0
    ? GIORNI_MAP[giorni[0].slug] || giorni[0].slug
    : '';

  const generi = eventoApi['genere-musicale-evento'];
  const generiMusicali = generi ? generi.map(g => g.name) : [];

  const stati = eventoApi['stato-evento-ricorrente'];
  const stato = stati ? stati.map(s => s.slug) : [];

  return {
    id: eventoApi.ID,
    titolo: eventoApi.post_title,
    immagine: eventoApi.featured_image || null,
    giorno,
    generiMusicali,
    etaMinima: eventoApi['eta-minima'] || null,
    costiListe: eventoApi['costi-liste-evento']
      ? stripHtml(eventoApi['costi-liste-evento'])
      : null,
    costiTavoli: eventoApi['costi-tavoli-evento']
      ? stripHtml(eventoApi['costi-tavoli-evento'])
      : null,
    costiPacchetti: eventoApi['costi-pacchetti-evento']
      ? stripHtml(eventoApi['costi-pacchetti-evento'])
      : null,
    prezzoMinimo: eventoApi['costi-formule-a-partire-da'] || null,
    stato,
    note: eventoApi['note-evento']
      ? stripHtml(eventoApi['note-evento'])
      : null,
  };
};

export const fetchEventi = async (giorno?: string): Promise<Evento[]> => {
  try {
    let url = `${API_BASE_URL}/attivi`;
    if (giorno) {
      url += `?giorno=${giorno}`;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EventoAPI[] = await response.json();

    // Trasforma, filtra eventi attivi e ordina per giorno
    const eventi = data
      .map(trasformaEvento)
      .filter(evento => evento.stato.includes('attivo'));

    return ordinaPerGiorno(eventi);
  } catch (error) {
    console.error('Errore nel caricamento eventi:', error);
    throw error;
  }
};

export const fetchEventoById = async (id: number): Promise<Evento | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/attivi`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: EventoAPI[] = await response.json();
    const eventoApi = data.find(e => e.ID === id);

    if (!eventoApi) {
      return null;
    }

    return trasformaEvento(eventoApi);
  } catch (error) {
    console.error('Errore nel caricamento evento:', error);
    return null;
  }
};

// Filtra eventi per giorno della settimana
export const fetchEventiPerGiorno = async (giorno: string): Promise<Evento[]> => {
  return fetchEventi(giorno.toLowerCase());
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
