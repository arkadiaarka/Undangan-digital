import {data} from "../assets/data/data.js";
import { addClassElement, removeClassElement } from "../utils/helper.js"; // Import helper functions

export const galeri = () => {
    const galeriElement = document.querySelector('.galeri');
    const showAllContainer = galeriElement.querySelector('div:nth-of-type(2)');

    const [_, figureElement, paginationElement, prevButton, nextButton, showAllButton] = galeriElement.children[0].children;
    const [__, showAllBox, closeButton] = showAllContainer.children;

    let currentImageIndex = 0; // Menggunakan indeks untuk melacak gambar saat ini

    const initializeGallery = () => {
        // Render semua gambar ke dalam figureElement dengan class untuk mengontrol visibilitas
        figureElement.innerHTML = data.galeri.map((item, index) =>
            `<img src="${item.image}" alt="galeri image ${index + 1}" id="galeri-img-${item.id}" class="${index === 0 ? 'active' : ''}">`
        ).join('');

        // Render pagination dots
        paginationElement.innerHTML = data.galeri.map((item, index) =>
            `<li data-id="${item.id}" data-index="${index}" class="${index === 0 ? 'active' : ''}"></li>`
        ).join('');

        updateNavigationButtons(data.galeri[currentImageIndex].id);
    };

    const updateGalleryImage = (newIndex) => {
        // Pastikan indeks dalam batas yang valid
        if (newIndex < 0) {
            newIndex = data.galeri.length - 1; // Kembali ke gambar terakhir
        } else if (newIndex >= data.galeri.length) {
            newIndex = 0; // Kembali ke gambar pertama
        }

        const currentActiveImage = figureElement.querySelector('img.active');
        if (currentActiveImage) {
            removeClassElement(currentActiveImage, 'active');
        }

        const nextImage = figureElement.querySelector(`img[data-id="${data.galeri[newIndex].id}"]`) || figureElement.children[newIndex];
        if (nextImage) {
            addClassElement(nextImage, 'active');
        }
        
        // Update pagination dots
        paginationElement.querySelectorAll('li').forEach((li, index) => {
            if (index === newIndex) {
                addClassElement(li, 'active');
            } else {
                removeClassElement(li, 'active');
            }
        });

        currentImageIndex = newIndex; // Perbarui indeks gambar saat ini
        updateNavigationButtons(data.galeri[currentImageIndex].id);
    };

    const updateNavigationButtons = (id) => {
        // Mengatur data-id pada tombol prev/next berdasarkan id gambar yang aktif saat ini
        const currentIndex = data.galeri.findIndex(item => item.id === id);
        
        const nextId = (currentIndex < data.galeri.length - 1) ? data.galeri[currentIndex + 1].id : data.galeri[0].id;
        const prevId = (currentIndex > 0) ? data.galeri[currentIndex - 1].id : data.galeri[data.galeri.length - 1].id;

        nextButton.dataset.id = `${nextId}`;
        prevButton.dataset.id = `${prevId}`;
    };

    const autoPlayGallery = () => {
        let nextIndex = currentImageIndex + 1;
        updateGalleryImage(nextIndex); // updateGalleryImage akan menangani perulangan
    };

    // Event Listeners untuk tombol navigasi
    nextButton.addEventListener('click', () => {
        updateGalleryImage(currentImageIndex + 1);
    });

    prevButton.addEventListener('click', () => {
        updateGalleryImage(currentImageIndex - 1);
    });

    // Event Listener untuk pagination dots
    paginationElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const newIndex = parseInt(e.target.dataset.index);
            updateGalleryImage(newIndex);
        }
    });

    // Lazy Loading untuk "Lihat semua foto"
    const lazyLoadGalleryImages = (container) => {
        const images = container.querySelectorAll('img[data-src]');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            observer.observe(img);
        });
    };

    showAllButton.addEventListener('click', () => {
        // Gunakan data-src untuk lazy loading
        showAllBox.innerHTML = data.galeri.map(item => `<img data-src="${item.image}" alt="image galeri">`).join('');
        addClassElement(showAllContainer, 'active');
        lazyLoadGalleryImages(showAllBox); // Panggil fungsi lazy load
    });

    closeButton.addEventListener('click', () => {
        showAllBox.innerHTML = ''; // Hapus gambar saat ditutup
        removeClassElement(showAllContainer, 'active');
    });

    initializeGallery();
    setInterval(autoPlayGallery, 3000); // Auto play setiap 3 detik
};