// src/services/comentarService.js
import {data} from "../assets/data/data.js";

export const comentarService = {
    getComentar: async function () {
        try {
            const response = await fetch(data.api);
            if (!response.ok) { // Tambahkan cek ini juga untuk doGet
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                // Jika doGet juga bisa mengembalikan non-JSON, kita bisa return struktur default
                // Atau lempar error jika Apps Script selalu diharapkan mengembalikan JSON.
                // Untuk amannya, asumsikan respons non-JSON berarti ada masalah jika bukan JSON.
                throw new Error('Expected JSON response from doGet, but received non-JSON.');
            }
        } catch (error) {
            console.error('Fetch error in getComentar:', error); // Log error spesifik
            return {error: error.message || 'Unknown error fetching comments'};
        }
    },

    addComentar: async function ({id, name, status, message, date, color}) {
        const payload = { // <-- Ganti nama variabel dari 'comentar' menjadi 'payload' untuk menghindari potensi konflik atau kebingungan
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
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload), // <-- Gunakan 'payload' di sini
            });

            if (!response.ok) {
                // Cobalah membaca respons error dari Apps Script jika ada
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}. Details: ${errorText}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                // Jika Apps Script berhasil menambahkan data tetapi tidak mengembalikan JSON,
                // ini adalah respons yang valid untuk mode 'cors'
                return { status: response.status, message: 'Data berhasil ditambahkan/diperbarui (Apps Script response non-JSON)' };
            }

        } catch (error) {
            // Ini adalah baris 33 (jika tidak ada perubahan baris di atasnya)
            console.error('Post error in addComentar (comentarService):', error);
            // Pastikan kita mengembalikan objek error yang valid
            return {error: error.message || 'Unknown error adding comment'};
        }
    },
};