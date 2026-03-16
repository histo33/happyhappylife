/**
 * Style Fit - Core Application Logic
 * A/B Matching Test & Cosine Similarity Recommendation Engine
 */

// --- Data Mockups ---

// Mock Styles for AB Test (Initial Phase)
const styleOptions = [
    { id: 1, name: 'Minimalist', vector: [0.9, 0.1, 0.2, 0.1, 0.0], image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Streetwear', vector: [0.2, 0.9, 0.3, 0.2, 0.0], image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Formal', vector: [0.3, 0.1, 0.9, 0.1, 0.1], image: 'images/formal_style.png' },
    { id: 4, name: 'Vintage', vector: [0.4, 0.3, 0.2, 0.8, 0.2], image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'Bohemian', vector: [0.6, 0.2, 0.1, 0.7, 0.1], image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
    { id: 6, name: 'Techwear', vector: [0.1, 0.8, 0.5, 0.3, 0.0], image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80' },
    { id: 7, name: 'Traditional', vector: [0.1, 0.1, 0.1, 0.1, 0.9], image: 'images/픽사베이 image 11.png' },
    { id: 8, name: 'Traditional', vector: [0.1, 0.1, 0.1, 0.1, 1.0], image: 'images/스크린샷 2026-03-12 오후 3.46.20.png' },
    { id: 9, name: 'Traditional', vector: [0.1, 0.1, 0.1, 0.1, 1.0], image: 'images/스크린샷 2026-03-12 오후 3.47.02.png' }
];

// Mock Products for Recommendation
const products = [
    { 
        id: 101, name: 'Essential Oversized Tee', brand: 'StyleFit', price: '29,000', priceRaw: 29000,
        vector: [0.85, 0.3, 0.1, 0.2, 0.0], colors: ['white', 'grey'], category: 'top',
        targetBody: { height: [160, 190], weight: [50, 90] },
        image: 'shop imags/yuri_b-t-shirt-1261820_1920.png' 
    },
    { 
        id: 102, name: 'Cargo Tech Pants', brand: 'NeoStreet', price: '89,000', priceRaw: 89000,
        vector: [0.2, 0.95, 0.4, 0.1, 0.0], colors: ['black', 'grey'], category: 'bottom',
        targetBody: { height: [170, 195], weight: [60, 100] },
        image: 'shop imags/heidijergovsky-jeans-674832_640.jpg' 
    },
    { 
        id: 103, name: 'Wool Tailored Blazer', brand: 'Classy', price: '159,000', priceRaw: 159000,
        vector: [0.2, 0.1, 0.9, 0.3, 0.2], colors: ['navy', 'black'], category: 'outer',
        targetBody: { height: [165, 185], weight: [55, 85] },
        image: 'shop imags/loft184-fashion-3555645_640.jpg' 
    },
    { 
        id: 104, name: 'Retro Denim Jacket', brand: 'OldSchool', price: '75,000', priceRaw: 75000,
        vector: [0.5, 0.4, 0.2, 0.85, 0.1], colors: ['blue', 'navy'], category: 'outer',
        targetBody: { height: [155, 180], weight: [45, 80] },
        image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=300&q=80' 
    },
    { 
        id: 105, name: 'Linen Dress Shirt', brand: 'Minimal', price: '55,000', priceRaw: 55000,
        vector: [0.95, 0.2, 0.4, 0.1, 0.1], colors: ['beige', 'white', 'blue', 'navy', 'pattern'], category: 'top',
        targetBody: { height: [160, 190], weight: [50, 95] },
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80' 
    },
    { 
        id: 106, name: 'Classic Knit Sweater', brand: 'CozyWear', price: '65,000', priceRaw: 65000,
        vector: [0.6, 0.1, 0.4, 0.7, 0.2], colors: ['grey', 'white', 'pink'], category: 'top',
        targetBody: { height: [155, 185], weight: [45, 80] },
        image: 'shop imags/lovetl-clothes-977417_640.jpg' 
    },
    { 
        id: 107, name: 'Streetwear Cargo Shorts', brand: 'UrbanStyle', price: '45,000', priceRaw: 45000,
        vector: [0.1, 0.9, 0.2, 0.3, 0.0], colors: ['khaki', 'brown', 'green'], category: 'bottom',
        targetBody: { height: [160, 190], weight: [50, 95] },
        image: 'shop imags/ornaw-fashion-4132576_640.jpg' 
    },
    { 
        id: 108, name: 'Elegant Midi Dress', brand: 'ChicSilhouette', price: '120,000', priceRaw: 120000,
        vector: [0.8, 0.0, 0.9, 0.2, 0.3], colors: ['black', 'navy'], category: 'dress',
        targetBody: { height: [160, 175], weight: [45, 70] },
        image: 'shop imags/surprising_media-woman-8636360_640.jpg' 
    },
    { 
        id: 109, name: 'Vintage Floral Blouse', brand: 'RetroVibe', price: '50,000', priceRaw: 50000,
        vector: [0.3, 0.2, 0.1, 0.9, 0.5], colors: ['pattern', 'white', 'pink', 'green', 'red'], category: 'top',
        targetBody: { height: [150, 170], weight: [40, 65] },
        image: 'shop imags/jillwellington-vintage-woman-635255_640.jpg' 
    },
    { 
        id: 110, name: 'Cyberpunk Concept Jacket', brand: 'NeoFuture', price: '210,000', priceRaw: 210000,
        vector: [0.0, 0.9, 0.4, 0.1, 0.0], colors: ['black', 'grey'], category: 'outer',
        targetBody: { height: [165, 190], weight: [55, 90] },
        image: 'shop imags/designfreek-ai-generated-8719968_1920 (1).jpg' 
    },
    { 
        id: 111, name: 'Vintage Tweed Coat', brand: 'Heritage', price: '185,000', priceRaw: 185000,
        vector: [0.4, 0.1, 0.8, 0.9, 0.3], colors: ['brown', 'khaki', 'grey'], category: 'outer',
        targetBody: { height: [170, 195], weight: [65, 100] },
        image: 'shop imags/familieportraet-man-7518890_640.jpg' 
    },
    { 
        id: 112, name: 'Comfort Cotton Boxers', brand: 'EverydayBasics', price: '15,000', priceRaw: 15000,
        vector: [0.9, 0.2, 0.1, 0.1, 0.0], colors: ['white', 'blue'], category: 'bottom',
        targetBody: { height: [150, 200], weight: [40, 120] },
        image: 'shop imags/kennethmcandrew-boxer-shorts-335120_640.jpg' 
    },
    { 
        id: 113, name: 'Royal Velvet Red Dress', brand: 'HistoricalCharm', price: '250,000', priceRaw: 250000,
        vector: [0.1, 0.0, 0.6, 0.9, 0.8], colors: ['red', 'black', 'navy'], category: 'dress',
        targetBody: { height: [155, 180], weight: [45, 75] },
        image: 'https://images.unsplash.com/photo-1547941126-3d5322b218b0?auto=format&fit=crop&w=600&q=80' 
    },
    { 
        id: 114, name: 'Tropical Summer Bikini', brand: 'SunSplash', price: '45,000', priceRaw: 45000,
        vector: [0.7, 0.5, 0.1, 0.2, 0.0], colors: ['pattern', 'white', 'blue', 'green', 'orange', 'pink'], category: 'top',
        targetBody: { height: [150, 185], weight: [40, 70] },
        image: 'shop imags/stux-bikini-377487_640.jpg' 
    },
    { 
        id: 115, name: 'Casual Denim Overall', brand: 'UrbanStyle', price: '78,000', priceRaw: 78000,
        vector: [0.6, 0.8, 0.1, 0.5, 0.1], colors: ['blue', 'navy'], category: 'bottom',
        targetBody: { height: [160, 185], weight: [50, 85] },
        image: 'shop imags/surprising_media-woman-6863307_640.jpg' 
    },
    { 
        id: 116, name: 'Breezy Summer Dress', brand: 'FloralBreeze', price: '82,000', priceRaw: 82000,
        vector: [0.8, 0.2, 0.4, 0.6, 0.1], colors: ['pattern', 'blue', 'pink', 'white', 'orange', 'red'], category: 'dress',
        targetBody: { height: [155, 175], weight: [45, 70] },
        image: 'shop imags/surprising_media-woman-9503073_640.jpg' 
    },
    { 
        id: 117, name: 'Traditional Silk Sari', brand: 'CulturalHeritage', price: '190,000', priceRaw: 190000,
        vector: [0.1, 0.1, 0.6, 0.4, 1.0], colors: ['blue', 'pattern', 'gold', 'red'], category: 'dress',
        targetBody: { height: [150, 180], weight: [45, 80] },
        image: 'shop imags/unnatisilks-sari-351106_640.jpg' 
    },
    { 
        id: 118, name: 'Sunset Orange Knit', brand: 'UrbanStyle', price: '68,000', priceRaw: 68000,
        vector: [0.3, 0.9, 0.2, 0.4, 0.1], colors: ['orange', 'brown'], category: 'top',
        targetBody: { height: [165, 195], weight: [60, 100] },
        image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=600&q=80' 
    },
    { 
        id: 119, name: 'Classic Yellow Raincoat', brand: 'OutdoorElements', price: '95,000', priceRaw: 95000,
        vector: [0.2, 0.5, 0.3, 0.7, 0.2], colors: ['yellow', 'black'], category: 'outer',
        targetBody: { height: [155, 190], weight: [50, 95] },
        image: 'https://images.unsplash.com/photo-1548883354-94bcfe321cbb?auto=format&fit=crop&w=600&q=80' 
    },
    { 
        id: 120, name: 'Deep Forest Chinos', brand: 'Classy', price: '72,000', priceRaw: 72000,
        vector: [0.7, 0.3, 0.8, 0.4, 0.2], colors: ['green', 'brown'], category: 'bottom',
        targetBody: { height: [170, 190], weight: [60, 90] },
        image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=600&q=80' 
    },
    { 
        id: 121, name: 'Premium Wool Pink Coat', brand: 'ChicSilhouette', price: '248,000', priceRaw: 248000,
        vector: [0.3, 0.1, 0.9, 0.5, 0.1], colors: ['pink', 'beige', 'blue', 'navy', 'pattern', 'white'], category: 'outer',
        targetBody: { height: [155, 180], weight: [45, 75] },
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80' 
    }
];

// Master Product Logic: Load from LocalStorage as priority
const registeredProducts = JSON.parse(localStorage.getItem('registeredProducts') || '[]');

let allProducts = [];
if (registeredProducts.length > 0) {
    allProducts = registeredProducts;
} else {
    // Fallback to static if user cleared localStorage
    allProducts = [...products];
}

// --- Application State ---
let currentStep = 0;
const totalSteps = 5;
let userVector = [0, 0, 0, 0, 0]; // [Minimalist, Streetwear, Formal, Vintage, Traditional]
let testPool = [];
let testMode = 'swipe'; // 'swipe' or 'ab'
let showOnlyLiked = false;
const likedProducts = new Set();

// --- Audio Feedback System (Web Audio API) ---
const synthAudio = {
    ctx: null,
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },
    playClick() {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    },
    playNope() {
        this.init();
        if (!this.ctx) return;
        // Low crunch/thud
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        
        // Add noise filter effect implicitly through low frequency detune
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },
    playLike() {
        this.init();
        if (!this.ctx) return;
        // Pleasant upward chime/arpeggio
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
        osc.frequency.setValueAtTime(783.99, this.ctx.currentTime + 0.16); // G5
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    }
};

// --- Voice Feedback System (Web Speech API) ---
const voiceTTS = {
    voices: [],
    init() {
        if (!window.speechSynthesis) return;
        this.voices = window.speechSynthesis.getVoices();
        if (this.voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = () => {
                this.voices = window.speechSynthesis.getVoices();
            };
        }
    },
    speak(text, type, callback) {
        if (!window.speechSynthesis) {
            if (callback) callback();
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        
        let selectedVoice = null;
        if (type === 'male') {
            utterance.rate = 1.4; // Faster for shorter/snappy feel
            utterance.pitch = 0.5; // Deeper pitch for resolute/firm tone
            utterance.volume = 1.0; // Maximum volume for strength
            selectedVoice = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google US English Male') || v.name.includes('Daniel') || v.name.includes('Male')));
        } else if (type === 'female') {
            utterance.rate = 0.9; // Slower for softer feel
            utterance.pitch = 0.8; // Calmer tone
            selectedVoice = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google UK English Female') || v.name.includes('Samantha') || v.name.includes('Female')));
        }
        
        if (!selectedVoice) selectedVoice = this.voices.find(v => v.lang.startsWith('en'));
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.onend = () => {
             if (callback) callback();
        };

        window.speechSynthesis.speak(utterance);
    }
};
// Initialize voices as soon as possible
voiceTTS.init();

// Global click listener for UI sounds
document.addEventListener('click', (e) => {
    synthAudio.init();
    voiceTTS.init(); // ensure voices are ready
    if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('.color-chip') || e.target.closest('.interaction-icon') || e.target.closest('.swipe-card')) {
        synthAudio.playClick();
    }
});

// --- Logic Functions ---

/**
 * Calculate Cosine Similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Update User Vector based on selection
 */
function updateUserProfile(selectedOption) {
    userVector = userVector.map((val, i) => val + selectedOption.vector[i]);
}

/**
 * Filter and Sort Products
 */
function getProcessedProducts(filters = {}) {
    let results = allProducts.map(product => {
        const score = cosineSimilarity(userVector, product.vector);
        return { ...product, similarity: score };
    });

    // Apply Filters
    if (filters.color && filters.color !== 'all') {
        results = results.filter(p => p.colors.includes(filters.color));
    }

    if (filters.price && filters.price !== 'all') {
        results = results.filter(p => {
            if (filters.price === 'under-5') return p.priceRaw <= 50000;
            if (filters.price === '5-10') return p.priceRaw > 50000 && p.priceRaw <= 100000;
            if (filters.price === 'over-10') return p.priceRaw > 100000;
            return true;
        });
    }

    if (filters.height || filters.weight) {
        results = results.filter(p => {
            const h = parseInt(filters.height);
            const w = parseInt(filters.weight);
            let match = true;
            if (h) match = match && h >= p.targetBody.height[0] && h <= p.targetBody.height[1];
            if (w) match = match && w >= p.targetBody.weight[0] && w <= p.targetBody.weight[1];
            return match;
        });
    }

    // Sort by similarity descending
    return results.sort((a, b) => b.similarity - a.similarity);
}

// --- UI Logic & Interaction Implementation ---

const heroSection = document.getElementById('hero');
const testSection = document.getElementById('test-section');
const recommendationsSection = document.getElementById('recommendations-section');
const swipeDeck = document.getElementById('swipe-deck');
const abContainer = document.getElementById('ab-test-container');
const progress = document.getElementById('progress');

const startSwipeBtn = document.getElementById('start-test-btn');
const startABBtn = document.getElementById('start-ab-btn');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const versionLabel = document.getElementById('version-label');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Reset UI state for test
function initTestUI(mode) {
    testMode = mode;
    currentStep = 0;
    userVector = [0, 0, 0, 0, 0];
    testPool = [];
    
    heroSection.classList.add('hidden');
    testSection.classList.remove('hidden');
    recommendationsSection.classList.add('hidden');
    
    const testTitle = testSection.querySelector('.section-title');
    const testDesc = testSection.querySelector('.section-desc');

    if (mode === 'swipe') {
        swipeDeck.classList.remove('hidden');
        abContainer.classList.add('hidden');
        document.querySelector('.interaction-hints').classList.remove('hidden');
        if (testTitle) testTitle.innerHTML = '이미지 스와이프 Test';
        if (testDesc) testDesc.innerHTML = '마음에 안들면 왼쪽으로 버리고 마음에들면 오른쪽으로 밀어주세요';
    } else {
        swipeDeck.classList.add('hidden');
        abContainer.classList.remove('hidden');
        document.querySelector('.interaction-hints').classList.add('hidden');
        if (testTitle) testTitle.innerHTML = 'AB Matching Test';
        if (testDesc) testDesc.innerHTML = '둘 중 더 마음에 드는 스타일을 선택해 주세요.';
    }
    
    // Hide version label during tests
    if (versionLabel) versionLabel.classList.add('hidden');
}

// --- Swipe Test Logic ---
function startSwipeTest() {
    initTestUI('swipe');
    testPool = shuffle([...styleOptions]).slice(0, 10);
    renderSwipeCard();
}

function renderSwipeCard() {
    if (currentStep >= testPool.length) {
        showResults();
        return;
    }

    const style = testPool[currentStep];
    const card = document.createElement('div');
    card.className = 'swipe-card';
    card.innerHTML = `
        <div class="image-container"><img src="${style.image}" alt="${style.name}"></div>
        <div class="label">${style.name}</div>
    `;

    swipeDeck.insertBefore(card, swipeDeck.querySelector('.like'));
    initSwipeDragging(card, style);
    progress.style.width = `${(currentStep / testPool.length) * 100}%`;
}

function initSwipeDragging(card, style) {
    let startX = 0, currentX = 0, isDragging = false;
    const likeFeedback = swipeDeck.querySelector('.like');
    const nopeFeedback = swipeDeck.querySelector('.nope');

    const onStart = (e) => {
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        card.classList.add('dragging');
    };

    const onMove = (e) => {
        if (!isDragging) return;
        currentX = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - startX;
        card.style.transform = `translateX(${currentX}px) rotate(${currentX / 10}deg)`;
        
        const opacity = Math.min(1, Math.abs(currentX) / 100);
        if (currentX > 0) { likeFeedback.style.opacity = opacity; nopeFeedback.style.opacity = 0; }
        else { nopeFeedback.style.opacity = opacity; likeFeedback.style.opacity = 0; }
    };

    const onEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        card.classList.remove('dragging');
        if (Math.abs(currentX) > 120) {
            if (currentX > 0) {
                voiceTTS.speak('Like', 'female', () => synthAudio.playLike());
                updateUserProfile(style);
            } else {
                voiceTTS.speak('Nope', 'male', () => synthAudio.playNope());
            }
            currentStep++;
            card.style.transform = `translateX(${currentX > 0 ? 1000 : -1000}px) rotate(${currentX / 2}deg)`;
            card.style.opacity = '0';
            setTimeout(() => { card.remove(); renderSwipeCard(); }, 300);
        } else {
            card.style.transform = '';
        }
        likeFeedback.style.opacity = 0;
        nopeFeedback.style.opacity = 0;
    };

    card.addEventListener('mousedown', onStart);
    card.addEventListener('touchstart', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
}

// --- AB Test Logic ---
function startABTest() {
    initTestUI('ab');
    const shuffled = shuffle([...styleOptions]);
    for (let i = 0; i < 5; i++) {
        testPool.push([shuffled[i * 2], shuffled[i * 2 + 1]]);
    }
    renderABStep();
}

function renderABStep() {
    if (currentStep >= testPool.length) {
        showResults();
        return;
    }

    const [optA, optB] = testPool[currentStep];
    const cardA = document.getElementById('option-a');
    const cardB = document.getElementById('option-b');

    cardA.querySelector('.image-container').innerHTML = `<img src="${optA.image}" alt="${optA.name}">`;
    cardA.querySelector('.label').textContent = optA.name;
    cardA.onclick = () => selectABOption(optA);

    cardB.querySelector('.image-container').innerHTML = `<img src="${optB.image}" alt="${optB.name}">`;
    cardB.querySelector('.label').textContent = optB.name;
    cardB.onclick = () => selectABOption(optB);

    progress.style.width = `${(currentStep / testPool.length) * 100}%`;
}

function selectABOption(style) {
    synthAudio.playLike(); // Play lovely chime on selection
    updateUserProfile(style);
    currentStep++;
    renderABStep();
}

// --- Results & Filtering ---
function showResults() {
    testSection.classList.add('hidden');
    recommendationsSection.classList.remove('hidden');
    progress.style.width = '100%';
    renderRecommendations();
    renderProfileSummary();
}

function renderRecommendations() {
    const filters = {
        height: document.getElementById('filter-height').value,
        weight: document.getElementById('filter-weight').value,
        color: document.querySelector('.color-chip.active').dataset.color,
        price: document.getElementById('filter-price').value
    };

    const recs = getProcessedProducts(filters);
    const list = document.getElementById('recommendation-list');
    
    let displayProducts = recs;
    if (showOnlyLiked) {
        displayProducts = recs.filter(p => likedProducts.has(p.id));
    }

    if (!displayProducts.length) {
        list.innerHTML = `<p class="no-results">${showOnlyLiked ? '좋아요 표시한 상품이 없습니다.' : '조건에 맞는 상품이 없습니다. 필터를 조정해 보세요.'}</p>`;
        return;
    }
    
    list.innerHTML = '';
    displayProducts.forEach(p => {
        const isLiked = likedProducts.has(p.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}">
                <div class="similarity-tag">${Math.round(p.similarity * 100)}% Match</div>
            </div>
            <div class="product-info">
                <span class="brand">${p.brand}</span>
                <h3 class="name">${p.name}</h3>
                <span class="price">₩${p.price}</span>
                <button class="like-btn ${isLiked ? 'active' : ''}" data-id="${p.id}" title="좋아요">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
        `;
        list.appendChild(card);
    });
}

function renderProfileSummary() {
    const placeholder = document.getElementById('radar-chart-placeholder');
    const divisor = testMode === 'swipe' ? 3 : 1; 
    placeholder.innerHTML = `
        <div class="profile-summary">
            <h3>Style Persona</h3>
            <div class="vector-visual">
                ${userVector.map((v, i) => `
                    <div class="vector-bar-wrap">
                        <span>${['Minimal', 'Street', 'Formal', 'Vintage', 'Traditional'][i]}</span>
                        <div class="vector-bar" style="width: ${Math.min(100, (v/divisor)*100)}%"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- Infinite Scroll Implementation ---
let isLoadingMore = false;
const scrollSentinel = document.getElementById('infinite-scroll-sentinel');
const loadMoreIndicator = document.getElementById('load-more-indicator');

const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoadingMore && !recommendationsSection.classList.contains('hidden')) {
        handleLoadMore();
    }
}, { threshold: 0.1, rootMargin: '100px' });

async function handleLoadMore() {
    isLoadingMore = true;
    loadMoreIndicator.classList.remove('hidden');

    // Simulate network delay for a realistic feel
    await new Promise(resolve => setTimeout(resolve, 1200));

    const filters = {
        height: document.getElementById('filter-height').value,
        weight: document.getElementById('filter-weight').value,
        color: document.querySelector('.color-chip.active').dataset.color,
        price: document.getElementById('filter-price').value
    };

    const recs = getProcessedProducts(filters);
    if (recs.length > 0 && !showOnlyLiked) {
        // Shuffle and take a few items to simulate multi-page delivery
        const additionalItems = shuffle([...recs]).slice(0, 3);
        const list = document.getElementById('recommendation-list');
        
        additionalItems.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="similarity-tag">${Math.round(p.similarity * 100)}% Match</div>
                </div>
                <div class="product-info">
                    <span class="brand">${p.brand}</span>
                    <h3 class="name">${p.name} (Refilled)</h3>
                    <span class="price">₩${p.price}</span>
                    <button class="like-btn" title="좋아요">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                </div>
            `;
            list.appendChild(card);
        });
    }

    loadMoreIndicator.classList.add('hidden');
    isLoadingMore = false;
}

// Start observing
observer.observe(scrollSentinel);

// Handle Like Toggle via Event Delegation
document.getElementById('recommendation-list').addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
        const productId = parseInt(likeBtn.dataset.id);
        likeBtn.classList.toggle('active');
        
        if (likeBtn.classList.contains('active')) {
            likedProducts.add(productId);
        } else {
            likedProducts.delete(productId);
        }
        
        if (showOnlyLiked) {
            renderRecommendations();
            renderCoordiSet();
        }
    }
});

const likedCollectionBtn = document.getElementById('liked-collection-btn');
likedCollectionBtn.addEventListener('click', () => {
    showOnlyLiked = !showOnlyLiked;
    likedCollectionBtn.classList.toggle('active');
    
    // Update UI title or hint
    const sectionTitle = document.querySelector('#recommendations-section .section-title');
    const sectionDesc = document.querySelector('#recommendations-section .section-desc');
    const coordiTip = document.getElementById('coordi-tip');
    
    if (showOnlyLiked) {
        sectionTitle.textContent = "Liked Collection";
        sectionDesc.textContent = "당신이 찜한 상품을 모았습니다.";
        if (coordiTip) coordiTip.classList.remove('hidden');
        loadMoreIndicator.classList.add('hidden'); // Disable loader in liked mode
    } else {
        sectionTitle.textContent = "Your Style Profile";
        sectionDesc.textContent = "당신의 취향 벡터를 분석한 결과입니다.";
        if (coordiTip) coordiTip.classList.add('hidden');
    }
    
    renderRecommendations();
    renderCoordiSet();
});

function renderCoordiSet() {
    const section = document.getElementById('coordi-section');
    const collage = document.getElementById('coordi-collage');
    
    if (!showOnlyLiked || likedProducts.size === 0) {
        if (section) section.classList.add('hidden');
        return;
    }

    const likedList = allProducts.filter(p => likedProducts.has(p.id));
    
    // Categorize
    const top = likedList.find(p => p.category === 'top');
    const bottom = likedList.find(p => p.category === 'bottom');
    const outer = likedList.find(p => p.category === 'outer');
    
    const set = [top, bottom, outer].filter(Boolean);

    if (set.length < 2) {
        if (section) section.classList.add('hidden');
        return;
    }

    if (section) section.classList.remove('hidden');
    if (collage) {
        collage.innerHTML = '';
        set.forEach(p => {
            const item = document.createElement('div');
            item.className = 'collage-item';
            item.innerHTML = `
                <img src="${p.image}" alt="${p.name}">
                <span class="tag">${p.category}</span>
            `;
            collage.appendChild(item);
        });
    }
}

startSwipeBtn.addEventListener('click', startSwipeTest);
startABBtn.addEventListener('click', startABTest);
document.getElementById('test-skip-btn').addEventListener('click', skipToResults);

function skipToResults() {
    // Hide tests and hero
    testSection.classList.add('hidden');
    heroSection.classList.add('hidden');
    
    // Smooth transition to results
    recommendationsSection.classList.remove('hidden');
    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Render without specific preference (or default)
    renderRecommendations();

    // Hide version label if any
    if (versionLabel) versionLabel.classList.add('hidden');
}

applyFiltersBtn.addEventListener('click', () => {
    renderRecommendations();
    window.scrollTo({ top: recommendationsSection.offsetTop - 100, behavior: 'smooth' });
});

document.querySelectorAll('.color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        document.querySelectorAll('.color-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderRecommendations(); // Immediate feedback
    });
});

function resetToHome(e) {
    if (e) e.preventDefault();
    heroSection.classList.remove('hidden');
    testSection.classList.add('hidden');
    recommendationsSection.classList.add('hidden');
    swipeDeck.querySelectorAll('.swipe-card').forEach(c => c.remove());
    
    // Show version label on home
    if (versionLabel) versionLabel.classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('nav-style-test').addEventListener('click', resetToHome);
document.querySelector('.logo').addEventListener('click', resetToHome);
