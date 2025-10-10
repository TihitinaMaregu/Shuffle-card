document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cardContainer = document.getElementById('cardContainer');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const resetBtn = document.getElementById('resetBtn');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const modal = document.getElementById('cardModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close');

    // Sample data for cards (can be replaced with your own content)
    const cardData = [
        {
            title: 'Active Recall',
            content: 'Active recall is the process of actively stimulating memory during the learning process.'
        },
        {
            title: 'Spaced Repetition',
            content: 'Spaced repetition is an evidence-based learning technique that incorporates increasing intervals of time between subsequent review of previously learned material.'
        },
        {
            title: 'Interleaving',
            content: 'Interleaving is a learning technique that involves mixing different topics or forms of practice to improve learning.'
        },
        {
            title: 'Elaboration',
            content: 'Elaboration involves explaining and describing ideas with many details and making connections between different ideas.'
        },
        {
            title: 'Dual Coding',
            content: 'Dual coding is combining verbal and visual information to enhance learning and memory.'
        },
        {
            title: 'Concrete Examples',
            content: 'Using specific examples to understand abstract ideas makes them more concrete and easier to understand.'
        }
    ];

    let currentCards = [];
    let viewedCards = new Set();
    let activeCardIndex = 0;

    // Initialize the application
    function init() {
        resetCards();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        shuffleBtn.addEventListener('click', shuffleCards);
        resetBtn.addEventListener('click', resetCards);
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal when clicking outside the content
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    // Create card element
    function createCard(card, index) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.style.animationDelay = `${index * 0.1}s`;
        
        cardElement.innerHTML = `
            <h3>${card.title}</h3>
            <p>${card.content.substring(0, 60)}...</p>
        `;

        cardElement.addEventListener('click', () => showCardDetails(card));
        return cardElement;
    }

    // Show card details in modal
    function showCardDetails(card) {
        modalTitle.textContent = card.title;
        modalContent.textContent = card.content;
        modal.classList.add('active');
        
        // Mark as viewed if not already
        if (!viewedCards.has(card.title)) {
            viewedCards.add(card.title);
            updateProgress();
        }
    }

    // Shuffle cards using Fisher-Yates algorithm
    function shuffleCards() {
        // Remove all cards with fade out effect
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeOut 0.3s ease-out ${index * 0.05}s forwards`;
        });

        // Shuffle the array
        for (let i = currentCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [currentCards[i], currentCards[j]] = [currentCards[j], currentCards[i]];
        }

        // Clear the container and re-add shuffled cards
        setTimeout(() => {
            cardContainer.innerHTML = '';
            currentCards.forEach((card, index) => {
                const cardElement = createCard(card, index);
                cardContainer.appendChild(cardElement);
            });
        }, 300);
    }

    // Reset cards to initial state
    function resetCards() {
        currentCards = [...cardData];
        viewedCards.clear();
        activeCardIndex = 0;
        
        // Clear and re-render cards
        cardContainer.innerHTML = '';
        currentCards.forEach((card, index) => {
            const cardElement = createCard(card, index);
            cardContainer.appendChild(cardElement);
        });
        
        updateProgress();
    }

    // Update progress bar and text
    function updateProgress() {
        const totalCards = cardData.length;
        const viewedCount = viewedCards.size;
        const progress = (viewedCount / totalCards) * 100;
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${viewedCount}/${totalCards}`;
        
        // Change progress bar color based on completion
        if (progress < 30) {
            progressBar.style.backgroundColor = '#ff4d4f';
        } else if (progress < 70) {
            progressBar.style.backgroundColor = '#faad14';
        } else {
            progressBar.style.backgroundColor = '#52c41a';
        }
    }

    // Add fadeOut animation to stylesheet if not exists
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize the app
    init();
});
