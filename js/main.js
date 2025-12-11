// Main JavaScript for Homepage (index.html)

document.addEventListener('DOMContentLoaded', async () => {
    await loadStats();
});

async function loadStats() {
    try {
        const stats = await API.getStats();
        
        // Update stat numbers
        document.getElementById('totalItems').textContent = stats.totalItems;
        document.getElementById('totalOutfits').textContent = stats.totalOutfits;
        document.getElementById('totalShirts').textContent = stats.byCategory.shirts;
        document.getElementById('totalPants').textContent = stats.byCategory.pants;
        
        // Animate numbers
        animateValue('totalItems', 0, stats.totalItems, 1000);
        animateValue('totalOutfits', 0, stats.totalOutfits, 1000);
        animateValue('totalShirts', 0, stats.byCategory.shirts, 1000);
        animateValue('totalPants', 0, stats.byCategory.pants, 1000);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}
