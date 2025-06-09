// src/js/welcome.js
import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement} from "../utils/helper.js";
// Impor helper functions yang baru dibutuhkan untuk ID, warna, dan tanggal
import { generateRandomId, generateRandomColor, getCurrentDateTime } from "../utils/helper.js"; //
// Impor comentarService
import { comentarService } from "../services/comentarService.js"; //


export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');
    const attendancePopupOverlay = document.querySelector('.attendance-popup-overlay');
    const confirmHadirButton = document.querySelector('#confirm-hadir');
    const confirmTidakHadirButton = document.querySelector('#confirm-tidak-hadir');

    // Dapatkan elemen input nama yang ada di wishas.js (untuk mengambil nama tamu dari URL)
    const nameInput = document.querySelector('#name'); //


    const [_, figureElement, weddingToElement, openWeddingButton] = welcomeElement.children;
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
        const params = getQueryParameter('to'); //

        if (params) {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>${params}</span>`;
            if (nameInput) { // Pastikan nameInput ada sebelum diakses
                 nameInput.value = params; //
            }
        } else {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>Teman-teman semua</span>`;
            if (nameInput) { // Pastikan nameInput ada sebelum diakses
                nameInput.value = 'Teman-teman semua'; //
            }
        }
    }

    const initialAudio = () => {
        let isPlaying = false;

        audioMusic.src = data.audio; //
        audioMusic.type = 'audio/mp3';

        audioButton.addEventListener('click', () => {
            if (isPlaying) {
                addClassElement(audioButton, 'active'); //
                removeClassElement(iconButton, 'bx-play-circle'); //
                addClassElement(iconButton, 'bx-pause-circle'); //
                audioMusic.play();
            } else {
                removeClassElement(audioButton, 'active'); //
                removeClassElement(iconButton, 'bx-pause-circle'); //
                addClassElement(iconButton, 'bx-play-circle'); //
                audioMusic.pause();
            }
            isPlaying = !isPlaying;
        });
    };

    openWeddingButton.addEventListener('click', () => {
        addClassElement(document.body, 'active'); //
        addClassElement(welcomeElement, 'hide'); //

        setTimeout(() => {
            addClassElement(homeElement, 'active'); //
            addClassElement(navbarElement, 'active'); //
            addClassElement(audioButton, 'show'); //
            removeClassElement(iconButton, 'bx-play-circle'); //
            addClassElement(iconButton, 'bx-pause-circle'); //

            setTimeout(() => {
                audioMusic.play();
            }, 100);

            if (attendancePopupOverlay) {
                 addClassElement(attendancePopupOverlay, 'active'); //
            } else {
                console.error("Elemen attendancePopupOverlay tidak ditemukan!");
            }

        }, 1500);

        setTimeout(() => {
            addClassElement(audioButton, 'active'); //
        }, 3000);
    });

    // --- LOGIKA BARU UNTUK TOMBOL HADIR / TIDAK HADIR ---
    const sendAttendanceConfirmation = async (status) => {
        // Ambil nama tamu dari input #name, gunakan fallback jika kosong
        const guestName = nameInput ? nameInput.value : 'Tamu Anonim'; //
        const confirmationMessage = status === 'y' ? 'Konfirmasi Hadir' : 'Konfirmasi Tidak Hadir';

        const attendanceData = {
            id: generateRandomId(), //
            name: guestName,
            status: status === 'y' ? 'Hadir' : 'Tidak Hadir', // Simpan sebagai 'Hadir' atau 'Tidak Hadir' di Sheets
            message: confirmationMessage,
            date: getCurrentDateTime(), //
            color: generateRandomColor(), //
        };

        try {
            // Panggil API untuk mengirim data
            const response = await comentarService.addComentar(attendanceData); //
            console.log('Konfirmasi kehadiran terkirim:', response);

            // Opsional: Berikan feedback ke user (misal: alert sederhana)
            // if (response.status === 200) { alert('Konfirmasi Anda telah terkirim!'); }
            // else { alert('Gagal mengirim konfirmasi. Silakan coba lagi.'); }

        } catch (error) {
            console.error('Error saat mengirim konfirmasi kehadiran:', error);
            // alert('Terjadi kesalahan. Silakan coba lagi.');
        }
    };


    if (confirmHadirButton) {
        confirmHadirButton.addEventListener('click', async () => {
            // --- PERUBAHAN DI SINI ---
            removeClassElement(attendancePopupOverlay, 'active'); // Popup hilang duluan
            await sendAttendanceConfirmation('y'); // Lalu kirim data di background
            // --- AKHIR PERUBAHAN ---

            const statusSelect = document.querySelector('#status');
            if (statusSelect) {
                statusSelect.value = 'y';
            }
        });
    }

    if (confirmTidakHadirButton) {
        confirmTidakHadirButton.addEventListener('click', async () => {
            // --- PERUBAHAN DI SINI ---
            removeClassElement(attendancePopupOverlay, 'active'); // Popup hilang duluan
            await sendAttendanceConfirmation('n'); // Lalu kirim data di background
            // --- AKHIR PERUBAHAN ---

            const statusSelect = document.querySelector('#status');
            if (statusSelect) {
                statusSelect.value = 'n';
            }
        });
    }
    // --- AKHIR LOGIKA BARU ---


    const initializeWelcome = () => {
        figureElement.innerHTML = generateFigureContent(data.bride); //
        generateParameterContent(); // Ini akan mengatur namaInput.value jika #name ada
        addClassElement(welcomeElement, 'active'); //
    }

    initializeWelcome();
    initialAudio();
}