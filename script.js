// ===================================================
// SAIGON EXPLORER — ULTRA INTERACTIVE JAVASCRIPT V5
// ===================================================

// ===== 1. QUIZ & STAMP DATABASE =====
const quizData = {
    'bach-dang': {
        title: 'Thử Thách: Bến Bạch Đằng',
        subtitle: 'Kiểm tra kiến thức về bến cảng lịch sử sông nước',
        emoji: '🚢',
        stampEmoji: '🚢',
        stampName: 'Bến Bạch Đằng',
        question: 'Bến Bạch Đằng trải dài dọc theo bờ dòng sông nào của TP. Hồ Chí Minh?',
        options: [
            { text: 'A. Sông Sài Gòn', correct: true },
            { text: 'B. Sông Đồng Nai', correct: false },
            { text: 'C. Sông Vàm Cỏ Đông', correct: false },
            { text: 'D. Sông Cần Giờ', correct: false }
        ],
        explanation: 'Chính xác 100%! Bến Bạch Đằng uốn lượn bên dòng sông Sài Gòn thơ mộng, nơi du khách có thể đón tàu buýt sông (Saigon Waterbus) và chiêm ngưỡng toàn cảnh các tòa nhà biểu tượng thành phố.'
    },
    'nguyen-hue': {
        title: 'Thử Thách: Phố Đi Bộ Nguyễn Huệ',
        subtitle: 'Tìm hiểu về đại lộ sầm uất và rực rỡ nhất Sài Gòn',
        emoji: '🎆',
        stampEmoji: '🎆',
        stampName: 'Phố Nguyễn Huệ',
        question: 'Sự kiện văn hóa truyền thống nổi tiếng nhất diễn ra trên phố đi bộ Nguyễn Huệ mỗi dịp Tết Nguyên Đán là gì?',
        options: [
            { text: 'A. Lễ hội thả đèn trời', correct: false },
            { text: 'B. Đường Hoa Nguyễn Huệ', correct: true },
            { text: 'C. Hội thi diều nghệ thuật', correct: false },
            { text: 'D. Lễ hội đua ghe ngo', correct: false }
        ],
        explanation: 'Tuyệt vời! Đường Hoa Nguyễn Huệ là sự kiện văn hóa biểu tượng suốt hơn 20 năm qua mỗi dịp Tết cổ truyền, thu hút hàng triệu du khách đến du xuân và chụp ảnh!'
    },
    'buu-dien': {
        title: 'Thử Thách: Bưu Điện Trung Tâm',
        subtitle: 'Khám phá di sản kiến trúc hơn 135 năm tuổi',
        emoji: '🏛️',
        stampEmoji: '🏛️',
        stampName: 'Bưu Điện Sài Gòn',
        question: 'Công trình Bưu điện Trung tâm Sài Gòn hoàn thành năm 1891 có sự tham gia thiết kế hệ thống vòm sắt thép của kiến trúc sư lừng danh nào?',
        options: [
            { text: 'A. Gustave Eiffel', correct: true },
            { text: 'B. Le Corbusier', correct: false },
            { text: 'C. Antoni Gaudí', correct: false },
            { text: 'D. Frank Lloyd Wright', correct: false }
        ],
        explanation: 'Rất xuất sắc! Kiến trúc sư Gustave Eiffel (người thiết kế Tháp Eiffel tại Paris) đã đích thân tạo nên hệ thống vòm trần sắt nghệ thuật độc nhất vô nhị bên trong đại sảnh Bưu điện!'
    }
};

// Global State
let gameState = {
    collectedStamps: JSON.parse(localStorage.getItem('saigon_explorer_stamps') || '[]'),
    currentQuizKey: null
};

// Lightbox State
let lightboxImages = [];
let currentLightboxIndex = 0;

// Music & Audio State
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initParticles();
    initHeaderScrollSpy();
    initSmoothScroll();
    initCountUp();
    initBackToTop();
    initMobileMenu();
    initParallaxBg();
    initStickerInteraction();
    initLightbox();
    initGalleryFilter();
    initStampCard();
    initBackgroundMusic();
    initConfetti();
    renderStamps();
});

// ===== 2. BACKGROUND GENTLE AMBIENT MUSIC ENGINE (WEB AUDIO API) =====
function initBackgroundMusic() {
    const musicBtn = document.getElementById('musicToggleBtn');
    const musicLabel = document.getElementById('musicLabel');

    function createAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    const chords = [
        [329.63, 392.00, 493.88, 587.33], // Em7 / G
        [293.66, 369.99, 440.00, 587.33], // D add9
        [261.63, 329.63, 392.00, 523.25], // C maj7
        [220.00, 261.63, 329.63, 440.00]  // Am7
    ];
    let chordIdx = 0;

    function playSoftPluck(freq, delaySec, gainLevel = 0.04) {
        if (!audioCtx || !isMusicPlaying) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delaySec);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, audioCtx.currentTime + delaySec);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime + delaySec);
            gain.gain.linearRampToValueAtTime(gainLevel, audioCtx.currentTime + delaySec + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delaySec + 2.5);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(audioCtx.currentTime + delaySec);
            osc.stop(audioCtx.currentTime + delaySec + 2.6);
        } catch (e) {}
    }

    function playAmbientChord() {
        if (!isMusicPlaying) return;
        const currentChord = chords[chordIdx % chords.length];
        currentChord.forEach((freq, idx) => {
            playSoftPluck(freq, idx * 0.12, 0.035);
        });
        const melodyNotes = [587.33, 659.25, 783.99, 880.00];
        const randomMelody = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
        playSoftPluck(randomMelody, 0.8, 0.025);

        chordIdx++;
    }

    function startMusic() {
        createAudioContext();
        isMusicPlaying = true;
        musicBtn?.classList.add('playing');
        if (musicLabel) musicLabel.textContent = 'Nhạc: Bật';
        playAmbientChord();
        musicInterval = setInterval(playAmbientChord, 2800);
    }

    function stopMusic() {
        isMusicPlaying = false;
        musicBtn?.classList.remove('playing');
        if (musicLabel) musicLabel.textContent = 'Nhạc: Tắt';
        if (musicInterval) clearInterval(musicInterval);
    }

    window.toggleMusic = function() {
        if (isMusicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    };

    musicBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.toggleMusic();
    });

    function firstInteractionStart() {
        if (!isMusicPlaying) {
            startMusic();
        }
        document.removeEventListener('click', firstInteractionStart);
        document.removeEventListener('keydown', firstInteractionStart);
    }
    document.addEventListener('click', firstInteractionStart, { once: true });
    document.addEventListener('keydown', firstInteractionStart, { once: true });
}

// Sound effects for games
function playSound(type) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        if (type === 'correct') {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
                gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.09 + 0.35);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.09);
                osc.stop(ctx.currentTime + i * 0.09 + 0.36);
            });
        } else if (type === 'wrong') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(170, ctx.currentTime + 0.25);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.26);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.27);
        } else if (type === 'fanfare') {
            const fanNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
            fanNotes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
                gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.12);
                osc.stop(ctx.currentTime + i * 0.12 + 0.65);
            });
        }
    } catch (e) {}
}

// ===== 3. CONFETTI CELEBRATION ENGINE =====
let confettiParticles = [];
let confettiAnimId = null;

function initConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
}

function launchConfetti(durationMs = 4000) {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ffffff'];
    confettiParticles = [];

    for (let i = 0; i < 130; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.4,
            size: Math.random() * 8 + 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 6,
            speedY: Math.random() * 4 + 3,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        });
    }

    const startTime = Date.now();

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();

            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });

        if (Date.now() - startTime < durationMs) {
            confettiAnimId = requestAnimationFrame(render);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            cancelAnimationFrame(confettiAnimId);
        }
    }
    render();
}

// ===== 4. CURSOR GLOW =====
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth < 768) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== 5. PARTICLES IN HERO =====
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const colors = [
        'rgba(56, 189, 248, 0.6)',
        'rgba(16, 185, 129, 0.5)',
        'rgba(245, 158, 11, 0.45)',
        'rgba(236, 72, 153, 0.4)'
    ];

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1.5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (Math.random() * 10 + 7) + 's';
        particle.style.animationDelay = (Math.random() * 8) + 's';
        particle.style.boxShadow = `0 0 ${size * 3}px ${particle.style.background}`;
        container.appendChild(particle);
    }
}

// ===== 6. HEADER & SCROLL SPY =====
function initHeaderScrollSpy() {
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 60);

        let currentSection = 'home';
        sections.forEach(sec => {
            const top = sec.offsetTop - 150;
            if (window.scrollY >= top) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const target = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
            if (target === currentSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });
}

// ===== 7. SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                document.getElementById('navLinks')?.classList.remove('mobile-open');
                document.getElementById('mobileToggle')?.classList.remove('active');
                document.body.style.overflow = '';
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== 8. COUNT UP NUMBERS =====
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                counters.forEach(counter => {
                    const target = parseFloat(counter.dataset.count);
                    const isDecimal = counter.dataset.decimal === 'true';
                    const suffix = counter.dataset.suffix || '';
                    const duration = 1800;
                    const steps = 50;
                    const stepTime = duration / steps;
                    let current = 0;
                    const increment = target / steps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
                            clearInterval(timer);
                        } else {
                            counter.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.5 });

    const stats = document.querySelector('.hero-stats');
    if (stats) observer.observe(stats);
}

// ===== 9. BACK TO TOP =====
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 450);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== 10. MOBILE MENU =====
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('navLinks');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('mobile-open');
        document.body.style.overflow = nav.classList.contains('mobile-open') ? 'hidden' : '';
    });
}

// ===== 11. PARALLAX BACKGROUND =====
function initParallaxBg() {
    const sections = document.querySelectorAll('.dest-section');
    window.addEventListener('scroll', () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const bg = section.querySelector('.dest-bg img');
                if (bg) {
                    const offset = rect.top * 0.12;
                    bg.style.transform = `translateY(${offset}px) scale(1.05)`;
                }
            }
        });
    });
}

// ===== 12. INTERACTIVE STICKERS =====
function initStickerInteraction() {
    document.querySelectorAll('.sticker').forEach(sticker => {
        sticker.addEventListener('mouseenter', () => {
            sticker.style.animationPlayState = 'paused';
            sticker.style.transform = 'scale(1.45) rotate(12deg)';
            sticker.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        sticker.addEventListener('mouseleave', () => {
            sticker.style.animationPlayState = 'running';
            sticker.style.transform = '';
            sticker.style.transition = '';
        });
        sticker.addEventListener('click', () => {
            sticker.style.transform = 'scale(2.2) rotate(360deg)';
            playSound('correct');
            setTimeout(() => {
                sticker.style.transform = '';
            }, 500);
        });
    });
}

// ===== 13. LIGHTBOX SYSTEM (PHÓNG TO TOÀN BỘ ẢNH CHUẨN XÁC) =====
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxYear = document.getElementById('lightboxYear');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    if (!lightbox) return;

    function getVisibleZoomItems() {
        return Array.from(document.querySelectorAll('.zoomable')).filter(item => {
            return item.offsetParent !== null || window.getComputedStyle(item).display !== 'none';
        });
    }

    function buildLightboxList(clickedElement) {
        let activeItems;
        const parentFloat = clickedElement.closest('.dest-gallery-float');
        const parentHeritage = clickedElement.closest('.heritage-grid');

        if (parentFloat) {
            activeItems = Array.from(parentFloat.querySelectorAll('.zoomable'));
        } else if (parentHeritage) {
            activeItems = Array.from(parentHeritage.querySelectorAll('.heritage-card')).filter(card => {
                return card.style.display !== 'none';
            });
        } else {
            activeItems = getVisibleZoomItems();
        }

        lightboxImages = activeItems.map(item => {
            const img = item.querySelector('img');
            return {
                src: img ? img.src : '',
                tag: item.getAttribute('data-tag') || 'Sài Gòn Di Sản',
                year: item.getAttribute('data-year') || 'Lịch sử văn hóa',
                title: item.getAttribute('data-title') || item.querySelector('h3')?.textContent || 'Điểm Đến Biểu Tượng',
                caption: item.getAttribute('data-caption') || img?.alt || 'Hình ảnh du lịch TP. Hồ Chí Minh'
            };
        });

        currentLightboxIndex = activeItems.indexOf(clickedElement);
        if (currentLightboxIndex < 0) currentLightboxIndex = 0;
    }

    // Attach click listener to all zoomable items
    document.querySelectorAll('.zoomable').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.closest('a')) return;
            e.stopPropagation();
            buildLightboxList(item);
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function updateLightbox() {
        if (!lightboxImages || lightboxImages.length === 0 || !lightboxImages[currentLightboxIndex]) return;
        const current = lightboxImages[currentLightboxIndex];
        
        lightboxImg.src = current.src;
        if (lightboxCounter) lightboxCounter.textContent = `Ảnh ${currentLightboxIndex + 1} / ${lightboxImages.length}`;
        if (lightboxTag) lightboxTag.textContent = `📍 ${current.tag}`;
        if (lightboxYear) lightboxYear.textContent = `🏛️ ${current.year}`;
        if (lightboxTitle) lightboxTitle.textContent = current.title;
        if (lightboxCaption) lightboxCaption.textContent = current.caption;
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        if (!lightboxImages || lightboxImages.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
        updateLightbox();
    }

    function showNext() {
        if (!lightboxImages || lightboxImages.length === 0) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
        updateLightbox();
    }

    closeBtn?.addEventListener('click', closeLightbox);
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

// ===== 14. GALLERY FILTER TABS (BỘ LỌC THƯ VIỆN DI SẢN) =====
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.heritage-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 30);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== 15. STAMP PASSPORT & QUIZ ENGINE =====
function initStampCard() {
    const toggle = document.getElementById('stampToggle');
    const card = document.getElementById('stampCard');
    if (!toggle || !card) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!card.contains(e.target)) {
            card.classList.remove('open');
        }
    });
}

function renderStamps() {
    const countEl = document.getElementById('stampCount');
    const stamps = gameState.collectedStamps;
    if (countEl) countEl.textContent = `${stamps.length}/3`;

    ['bach-dang', 'nguyen-hue', 'buu-dien'].forEach(key => {
        const slot = document.getElementById(`stamp-${key}`);
        if (!slot) return;
        const empty = slot.querySelector('.stamp-empty');
        const earned = slot.querySelector('.stamp-earned');

        if (stamps.includes(key)) {
            slot.classList.add('collected');
            if (empty) empty.style.display = 'none';
            if (earned) earned.style.display = 'block';
        } else {
            slot.classList.remove('collected');
            if (empty) empty.style.display = 'block';
            if (earned) earned.style.display = 'none';
        }
    });

    const hint = document.getElementById('stampHint');
    if (hint) {
        if (stamps.length === 3) {
            hint.innerHTML = '🎉 <strong>ĐÃ HOÀN THÀNH 3/3 TEM!</strong><br><button onclick="showRewardModal()" class="btn btn-warm btn-sm" style="margin-top:6px;width:100%">🎁 Mở Cẩm Nang Du Lịch</button>';
        } else {
            hint.innerHTML = `Đã thu thập <strong>${stamps.length}/3 tem</strong>. Hoàn thành cả 3 điểm để mở khóa Cẩm Nang 🎁`;
        }
    }
}

// Global start quiz
window.startQuiz = function(destKey) {
    const quiz = quizData[destKey];
    if (!quiz) return;

    gameState.currentQuizKey = destKey;
    const modal = document.getElementById('quizModal');
    const emoji = document.getElementById('quizEmoji');
    const title = document.getElementById('quizTitle');
    const subtitle = document.getElementById('quizSubtitle');
    const question = document.getElementById('quizQuestion');
    const options = document.getElementById('quizOptions');
    const body = document.getElementById('quizBody');
    const result = document.getElementById('quizResult');
    const shortcutBtn = document.getElementById('rewardShortcutBtn');

    if (!modal) return;

    emoji.textContent = quiz.emoji;
    title.textContent = quiz.title;
    subtitle.textContent = quiz.subtitle;
    question.textContent = quiz.question;

    body.style.display = 'block';
    result.style.display = 'none';
    if (shortcutBtn) shortcutBtn.style.display = 'none';

    if (gameState.collectedStamps.includes(destKey)) {
        showQuizResult(true, `Bạn đã nhận được tem <strong>${quiz.stampName}</strong> từ trước rồi! Hãy khám phá thêm các điểm còn lại nhé!`);
        modal.classList.add('active');
        return;
    }

    options.innerHTML = '';
    quiz.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.innerHTML = `<span>${opt.text}</span>`;
        btn.addEventListener('click', () => handleOptionChoose(btn, opt.correct, quiz));
        options.appendChild(btn);
    });

    modal.classList.add('active');
};

function handleOptionChoose(selectedBtn, isCorrect, quiz) {
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(b => b.style.pointerEvents = 'none');

    if (isCorrect) {
        selectedBtn.classList.add('correct');
        playSound('correct');

        if (!gameState.collectedStamps.includes(gameState.currentQuizKey)) {
            gameState.collectedStamps.push(gameState.currentQuizKey);
            localStorage.setItem('saigon_explorer_stamps', JSON.stringify(gameState.collectedStamps));
            renderStamps();
        }

        setTimeout(() => {
            const isCompletedAll = gameState.collectedStamps.length === 3;
            showQuizResult(
                true,
                `🎉 <strong>XUẤT SẮC! CHÍNH XÁC!</strong><br>${quiz.explanation}<br><br>Đã đóng dấu tem <strong>${quiz.stampEmoji} ${quiz.stampName}</strong> vào Sổ Tem Du Lịch!`
            );

            if (isCompletedAll) {
                const shortcutBtn = document.getElementById('rewardShortcutBtn');
                if (shortcutBtn) shortcutBtn.style.display = 'inline-flex';
                playSound('fanfare');
                launchConfetti(4500);
            }
        }, 700);
    } else {
        selectedBtn.classList.add('wrong');
        playSound('wrong');
        setTimeout(() => {
            showQuizResult(false, 'Rất tiếc câu trả lời chưa chính xác! Bạn hãy đọc kỹ lại phần nội dung giới thiệu phía trên rồi thử lại nhé!');
        }, 700);
    }
}

function showQuizResult(success, message) {
    const body = document.getElementById('quizBody');
    const result = document.getElementById('quizResult');
    const emoji = document.getElementById('resultEmoji');
    const title = document.getElementById('resultTitle');
    const text = document.getElementById('resultText');

    body.style.display = 'none';
    result.style.display = 'block';

    if (success) {
        emoji.textContent = '🎉';
        title.textContent = 'Nhận Tem Thành Công!';
    } else {
        emoji.textContent = '💡';
        title.textContent = 'Chưa Đúng Rồi!';
    }
    text.innerHTML = message;
}

window.closeQuiz = function() {
    const modal = document.getElementById('quizModal');
    if (modal) modal.classList.remove('active');
};
document.getElementById('quizClose')?.addEventListener('click', window.closeQuiz);

// ===== 16. REWARD MODAL & GUIDEBOOK TABS =====
window.showRewardModal = function() {
    window.closeQuiz();
    const modal = document.getElementById('rewardModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        playSound('fanfare');
        launchConfetti(5000);
    }
};

window.closeRewardModal = function() {
    const modal = document.getElementById('rewardModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
};

window.switchGuideTab = function(tabName) {
    const tabs = document.querySelectorAll('.gb-tab');
    const contents = document.querySelectorAll('.gb-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    const activeTab = document.querySelector(`.gb-tab[onclick*="${tabName}"]`);
    const activeContent = document.getElementById(`tab-${tabName}`);

    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
};
