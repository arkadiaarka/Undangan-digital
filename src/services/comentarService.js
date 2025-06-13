// src/services/comentarService.js
import {data} from "../assets/data/data.js";

export const comentarService = {
    getComentar: async function () {
        try {
            const response = await fetch(data.api);
            return await response.json();
        } catch (error) {
            return {error: error && error.message};
        }
    },

    addComentar: async function ({id, name, status, message, date, color}) {
        const comentar = {
            id: id,
            name: name,
            status: status,
            message: message,
            date: date,
            color: color,
        };

        try {
            const response = await fetch(data.api, {
                method: 'POST',
                mode: 'no-cors', // Penting: Mode ini mencegah membaca response body
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(comentar),
            });

            // *** PERUBAHAN DI SINI ***
            // Karena mode: 'no-cors', kita tidak bisa membaca response.json()
            // Kita hanya bisa berasumsi berhasil jika tidak ada network error.
            // Google Apps Script akan tetap menerima data meskipun kita tidak membaca responsenya.
            return { status: 'success', message: 'Data sent (response not readable due to no-cors)' };

        } catch (error) {
            console.error('Post error:', error);
            return {error: error.message};
        }
    },
};