// src/js/welcome.js (Pastikan ini adalah versi terakhir yang saya berikan)
import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement} from "../utils/helper.js";
import { generateRandomId, generateRandomColor, getCurrentDateTime } from "../utils/helper.js";
import { comentarService } from "../services/comentarService.js";


export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');
    const attendancePopupOverlay = document.querySelector('.attendance-popup-overlay');
    const confirmHadirButton = document.querySelector('#confirm-hadir');
    const confirmTidakHadirButton = document.querySelector('#confirm-tidak-hadir');

    const nameInput = document.querySelector('#name');


    const [_, figureElement, weddingToElement, openWeddingButton] = welcomeElement.children;
    const [audioMusic, audioButton] = document.querySelector('.audio').children;
    const [iconButton] = audioButton.children;

   const generateFigureContent = (bride) => {
    const {L, P, couple: coupleImage} = bride;
    const shortBrideLName = L.shortName;
    const shortBridePName = P.shortName;
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
        let isPlaying = false; // Initial state: not playing

        audioMusic.src = data.audio;
        audioMusic.type = 'audio/mp3';
        audioMusic.load(); // Memuat audio lebih awal
        audioMusic.volume = 0.7; // Opsional: Atur volume
        
        // Pastikan tombol audio ditampilkan tetapi tidak aktif (tidak berputar)
        addClassElement(audioButton, 'show');
        removeClassElement(iconButton, 'bx-pause-circle');
        addClassElement(iconButton, 'bx-play-circle');
        removeClassElement(audioButton, 'active'); // Pastikan tidak ada animasi berputar di awal

        audioButton.addEventListener('click', () => {
            if (isPlaying) {
                removeClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-pause-circle');
                addClassElement(iconButton, 'bx-play-circle');
                audioMusic.pause();
            } else {
                addClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');
                audioMusic.play();
            }
            isPlaying = !isPlaying;
        });
    };

    openWeddingButton.addEventListener('click', () => {
        addClassElement(document.body, 'active');
        addClassElement(welcomeElement, 'hide');

        setTimeout(() => {
            addClassElement(homeElement, 'active');
            addClassElement(navbarElement, 'active');

            if (attendancePopupOverlay) {
                 addClassElement(attendancePopupOverlay, 'active');
                 addClassElement(document.body, 'popup-active');
                 // Audio tetap di-pause saat popup muncul
                 audioMusic.pause();
                 removeClassElement(audioButton, 'active'); // Pastikan tidak berputar
                 removeClassElement(iconButton, 'bx-pause-circle');
                 addClassElement(iconButton, 'bx-play-circle');
            } else {
                console.error("Elemen attendancePopupOverlay tidak ditemukan!");
            }
        }, 1500);
    });

    const sendAttendanceConfirmation = async (status) => {
        const guestName = nameInput ? nameInput.value : 'Tamu Anonim';
        const confirmationMessage = status === 'y' ? 'Konfirmasi Hadir' : 'Konfirmasi Tidak Hadir';

        const attendanceData = {
            id: generateRandomId(),
            name: guestName,
            status: status === 'y' ? 'Hadir' : 'Tidak Hadir',
            message: '',
            date: getCurrentDateTime(),
            color: generateRandomColor(),
        };

        try {
            // Panggil addComentar, yang sekarang tidak akan mencoba mem-parse JSON
            const response = await comentarService.addComentar(attendanceData);
            console.log('Konfirmasi kehadiran terkirim:', response); // Log ini sekarang akan menunjukkan {status: 'success', ...}
        } catch (error) {
            console.error('Error saat mengirim konfirmasi kehadiran:', error);
        }
    };


    if (confirmHadirButton) {
        confirmHadirButton.addEventListener('click', async () => {
            removeClassElement(attendancePopupOverlay, 'active');
            removeClassElement(document.body, 'popup-active');

            await sendAttendanceConfirmation('y');

            const statusSelect = document.querySelector('#status');
            if (statusSelect) {
                statusSelect.value = 'y';
            }

            // Putar audio segera setelah popup ditutup dan konfirmasi dikirim
            try {
                audioMusic.currentTime = 0; // Pastikan mulai dari awal
                await audioMusic.play(); // Gunakan await untuk play()
                addClassElement(audioButton, 'active'); // Mulai animasi berputar
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');
            } catch (error) {
                console.error("Autoplay prevented or other audio error:", error);
                // Jika autoplay gagal, tombol tetap menunjukkan play, user bisa klik manual
                removeClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-pause-circle');
                addClassElement(iconButton, 'bx-play-circle');
            }
        });
    }

    if (confirmTidakHadirButton) {
        confirmTidakHadirButton.addEventListener('click', async () => {
            removeClassElement(attendancePopupOverlay, 'active');
            removeClassElement(document.body, 'popup-active');

            await sendAttendanceConfirmation('n');

            const statusSelect = document.querySelector('#status');
            if (statusSelect) {
                statusSelect.value = 'n';
            }

            // Putar audio segera setelah popup ditutup dan konfirmasi dikirim
            try {
                audioMusic.currentTime = 0; // Pastikan mulai dari awal
                await audioMusic.play(); // Gunakan await untuk play()
                addClassElement(audioButton, 'active'); // Mulai animasi berputar
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');
            } catch (error) {
                console.error("Autoplay prevented or other audio error:", error);
                // Jika autoplay gagal, tombol tetap menunjukkan play, user bisa klik manual
                removeClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-pause-circle');
                addClassElement(iconButton, 'bx-play-circle');
            }
        });
    }

    const initializeWelcome = () => {
        figureElement.innerHTML = generateFigureContent(data.bride);
        generateParameterContent();
        addClassElement(welcomeElement, 'active');
    }

    initializeWelcome();
    initialAudio();
}