const { createCalendar, viewWeek } = window.SXCalendar;
const { createDragAndDropPlugin } = window.SXDragAndDrop;
const { createResizePlugin } = window.SXResize;

// Funzione per caricare gli eventi
async function loadEvents() {
  try {
    const response = await fetch('../data/events.json');
    const data = await response.json();
    return data.events;
  } catch (error) {
    console.error('Errore nel caricamento degli eventi:', error);
    return [];
  }
}

// Funzione principale asincrona
async function initCalendar() {
  const events = await loadEvents();

  const config = {
    locale: 'it-IT',
    firstDayOfWeek: 1,
    isDark: false,
    dayBoundaries: {
      start: '07:00',
      end: '19:00',
    },
    views: [viewWeek],
    weekOptions: {
      gridHeight: 570,
      timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
    },
    events: events // Usa gli eventi caricati dal JSON
  };

  const plugins = [
    createDragAndDropPlugin(15),
    createResizePlugin()
  ];

  const calendar = createCalendar(config, plugins);
  calendar.render(document.querySelector('.calendar'));
}

// Avvia l'inizializzazione del calendario
initCalendar();