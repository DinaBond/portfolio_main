// Stacking Cards Animation
// Implementation using vanilla JavaScript without dependencies

const initStackingCards = () => {
  // Select the container and all case study section cards
  const cardsWrapper = document.querySelector('.case-study-container');
  const cards = document.querySelectorAll('.case-study-section');

  if (!cardsWrapper || cards.length === 0) return;

  // Configure basic styling for the container
  cardsWrapper.style.position = 'relative';
  cardsWrapper.style.paddingBottom = '400px'; // Extra space for scrolling
  
  const numCards = cards.length;
  
  // Configure card variables
  const cardTopOffset = 30; // Space between stacked cards when visible
  
  // Set up each card with proper styling for stacking effect
  cards.forEach((card, index) => {
    // Store original index for animation calculations
    card.setAttribute('data-index', index);
    
    // Configure card styling
    card.style.position = 'sticky';
    card.style.top = '20px'; // Distance from top when sticky
    card.style.width = '100%';
    card.style.maxWidth = '900px';
    card.style.margin = '0 auto';
    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    card.style.overflow = 'hidden';
    card.style.background = '#ffffff';
    card.style.borderRadius = '18px';
    
    // Add top padding to create the staggered appearance
    // Each card gets progressively more top padding
    card.style.paddingTop = `${index * cardTopOffset + 40}px`;
    
    // We'll apply a margin to create space between cards when scrolling
    if (index > 0) {
      card.style.marginTop = '60px';
    }
  });
  
  // Function to handle the proper z-index of cards
  const updateZIndices = () => {
    const viewportCenter = window.innerHeight / 2;
    
    // Create an array of cards with their positions
    const cardPositions = Array.from(cards).map(card => {
      const rect = card.getBoundingClientRect();
      const centerY = rect.top + (rect.height / 2);
      return {
        element: card,
        distance: Math.abs(centerY - viewportCenter),
        top: rect.top
      };
    });
    
    // Sort cards by their distance from the active viewing area
    // Cards currently being viewed should be on top
    cardPositions.sort((a, b) => {
      // If one card is above the sticky threshold and another is at it,
      // the one at the threshold (being viewed) should be on top
      if (a.top <= 20 && b.top > 20) return -1;
      if (a.top > 20 && b.top <= 20) return 1;
      
      // If both cards are at sticky position, the one closer to the center of attention 
      // (which would be the one we're scrolling to) should be on top
      if (a.top <= 20 && b.top <= 20) {
        return a.distance - b.distance;
      }
      
      // If neither card is at sticky position, maintain natural stacking order
      return 0;
    });
    
    // Apply z-index values 
    // Cards that are actively being viewed (sticky at top) get highest z-index
    cardPositions.forEach((cardPosition, index) => {
      const zIndex = cardPositions.length - index;
      cardPosition.element.style.zIndex = zIndex;
    });
  };
  
  // Add scroll event listener to handle card animations and z-indices
  window.addEventListener('scroll', () => {
    // Get current scroll position
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    // Get container position
    const containerRect = cardsWrapper.getBoundingClientRect();
    const containerTop = containerRect.top + scrollTop;
    
    // Calculate how far we've scrolled into the container
    const scrollProgress = (scrollTop - containerTop) / containerRect.height;
    
    cards.forEach((card) => {
      const index = parseInt(card.getAttribute('data-index'), 10);
      const cardRect = card.getBoundingClientRect();
      
      // Calculate how far the card is from the top of the viewport
      const cardTop = cardRect.top;
      
      // Apply scaling effect when card reaches top of viewport
      if (cardTop <= 20) { // Same as the sticky top value
        // Scale down slightly as it reaches the top
        const scale = Math.max(0.9, 1 - (Math.abs(cardTop - 20) / windowHeight) * 0.1);
        card.style.transform = `scale(${scale})`;
      } else {
        // Reset transform when card is below the top
        card.style.transform = 'scale(1)';
      }
      
      // Change position based on scroll progress
      // When we've scrolled past this card's "section"
      if (scrollProgress > (index + 1) / numCards) {
        // Make it less sticky so it can scroll out
        card.style.position = 'relative';
      } else {
        // Keep it sticky when in its active section
        card.style.position = 'sticky';
      }
    });
    
    // Update z-indices based on current scroll position
    updateZIndices();
  });
  
  // Initialize the animation by triggering scroll event
  window.dispatchEvent(new Event('scroll'));
};

// Initialize the animation when page loads
window.addEventListener('load', () => {
  if (document.querySelector('.case-study-container')) {
    initStackingCards();
  }
});

// Re-initialize when window is resized
window.addEventListener('resize', () => {
  if (document.querySelector('.case-study-container')) {
    initStackingCards();
  }
});