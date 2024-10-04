const { createCalendar, viewWeek } = window.SXCalendar;
const { createDragAndDropPlugin } = window.SXDragAndDrop;
const { createResizePlugin } = window.SXResize

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
        /**
        * The total height in px of the week grid (week- and day views)
        * */
        gridHeight: 570,

        /**
        * Intl.DateTimeFormatOptions used to format the hour labels on the time axis
        * Default: { hour: 'numeric' }
        */
        timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' },
    },

    events: [
        {
            id: '1',
            title: 'Migliorare front-end',
            location: 'Online',
            people: ['Lorenzo', 'Emanuele'],
            start: '2024-10-03 09:00',
            end: '2024-10-03 10:00'
        },
        {
            id: '2',
            title: 'Sviluppo algoritmo opt',
            location: 'Online',
            people: ['Donato'],
            start: '2024-10-02 15:00',
            end: '2024-10-02 17:00'
        },
        {
            id: '3',
            title: 'Collaudo nuova droga',
            location: 'Salerno',
            people: ['Andrea'],
            start: '2024-10-03 09:30',
            end: '2024-10-03 10:00'
        },
    ]
}

const plugins = [
    createDragAndDropPlugin(15),
    createResizePlugin()
]

const calendar = createCalendar(config, plugins)

calendar.render(document.querySelector('.calendar'))