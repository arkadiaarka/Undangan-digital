// src/js/welcome.js
import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement, generateRandomId, generateRandomColor, getCurrentDateTime} from "../utils/helper.js"; // Memastikan semua helper yang dibutuhkan diimpor
import {comentarService} from "../services/comentarService.js"; // Mengimpor comentarService Anda


export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');
    const attendancePopupOverlay = document.querySelector('.attendance-popup-overlay');
    const confirmHadirButton = document.querySelector('#confirm-hadir');
    const confirmTidakHadirButton = document.querySelector('#confirm-tidak-hadir');

    const nameInput = document.querySelector('#name');


    // Definisikan elemen-elemen ini secara eksplisit di awal fungsi welcome()
    const figureElement = welcomeElement.querySelector('figure');
    const weddingToElement = welcomeElement.querySelector('p');
    const openWeddingButton = welcomeElement.querySelector('button[aria-label="Buka Undangan"]');


    const [audioMusic, audioButton] = document.querySelector('.audio').children;
    const [iconButton] = audioButton.children;


   const generateFigureContent = (bride) => {
    const {L, P, couple: coupleImage} = bride;
    const shortBrideLName = L.shortName; // Cukup L.shortName
    const shortBridePName = P.shortName; // Cukup P.shortName
    return `
        <img src="${coupleImage}" alt="couple animation">
        <figcaption>
          <div class="brideLName">${shortBrideLName}</div>
          <div class="ampersand">&amp;</div>
          <div class="bridePName">${shortBridePName}</div>
        </figcaption>`;
};

    const generateParameterContent = () => {
        const params = getQueryParameter('to'); // Mengambil parameter 'to' dari URL

        if (params) {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>${params}</span>`;
            if (nameInput) {
                 nameInput.value = params; // Mengisi input nama dengan parameter jika ada
            }
        } else {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>Teman-teman semua</span>`;
            if (nameInput) {
                nameInput.value = 'Teman-teman semua'; // Mengisi default jika tidak ada parameter
            }
        }
    }

    const initialAudio = () => {
        let isPlaying = false;

        audioMusic.src = data.audio; // Menentukan sumber audio
        audioMusic.type = 'audio/mp3'; // Menentukan tipe audio
        audioMusic.load(); // Memuat audio

        audioButton.addEventListener('click', () => { // Menambahkan event listener untuk tombol audio
            if (isPlaying) {
                addClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');
                audioMusic.play();
            } else {
                removeClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-pause-circle');
                addClassElement(iconButton, 'bx-play-circle');
                audioMusic.pause();
            }
            isPlaying = !isPlaying;
        });
    };

    if (openWeddingButton) { // Memastikan tombol ditemukan
        openWeddingButton.addEventListener('click', () => { // Menambahkan event listener ke tombol "Buka Undangan"
            addClassElement(document.body, 'active'); // Menambahkan kelas 'active' ke body
            addClassElement(welcomeElement, 'hide'); // Menambahkan kelas 'hide' ke elemen welcome

            setTimeout(() => {
                addClassElement(homeElement, 'active'); // Menambahkan kelas 'active' ke elemen home
                addClassElement(navbarElement, 'active'); // Menambahkan kelas 'active' ke elemen navbar
                addClassElement(audioButton, 'show'); // Menambahkan kelas 'show' ke tombol audio
                removeClassElement(iconButton, 'bx-play-circle'); // Mengganti ikon tombol audio
                addClassElement(iconButton, 'bx-pause-circle'); // Mengganti ikon tombol audio

                addClassElement(document.body, 'popup-active'); // Nonaktifkan scrolling
                audioMusic.pause(); // Pastikan musik berhenti/tidak mulai

                if (attendancePopupOverlay) {
                    addClassElement(attendancePopupOverlay, 'active'); // Tampilkan popup
                } else {
                    console.error("Elemen attendancePopupOverlay tidak ditemukan!"); // Log error jika elemen tidak ditemukan
                }
            }, 1500);

            setTimeout(() => {
                addClassElement(audioButton, 'active');
            }, 3000);
        });
    } else {
        console.error("Tombol 'Buka Undangan' tidak ditemukan di welcome screen."); // Log error jika tombol tidak ditemukan
    }

    const handleInvitationOpen = () => {
        addClassElement(document.body, 'active'); // Menambahkan kelas 'active' ke body
        addClassElement(welcomeElement, 'hide'); // Menambahkan kelas 'hide' ke elemen welcome

        setTimeout(() => {
            addClassElement(homeElement, 'active'); // Menambahkan kelas 'active' ke elemen home
            addClassElement(navbarElement, 'active'); // Menambahkan kelas 'active' ke elemen navbar
            addClassElement(audioButton, 'show'); // Menambahkan kelas 'show' ke tombol audio
            removeClassElement(iconButton, 'bx-play-circle'); // Mengganti ikon tombol audio
            addClassElement(iconButton, 'bx-pause-circle'); // Mengganti ikon tombol audio
        }, 1500);

        setTimeout(() => {
            addClassElement(audioButton, 'active');
        }, 3000);
    };

    // --- BARU: Fungsi untuk mengirim data kehadiran ke Google Sheets ---
    const sendAttendance = async (status) => {
        const name = getQueryParameter('to') || 'Teman-teman semua'; // Mendapatkan nama dari parameter URL atau default
        const attendanceData = {
            id: generateRandomId(), // Menggunakan ID acak
            name: name,
            status: status, // Status Hadir/Tidak Hadir
            message: '', // Pesan kosong untuk konfirmasi awal
            date: getCurrentDateTime(), // Waktu saat ini
            color: generateRandomColor(), // Warna acak
        };

        try {
            await comentarService.addComentar(attendanceData); // Mengirim data ke Google Sheets
            console.log('Attendance sent:', attendanceData);
        } catch (error) {
            console.error('Error sending attendance:', error);
        }
    };

    if (confirmHadirButton) {
        confirmHadirButton.addEventListener('click', async () => { // Menambahkan async karena akan memanggil service
            removeClassElement(attendancePopupOverlay, 'active'); // Menyembunyikan popup
            audioMusic.play(); // Memainkan musik
            removeClassElement(document.body, 'popup-active'); // Mengaktifkan scrolling
            handleInvitationOpen(); // Melanjutkan ke halaman utama

            const statusSelect = document.querySelector('#status'); // Mendapatkan elemen select status
            if (statusSelect) {
                statusSelect.value = 'y'; // Mengatur nilai status ke 'y' (Hadir)
            }

            await sendAttendance('Hadir'); // Mengirim status kehadiran "Hadir"
        });
    }

    if (confirmTidakHadirButton) {
        confirmTidakHadirButton.addEventListener('click', async () => { // Menambahkan async karena akan memanggil service
            removeClassElement(attendancePopupOverlay, 'active'); // Menyembunyikan popup
            audioMusic.play(); // Memainkan musik
            removeClassElement(document.body, 'popup-active'); // Mengaktifkan scrolling
            handleInvitationOpen(); // Melanjutkan ke halaman utama

            const statusSelect = document.querySelector('#status'); // Mendapatkan elemen select status
            if (statusSelect) {
                statusSelect.value = 'n'; // Mengatur nilai status ke 'n' (Tidak Hadir)
            }

            await sendAttendance('Tidak Hadir'); // Mengirim status kehadiran "Tidak Hadir"
        });
    }


    const initializeWelcome = () => {
        figureElement.innerHTML = generateFigureContent(data.bride); // Mengisi konten figure
        generateParameterContent(); // Menghasilkan konten parameter
        addClassElement(welcomeElement, 'active'); // Menambahkan kelas 'active' ke elemen welcome
    }

    initializeWelcome();
    initialAudio();
}