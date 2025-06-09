// src/js/welcome.js

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
    const {L: {name: brideLName}, P: {name: bridePName}, couple: coupleImage} = bride;
    return `
        <img src="${coupleImage}" alt="couple animation">
        <figcaption>
          <div class="brideLName">${brideLName}</div>
          <div class="ampersand">&amp;</div>
          <div class="bridePName">${bridePName}</div>
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

        audioMusic.src = data.audio;
        audioMusic.type = 'audio/mp3';

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

    openWeddingButton.addEventListener('click', () => {
        addClassElement(document.body, 'active');
        addClassElement(welcomeElement, 'hide');

        setTimeout(() => {
            addClassElement(homeElement, 'active');
            addClassElement(navbarElement, 'active');
            addClassElement(audioButton, 'show');
            removeClassElement(iconButton, 'bx-play-circle');
            addClassElement(iconButton, 'bx-pause-circle');

            setTimeout(() => {
                audioMusic.play();
            }, 100);

            if (attendancePopupOverlay) {
                 addClassElement(attendancePopupOverlay, 'active');
            } else {
                console.error("Elemen attendancePopupOverlay tidak ditemukan!");
            }

        }, 1500);

        setTimeout(() => {
            addClassElement(audioButton, 'active');
        }, 3000);
    });

    const sendAttendanceConfirmation = async (status) => {
        const guestName = nameInput ? nameInput.value : 'Tamu Anonim';
        const confirmationMessage = status === 'y' ? 'Konfirmasi Hadir' : 'Konfirmasi Tidak Hadir';

        const attendanceData = {
            id: generateRandomId(),
            name: guestName,
            status: status === 'y' ? 'Hadir' : 'Tidak Hadir',
            message: confirmationMessage,
            date: getCurrentDateTime(),
            color: generateRandomColor(),
        };

        try {
            const response = await comentarService.addComentar(attendanceData);
            console.log('Konfirmasi kehadiran terkirim:', response);

        } catch (error) {
            console.error('Error saat mengirim konfirmasi kehadiran:', error);
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

    const initializeWelcome = () => {
        figureElement.innerHTML = generateFigureContent(data.bride);
        generateParameterContent();
        addClassElement(welcomeElement, 'active');
    }

    initializeWelcome();
    initialAudio();
}