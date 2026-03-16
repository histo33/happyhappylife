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
    { id: 7, name: 'Traditional', vector: [0.1, 0.1, 0.1, 0.1, 0.9], image: 'images/픽사베이 image 11 복사본.png' },
    { id: 8, name: 'Traditional', vector: [0.1, 0.1, 0.1, 0.1, 1.0], image: 'images/스크린샷 2026-03-12 오후 3.46.20 복사본.png' },
    { id: 9, name: 'Traditional', vector: [0.1, 0.1, 0.1, 0.1, 1.0], image: 'images/스크린샷 2026-03-12 오후 3.47.02 복사본.png' }
];

// Mock Products for Recommendation
const products = [
    { id: 101, name: 'Essential Oversized Tee', brand: 'StyleFit', price: '29,000', vector: [0.85, 0.3, 0.1, 0.2, 0.0], image: '../shop imags/yuri_b-t-shirt-1261820_1920.png' },
    { id: 102, name: 'Cargo Tech Pants', brand: 'NeoStreet', price: '89,000', vector: [0.2, 0.95, 0.4, 0.1, 0.0], image: '../shop imags/heidijergovsky-jeans-674832_640.jpg' },
    { id: 103, name: 'Wool Tailored Blazer', brand: 'Classy', price: '159,000', vector: [0.2, 0.1, 0.9, 0.3, 0.2], image: '../shop imags/loft184-fashion-3555645_640.jpg' },
    { id: 104, name: 'Retro Denim Jacket', brand: 'OldSchool', price: '75,000', vector: [0.5, 0.4, 0.2, 0.85, 0.1], image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=300&q=80' },
    { id: 105, name: 'Linen Dress Shirt', brand: 'Minimal', price: '55,000', vector: [0.95, 0.2, 0.4, 0.1, 0.1], image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80' },
    { id: 106, name: 'Classic Knit Sweater', brand: 'CozyWear', price: '65,000', vector: [0.6, 0.1, 0.4, 0.7, 0.2], image: '../shop imags/lovetl-clothes-977417_640.jpg' },
    { id: 107, name: 'Streetwear Cargo Shorts', brand: 'UrbanStyle', price: '45,000', vector: [0.1, 0.9, 0.2, 0.3, 0.0], image: '../shop imags/ornaw-fashion-4132576_640.jpg' },
    { id: 108, name: 'Elegant Midi Dress', brand: 'ChicSilhouette', price: '120,000', vector: [0.8, 0.0, 0.9, 0.2, 0.3], image: '../shop imags/surprising_media-woman-8636360_640.jpg' },
    { id: 109, name: 'Vintage Floral Blouse', brand: 'RetroVibe', price: '50,000', vector: [0.3, 0.2, 0.1, 0.9, 0.5], image: '../shop imags/jillwellington-vintage-woman-635255_640.jpg' },
    { id: 110, name: 'Cyberpunk Concept Jacket', brand: 'NeoFuture', price: '210,000', vector: [0.0, 0.9, 0.4, 0.1, 0.0], image: '../shop imags/designfreek-ai-generated-8719968_1920 (1).jpg' },
    { id: 111, name: 'Vintage Tweed Coat', brand: 'Heritage', price: '185,000', vector: [0.4, 0.1, 0.8, 0.9, 0.3], image: '../shop imags/familieportraet-man-7518890_640.jpg' },
    { id: 112, name: 'Comfort Cotton Boxers', brand: 'EverydayBasics', price: '15,000', vector: [0.9, 0.2, 0.1, 0.1, 0.0], image: '../shop imags/kennethmcandrew-boxer-shorts-335120_640.jpg' },
    { id: 113, name: 'Medieval Velvet Gown', brand: 'HistoricalCharm', price: '250,000', vector: [0.1, 0.0, 0.6, 0.9, 0.8], image: '../shop imags/publicdomainpictures-medieval-276019_640.jpg' },
    { id: 114, name: 'Tropical Summer Bikini', brand: 'SunSplash', price: '45,000', vector: [0.7, 0.5, 0.1, 0.2, 0.0], image: '../shop imags/stux-bikini-377487_640.jpg' },
    { id: 115, name: 'Casual Denim Overall', brand: 'UrbanStyle', price: '78,000', vector: [0.6, 0.8, 0.1, 0.5, 0.1], image: '../shop imags/surprising_media-woman-6863307_640.jpg' },
    { id: 116, name: 'Breezy Summer Dress', brand: 'FloralBreeze', price: '82,000', vector: [0.8, 0.2, 0.4, 0.6, 0.1], image: '../shop imags/surprising_media-woman-9503073_640.jpg' },
    { id: 117, name: 'Traditional Silk Sari', brand: 'CulturalHeritage', price: '190,000', vector: [0.1, 0.1, 0.6, 0.4, 1.0], image: '../shop imags/unnatisilks-sari-351106_640.jpg' }
];

// --- Application State ---
let currentStep = 0;
const totalSteps = 4; // Adjusted to 4 rounds for 8 images
let userVector = [0, 0, 0, 0, 0]; // [Minimalist, Streetwear, Formal, Vintage, Traditional]
let testPool = [];

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
voiceTTS.init();

// Global click listener for UI sounds
document.addEventListener('click', (e) => {
    synthAudio.init();
    voiceTTS.init();
    if (e.target.closest('button') || e.target.closest('.btn') || e.target.closest('.option-card') || e.target.closest('.interaction-icon')) {
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
 * Get Recommendations based on user profile
 */
function getRecommendations() {
    const recommendations = products.map(product => {
        const score = cosineSimilarity(userVector, product.vector);
        return { ...product, similarity: score };
    });
    // Sort by similarity descending
    return recommendations.sort((a, b) => b.similarity - a.similarity);
}

// --- UI Logic & AB Test Implementation ---

const heroSection = document.getElementById('hero');
const testSection = document.getElementById('test-section');
const recommendationsSection = document.getElementById('recommendations-section');
const startBtn = document.getElementById('start-test-btn');
const progress = document.getElementById('progress');
const abContainer = document.getElementById('ab-test-container');
const optionACard = document.getElementById('option-a');
const optionBCard = document.getElementById('option-b');

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startTest() {
    // Pick 10 random styles for 5 AB rounds
    const shuffled = shuffle([...styleOptions]);
    testPool = [];
    for (let i = 0; i < totalSteps; i++) {
        testPool.push([shuffled[i * 2], shuffled[i * 2 + 1]]);
    }
    
    currentStep = 0;
    heroSection.classList.add('hidden');
    testSection.classList.remove('hidden');
    renderAB();
}

function renderAB() {
    if (currentStep >= totalSteps) {
        showResults();
        return;
    }

    const [optionA, optionB] = testPool[currentStep];
    
    // Update Option A UI
    optionACard.querySelector('.image-container').innerHTML = `<img src="${optionA.image}" alt="${optionA.name}">`;
    optionACard.querySelector('.label').textContent = optionA.name;
    optionACard.onclick = () => selectOption(optionA);

    // Update Option B UI
    optionBCard.querySelector('.image-container').innerHTML = `<img src="${optionB.image}" alt="${optionB.name}">`;
    optionBCard.querySelector('.label').textContent = optionB.name;
    optionBCard.onclick = () => selectOption(optionB);

    progress.style.width = `${(currentStep / totalSteps) * 100}%`;
}

function selectOption(selectedStyle) {
    synthAudio.playClick(); // Fix undefined playLike
    updateUserProfile(selectedStyle);
    currentStep++;
    
    // Subtle flash animation on choice
    const cards = document.querySelectorAll('.ab-card');
    cards.forEach(c => c.style.opacity = '0.5');
    
    setTimeout(() => {
        cards.forEach(c => c.style.opacity = '1');
        renderAB();
    }, 200);
}

function showResults() {
    testSection.classList.add('hidden');
    recommendationsSection.classList.remove('hidden');
    
    progress.style.width = '100%';

    const recs = getRecommendations();
    const list = document.getElementById('recommendation-list');
    list.innerHTML = '';
    
    recs.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="similarity-tag">${Math.round(product.similarity * 100)}% Match</div>
            </div>
            <div class="product-info">
                <span class="brand">${product.brand}</span>
                <h3 class="name">${product.name}</h3>
                <span class="price">₩${product.price}</span>
            </div>
        `;
        list.appendChild(card);
    });
    
    const placeholder = document.getElementById('radar-chart-placeholder');
    placeholder.innerHTML = `
        <div class="profile-summary">
            <h3>Style DNA Decoded</h3>
            <p>당신의 취향을 정교한 AB 테스트로 분석했습니다!</p>
            <div class="vector-visual">
                ${userVector.map((v, i) => `
                    <div class="vector-bar-wrap">
                        <span>${['Minimal', 'Street', 'Formal', 'Vintage', 'Traditional'][i]}</span>
                        <div class="vector-bar" style="width: ${Math.min(100, (v/2)*100)}%"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- Event Listeners ---

startBtn.addEventListener('click', startTest);

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.padding = '0.8rem 0';
    } else {
        header.style.padding = '1.5rem 0';
    }
});

document.getElementById('test-skip-btn').addEventListener('click', skipToResults);

function skipToResults() {
    // Hide sections
    testSection.classList.add('hidden');
    heroSection.classList.add('hidden');
    
    // Show results
    recommendationsSection.classList.remove('hidden');
    recommendationsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Render default or current if any
    showResults();
}

function resetTest(e) {
    if (e) e.preventDefault();
    
    currentStep = 0;
    testPool = [];
    userVector = [0, 0, 0, 0, 0];
    
    heroSection.classList.remove('hidden');
    testSection.classList.add('hidden');
    recommendationsSection.classList.add('hidden');
    progress.style.width = '0%';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('nav-style-test').addEventListener('click', resetTest);
document.querySelector('.logo').addEventListener('click', resetTest);
