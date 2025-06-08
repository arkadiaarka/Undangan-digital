export const data = {
    bride: {
        L: {
            id: 1,
            name: 'Muhammad Arief Syafrudin',
            shortName: 'Arief',
            child: 'Putra Pertama',
            father: 'Shodikin',
            mother: 'Makrisah',
            image: './src/assets/images/cowo.png'
        },
        P: {
            id: 2,
            name: 'Nur Azizah',
            shortName: 'Azizah',
            child: 'Putri Pertama',
            father: 'Mustofa',
            mother: 'Titik Khumaidah',
            image: './src/assets/images/cewe.png'
        },

        couple: './src/assets/images/couple.png'
    },

    time: {
        marriage: {
            year: '2025',
            month: 'Agustus',
            date: '13',
            day: 'Rabu',
            hours: {
                start: '08.00',
                finish: 'Selesai'
            }
        },
        reception: {
            year: '2025',
            month: 'Agustus',
            date: '13',
            day: 'Rabu',
            hours: {
                start: '11.00',
                finish: 'Selesai'
            }
        },
        address: 'Jl Raya Bugel, RT 05/ RW 02, Kedung, Bugel, Kedung, Jepara'
    },

    link: {
        calendar: 'https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NDc3NWtndTR1aDQ3YjRvN2I3MDY1YjFjN2ogc3lhZnJ1ZGluYXJpZWYxODJAbQ&tmsrc=syafrudinarief182%40gmail.com',
        map: 'https://maps.app.goo.gl/af9YXXXx5Lm3M6QXA',
    },

    galeri: [
        {
            id: 1,
            image: './src/assets/images/1.png'
        },
        {
            id: 2,
            image: './src/assets/images/2.png'
        },
        {
            id: 3,
            image: './src/assets/images/3.png'
        },
        {
            id: 4,
            image: './src/assets/images/4.png'
        },
        {
            id: 5,
            image: './src/assets/images/5.png'
        }
    ],

    bank: [
        {
            id: 1,
            name: 'Nur Azizah',
            icon: './src/assets/images/mandiri.png',
            rekening: '1840005464480'
        },
        {
            id: 2,
            name: 'Nur Azizah',
            icon: './src/assets/images/seabank.png',
            rekening: '901576398682'
        },
    ],

    audio: './src/assets/audio/wedding.mp3',

    api: 'https://script.google.com/macros/s/AKfycbwkTKvbrzKrp7NRUnSh37vJ8WsNui2ctveUd_TpECHMQbjVLJgGDfKeIe_SORtMYw6_/exec',

    navbar: [
        {
            id: 1,
            teks: 'Home',
            icon: 'bx bxs-home-heart',
            path: '#home',
        },
        {
            id: 2,
            teks: 'Mempelai',
            icon: 'bx bxs-group',
            path: '#bride',
        },
        {
            id: 3,
            teks: 'Tanggal',
            icon: 'bx bxs-calendar-check',
            path: '#time',
        },
        {
            id: 4,
            teks: 'Galeri',
            icon: 'bx bxs-photo-album',
            path: '#galeri',
        },
        {
            id: 5,
            teks: 'Ucapan',
            icon: 'bx bxs-message-rounded-dots',
            path: '#wishas',
        },
    ],
}
