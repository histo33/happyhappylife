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
    { id: 101, name: 'Essential Oversized Tee', brand: 'StyleFit', price: '29,000', vector: [0.85, 0.3, 0.1, 0.2, 0.0], image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80' },
    { id: 102, name: 'Cargo Tech Pants', brand: 'NeoStreet', price: '89,000', vector: [0.2, 0.95, 0.4, 0.1, 0.0], image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80' },
    { id: 103, name: 'Wool Tailored Blazer', brand: 'Classy', price: '159,000', vector: [0.2, 0.1, 0.9, 0.3, 0.2], image: 'https://images.unsplash.com/photo-1507679799987-c7377ec486b8?auto=format&fit=crop&w=300&q=80' },
    { id: 104, name: 'Retro Denim Jacket', brand: 'OldSchool', price: '75,000', vector: [0.5, 0.4, 0.2, 0.85, 0.1], image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=300&q=80' },
    { id: 105, name: 'Linen Dress Shirt', brand: 'Minimal', price: '55,000', vector: [0.95, 0.2, 0.4, 0.1, 0.1], image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&w=300&q=80' }
];

// --- Application State ---
let currentStep = 0;
const totalSteps = 4; // Adjusted to 4 rounds for 8 images
let userVector = [0, 0, 0, 0, 0]; // [Minimalist, Streetwear, Formal, Vintage, Traditional]
let testPool = [];

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
