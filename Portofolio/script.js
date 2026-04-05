// BAGIAN 1: SCRIPT FORM EMAIL (MISSION BRIEFING)
var form = document.getElementById("my-form");
async function handleSubmit(event) {
    event.preventDefault();
    var status = document.getElementById("my-form-status");
    var data = new FormData(event.target);
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "MISSION TRANSMITTED SUCCESSFULLY!";
            status.classList.add("text-green-500");
            form.reset();
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "TRANSMISSION FAILED. TRY AGAIN.";
                }
            });
        }
    }).catch(error => {
        status.innerHTML = "CONNECTION ERROR. MISSION ABORTED.";
    });
}
if(form) {
    form.addEventListener("submit", handleSubmit);
}

// BAGIAN 2: SCRIPT ANIMASI SCROLL & FADE-IN
document.addEventListener("DOMContentLoaded", function() {
    
    // SCROLL CAROUSEL SCRIPT UNTUK SEMUA SLIDER
    const carousels = document.querySelectorAll('.character-slider');
    
    carousels.forEach(carousel => {
        let isAutoScrolling = true;
        let scrollDirection = 1; 
        
        carousel.style.scrollBehavior = 'auto';
        carousel.style.scrollSnapType = 'none';
        
        function autoScroll() {
            if (!isAutoScrolling) return;
            carousel.scrollLeft += 3.5 * scrollDirection; 
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2) {
                scrollDirection = -1;
            }
            if (carousel.scrollLeft <= 0) {
                scrollDirection = 1;
            }
        }

        setInterval(autoScroll, 20); 

        carousel.addEventListener('mouseenter', () => { 
            isAutoScrolling = false; 
            carousel.style.scrollSnapType = 'x mandatory'; 
        });
        carousel.addEventListener('mouseleave', () => { 
            isAutoScrolling = true; 
            carousel.style.scrollSnapType = 'none'; 
        });
        
        carousel.addEventListener('touchstart', () => { 
            isAutoScrolling = false; 
            carousel.style.scrollSnapType = 'x mandatory';
        });
        carousel.addEventListener('touchend', () => { 
            setTimeout(() => { 
                isAutoScrolling = true; 
                carousel.style.scrollSnapType = 'none';
            }, 1000); 
        });
    });

    // FADE-IN ON SCROLL SCRIPT
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-section');
    fadeElements.forEach((el) => {
        observer.observe(el);
    });
});

// BAGIAN 3: SCRIPT LIGHTBOX / POP-UP MEDIA
document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.getElementById('lightbox-close');

    if(modal) {
        function openLightbox(src, isVideo) {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.remove('opacity-0'), 10);
            
            if (isVideo) {
                lightboxImg.classList.add('hidden');
                lightboxVideo.classList.remove('hidden');
                lightboxVideo.src = src;
                lightboxVideo.play();
            } else {
                lightboxVideo.classList.add('hidden');
                lightboxVideo.pause();
                lightboxVideo.src = '';
                lightboxImg.classList.remove('hidden');
                lightboxImg.src = src;
            }
            document.body.style.overflow = 'hidden'; 
        }

        function closeLightbox() {
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
                lightboxVideo.pause();
                lightboxVideo.src = '';
                lightboxImg.src = '';
                document.body.style.overflow = 'auto'; 
            }, 300);
        }

        // Nangkap klik di semua kartu gambar/video
        document.addEventListener('click', function(e) {
            const targetCard = e.target.closest('.char-card, .bg-black.border-gray-800, .w-32.h-32');
            
            if (targetCard) {
                // Abaikan kalau yang diklik itu tombol link (misal IG/Tiktok)
                if (targetCard.tagName.toLowerCase() === 'a' || e.target.closest('a, button, form')) return;

                const img = targetCard.querySelector('img');
                const video = targetCard.querySelector('video');

                if (img || video) {
                    e.preventDefault();
                    let src = '';
                    let isVideo = false;

                    if (video) {
                        isVideo = true;
                        const sourceTag = video.querySelector('source');
                        src = sourceTag ? sourceTag.src : video.src;
                    } else if (img) {
                        src = img.src;
                    }

                    if (src) {
                        openLightbox(src, isVideo);
                    }
                }
            }
        });

        // Bikin kursor jadi tanda plus (zoom) pas di-hover
        document.querySelectorAll('.char-card, .bg-black.border-gray-800, .w-32.h-32').forEach(el => {
            if((el.querySelector('img') || el.querySelector('video')) && el.tagName.toLowerCase() !== 'a') {
                el.style.cursor = 'zoom-in';
            }
        });

        // Fungsi tutup modal (klik tombol X atau background)
        closeBtn.addEventListener('click', closeLightbox);
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.id === 'lightbox-content') {
                closeLightbox();
            }
        });

        // Tutup modal pakai tombol ESC di keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeLightbox();
            }
        });
    }
});