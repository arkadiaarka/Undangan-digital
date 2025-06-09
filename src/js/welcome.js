// src/js/welcome.js
import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement} from "../utils/helper.js";
// Hapus import yang tidak digunakan jika kita tidak mengirim data ke GS dulu dari sini
// import { generateRandomId, generateRandomColor, getCurrentDateTime } from "../utils/helper.js";
// import { comentarService } from "../services/comentarService.js";


export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');
    const attendancePopupOverlay = document.querySelector('.attendance-popup-overlay');
    const confirmHadirButton = document.querySelector('#confirm-hadir');
    const confirmTidakHadirButton = document.querySelector('#confirm-tidak-hadir');

    const nameInput = document.querySelector('#name');


    // --- START PERUBAHAN PENTING (Memperbaiki ReferenceError dan Mendefinisikan Elemen) ---
    // Definisikan elemen-elemen ini secara eksplisit di awal fungsi welcome()
    // Ini memperbaiki error `figureElement is not defined`
    const figureElement = welcomeElement.querySelector('figure');
    const weddingToElement = welcomeElement.querySelector('p');
    const openWeddingButton = welcomeElement.querySelector('button[aria-label="Buka Undangan"]');
    // --- AKHIR PERUBAHAN PENTING ---

    const [audioMusic, audioButton] = document.querySelector('.audio').children;
    const [iconButton] = audioButton.children;


   const generateFigureContent = (bride) => {
    const {L, P, couple: coupleImage} = bride; // Ambil objek L dan P langsung
    // --- START PERUBAHAN NAMA PANGGILAN (Welcome Screen) ---
    // Gunakan shortName yang baru dari data.js dan jadikan kapital
    const shortBrideLName = L.shortName;
    const shortBridePName = P.shortName;
    // --- AKHIR PERUBAHAN NAMA PANGGILAN ---
    return `
        <img src="${coupleImage}" alt="couple animation">
        <figcaption>
          <div class="brideLName">${shortBrideLName}</div>
          <div class="ampersand">&amp;</div>
          <div class="bridePName">${shortBridePName}</div>
        </figcaption>`;
};

    const generateParameterContent = () => {
        const params = getQueryParameter('to');

        if (params) {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>${params}</span>`;
            if (nameInput) {
                 nameInput.value = params;
            }
        } else {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>Teman-teman semua</span>`;
            if (nameInput) {
                nameInput.value = 'Teman-teman semua';
            }
        }
    }

    const initialAudio = () => {
        let isPlaying = false;

        // --- START PERUBAHAN AUDIO LOAD (dari perbaikan sebelumnya) ---
        audioMusic.src = data.audio; // Ganti ini dari innerHTML
        audioMusic.type = 'audio/mp3'; // Tambahkan ini
        audioMusic.load(); // Tambahkan ini untuk preload
        // --- AKHIR PERUBAHAN AUDIO LOAD ---

        audioButton.addEventListener('click', () => {
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

    // --- START PERUBAHAN LOGIKA openWeddingButton (Kontrol Popup, Scroll, Audio) ---
    if (openWeddingButton) { // Pastikan tombol ditemukan
        openWeddingButton.addEventListener('click', () => {
            addClassElement(document.body, 'active');
            addClassElement(welcomeElement, 'hide');

            setTimeout(() => {
                addClassElement(homeElement, 'active');
                addClassElement(navbarElement, 'active');
                addClassElement(audioButton, 'show');
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');

                // Kontrol scrolling dan audio di sini
                addClassElement(document.body, 'popup-active'); // Nonaktifkan scrolling
                audioMusic.pause(); // Pastikan musik berhenti/tidak mulai

                if (attendancePopupOverlay) {
                    addClassElement(attendancePopupOverlay, 'active'); // Tampilkan popup
                } else {
                    console.error("Elemen attendancePopupOverlay tidak ditemukan!");
                }
            }, 1500);

            setTimeout(() => {
                addClassElement(audioButton, 'active');
            }, 3000);
        });
    } else {
        console.error("Tombol 'Buka Undangan' tidak ditemukan di welcome screen.");
    }
    // --- AKHIR PERUBAHAN LOGIKA openWeddingButton ---


    // Fungsi handleInvitationOpen yang disederhanakan (karena tidak ada GS submit dari sini dulu)
    const handleInvitationOpen = () => {
        addClassElement(document.body, 'active');
        addClassElement(welcomeElement, 'hide');

        setTimeout(() => {
            addClassElement(homeElement, 'active');
            addClassElement(navbarElement, 'active');
            addClassElement(audioButton, 'show');
            removeClassElement(iconButton, 'bx-play-circle');
            addClassElement(iconButton, 'bx-pause-circle');
            // audioMusic.play(); // Dihapus dari sini, dipindahkan ke confirm buttons
        }, 1500);

        setTimeout(() => {
            addClassElement(audioButton, 'active');
        }, 3000);
    };

    // --- START PERUBAHAN LOGIKA CONFIRM BUTTONS (Kontrol Popup, Scroll, Audio) ---
    if (confirmHadirButton) {
        confirmHadirButton.addEventListener('click', () => { // Tidak perlu async jika tidak memanggil GS
            removeClassElement(attendancePopupOverlay, 'active');

            audioMusic.play(); // Mainkan musik
            removeClassElement(document.body, 'popup-active'); // Aktifkan scrolling

            handleInvitationOpen(); // Lanjutkan ke halaman utama

            const statusSelect = document.querySelector('#status');
            if (statusSelect) {
                statusSelect.value = 'y';
            }
        });
    }

    if (confirmTidakHadirButton) {
        confirmTidakHadirButton.addEventListener('click', () => { // Tidak perlu async jika tidak memanggil GS
            removeClassElement(attendancePopupOverlay, 'active');

            audioMusic.play(); // Mainkan musik
            removeClassElement(document.body, 'popup-active'); // Aktifkan scrolling

            handleInvitationOpen(); // Lanjutkan ke halaman utama

            const statusSelect = document.querySelector('#status');
            if (statusSelect) {
                statusSelect.value = 'n';
            }
        });
    }
    // --- AKHIR PERUBAHAN LOGIKA CONFIRM BUTTONS ---


    const initializeWelcome = () => {
        // Hapus atau abaikan baris ini karena figureElement dan weddingToElement sudah didefinisikan di awal fungsi welcome()
        // const weddingToElement = document.querySelector('.welcome p');
        figureElement.innerHTML = generateFigureContent(data.bride);
        // generateParameterContent(weddingToElement); // weddingToElement sudah di scope atas, tidak perlu argumen
        generateParameterContent(); // Panggil tanpa argumen jika weddingToElement sudah di scope welcome()
        addClassElement(welcomeElement, 'active');
    }

    initializeWelcome();
    initialAudio();
}