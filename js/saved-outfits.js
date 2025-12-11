// JavaScript for Saved Outfits Page (saved-outfits.html)

let allOutfits = [];
let allItems = [];
let currentViewingOutfitId = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeSavedOutfits();
});

function initializeSavedOutfits() {
    loadData();
    setupEventListeners();
}

function setupEventListeners() {
    // View modal
    const closeViewModal = document.getElementById('closeViewModal');
    const closeDetailsBtn = document.getElementById('closeDetailsBtn');
    const deleteOutfitBtn = document.getElementById('deleteOutfitBtn');

    if (closeViewModal) {
        closeViewModal.addEventListener('click', closeViewModalFn);
    }

    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', closeViewModalFn);
    }

    if (deleteOutfitBtn) {
        deleteOutfitBtn.addEventListener('click', handleDeleteOutfit);
    }

    // Close modal on outside click
    const modal = document.getElementById('viewModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeViewModalFn();
            }
        });
    }
}

async function loadData() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const savedOutfitsGrid = document.getElementById('savedOutfitsGrid');
    const emptyState = document.getElementById('emptyState');

    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (savedOutfitsGrid) savedOutfitsGrid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'none';

    try {
        // Load outfits and items in parallel
        const [outfitsResponse, itemsResponse] = await Promise.all([
            API.getAllOutfits(),
            API.getAllItems()
        ]);

        allOutfits = outfitsResponse.data;
        allItems = itemsResponse.data;

        displayOutfits();
    } catch (error) {
        console.error('Error loading data:', error);
        Utils.showError('Failed to load saved outfits');
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

function displayOutfits() {
    const savedOutfitsGrid = document.getElementById('savedOutfitsGrid');
    const emptyState = document.getElementById('emptyState');
    const outfitCount = document.getElementById('outfitCount');

    if (!savedOutfitsGrid) return;

    // Update count
    if (outfitCount) {
        outfitCount.textContent = `${allOutfits.length} saved outfit${allOutfits.length !== 1 ? 's' : ''}`;
    }

    // Display outfits
    if (allOutfits.length === 0) {
        savedOutfitsGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        savedOutfitsGrid.innerHTML = allOutfits.map(outfit => createOutfitCardHTML(outfit)).join('');
        
        // Attach event listeners
        attachOutfitEventListeners();
    }
}

function createOutfitCardHTML(outfit) {
    // Get items for this outfit
    const shirtItem = allItems.find(item => item.id === outfit.shirt_id);
    const pantsItem = allItems.find(item => item.id === outfit.pants_id);
    const accessoriesItem = allItems.find(item => item.id === outfit.accessories_id);
    const shoesItem = allItems.find(item => item.id === outfit.shoes_id);

    // Create preview images (up to 4)
    const previewItems = [shirtItem, pantsItem, accessoriesItem, shoesItem].filter(item => item);
    
    let previewHTML = '';
    if (previewItems.length > 0) {
        previewHTML = previewItems.map(item => 
            `<img src="${item.image_url}" alt="${item.title}">`
        ).join('');
    } else {
        previewHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">No items</div>';
    }

    const date = Utils.formatDate(outfit.created_at);

    return `
        <div class="saved-outfit-card" data-id="${outfit.id}">
            <div class="saved-outfit-preview">
                ${previewHTML}
            </div>
            <div class="saved-outfit-info">
                <h3 class="saved-outfit-name">${outfit.outfit_name}</h3>
                <p class="saved-outfit-date">Saved on ${date}</p>
                <div class="saved-outfit-actions">
                    <button class="btn btn-primary view-outfit-btn" data-id="${outfit.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachOutfitEventListeners() {
    const viewBtns = document.querySelectorAll('.view-outfit-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const outfitId = btn.getAttribute('data-id');
            openViewModal(outfitId);
        });
    });

    // Also make cards clickable
    const cards = document.querySelectorAll('.saved-outfit-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const outfitId = card.getAttribute('data-id');
            openViewModal(outfitId);
        });
    });
}

function openViewModal(outfitId) {
    const outfit = allOutfits.find(o => o.id === outfitId);
    if (!outfit) return;

    currentViewingOutfitId = outfitId;

    // Update modal title
    const modalTitle = document.getElementById('modalOutfitName');
    if (modalTitle) {
        modalTitle.textContent = outfit.outfit_name;
    }

    // Get items
    const shirtItem = allItems.find(item => item.id === outfit.shirt_id);
    const pantsItem = allItems.find(item => item.id === outfit.pants_id);
    const accessoriesItem = allItems.find(item => item.id === outfit.accessories_id);
    const shoesItem = allItems.find(item => item.id === outfit.shoes_id);

    // Display outfit details
    const outfitDetailsGrid = document.getElementById('outfitDetailsGrid');
    if (outfitDetailsGrid) {
        const items = [
            { label: 'Shirt / T-shirt', item: shirtItem, icon: 'fa-tshirt' },
            { label: 'Pants / Joggers', item: pantsItem, icon: 'fa-socks' },
            { label: 'Accessories', item: accessoriesItem, icon: 'fa-gem' },
            { label: 'Shoes', item: shoesItem, icon: 'fa-shoe-prints' }
        ];

        outfitDetailsGrid.innerHTML = items.map(({ label, item, icon }) => {
            if (item) {
                return `
                    <div class="outfit-detail-item">
                        <img src="${item.image_url}" alt="${item.title}">
                        <h4>${label}</h4>
                        <p>${item.title}</p>
                    </div>
                `;
            } else {
                return `
                    <div class="outfit-detail-item">
                        <div style="height: 200px; display: flex; align-items: center; justify-content: center; background: var(--bg-color); border-radius: 0.5rem;">
                            <i class="fas ${icon}" style="font-size: 3rem; color: var(--text-secondary);"></i>
                        </div>
                        <h4>${label}</h4>
                        <p style="color: var(--text-secondary);">Not selected</p>
                    </div>
                `;
            }
        }).join('');
    }

    // Display notes if available
    const outfitNotes = document.getElementById('outfitNotes');
    const notesText = document.getElementById('notesText');
    if (outfitNotes && notesText) {
        if (outfit.notes && outfit.notes.trim()) {
            notesText.textContent = outfit.notes;
            outfitNotes.style.display = 'block';
        } else {
            outfitNotes.style.display = 'none';
        }
    }

    // Show modal
    const modal = document.getElementById('viewModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeViewModalFn() {
    const modal = document.getElementById('viewModal');
    if (modal) {
        modal.classList.remove('active');
    }
    currentViewingOutfitId = null;
}

async function handleDeleteOutfit() {
    if (!currentViewingOutfitId) return;

    if (!confirm('Are you sure you want to delete this outfit?')) {
        return;
    }

    try {
        await API.deleteOutfit(currentViewingOutfitId);
        Utils.showSuccess('Outfit deleted successfully!');
        closeViewModalFn();
        await loadData();
    } catch (error) {
        console.error('Error deleting outfit:', error);
        Utils.showError('Failed to delete outfit');
    }
}
