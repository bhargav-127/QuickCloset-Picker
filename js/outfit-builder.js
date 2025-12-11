// JavaScript for Outfit Builder Page (outfit-builder.html)

let allItems = {
    shirts: [],
    pants: [],
    accessories: [],
    shoes: []
};

let selectedItems = {
    shirt: null,
    pants: null,
    accessories: null,
    shoes: null
};

document.addEventListener('DOMContentLoaded', () => {
    initializeOutfitBuilder();
});

function initializeOutfitBuilder() {
    loadAllItems();
    setupEventListeners();
}

function setupEventListeners() {
    // Randomize button
    const randomizeBtn = document.getElementById('randomizeBtn');
    if (randomizeBtn) {
        randomizeBtn.addEventListener('click', randomizeOutfit);
    }

    // Save outfit button
    const saveOutfitBtn = document.getElementById('saveOutfitBtn');
    if (saveOutfitBtn) {
        saveOutfitBtn.addEventListener('click', () => {
            openSaveModal();
        });
    }

    // Clear selection button
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');
    if (clearSelectionBtn) {
        clearSelectionBtn.addEventListener('click', clearSelection);
    }

    // Save modal
    const saveOutfitForm = document.getElementById('saveOutfitForm');
    const closeSaveModal = document.getElementById('closeSaveModal');
    const cancelSave = document.getElementById('cancelSave');

    if (saveOutfitForm) {
        saveOutfitForm.addEventListener('submit', handleSaveOutfit);
    }

    if (closeSaveModal) {
        closeSaveModal.addEventListener('click', closeSaveModalFn);
    }

    if (cancelSave) {
        cancelSave.addEventListener('click', closeSaveModalFn);
    }

    // Close modal on outside click
    const modal = document.getElementById('saveModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSaveModalFn();
            }
        });
    }
}

async function loadAllItems() {
    try {
        const response = await API.getAllItems();
        const items = response.data;

        // Organize items by category
        allItems.shirts = items.filter(item => item.category === 'shirts');
        allItems.pants = items.filter(item => item.category === 'pants');
        allItems.accessories = items.filter(item => item.category === 'accessories');
        allItems.shoes = items.filter(item => item.category === 'shoes');

        // Display items in selector grids
        displaySelectorItems('shirts', allItems.shirts);
        displaySelectorItems('pants', allItems.pants);
        displaySelectorItems('accessories', allItems.accessories);
        displaySelectorItems('shoes', allItems.shoes);

    } catch (error) {
        console.error('Error loading items:', error);
        Utils.showError('Failed to load wardrobe items');
    }
}

function displaySelectorItems(category, items) {
    const gridId = `${category}Grid`;
    const grid = document.getElementById(gridId);
    
    if (!grid) return;

    if (items.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <p>No items in this category</p>
                <a href="upload.html" class="btn btn-primary">Add Items</a>
            </div>
        `;
        return;
    }

    grid.innerHTML = items.map(item => `
        <div class="selector-item" data-id="${item.id}" data-category="${category}">
            <img src="${item.image_url}" alt="${item.title}">
            <div class="selector-item-name">${item.title}</div>
        </div>
    `).join('');

    // Attach click handlers
    const selectorItems = grid.querySelectorAll('.selector-item');
    selectorItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemId = item.getAttribute('data-id');
            const itemCategory = item.getAttribute('data-category');
            selectItem(itemId, itemCategory);
        });
    });
}

function selectItem(itemId, category) {
    const categoryKey = category === 'shirts' ? 'shirt' : 
                       category === 'pants' ? 'pants' :
                       category === 'accessories' ? 'accessories' : 'shoes';
    
    // Find the item
    const item = allItems[category].find(i => i.id === itemId);
    if (!item) return;

    // Update selected items
    selectedItems[categoryKey] = item;

    // Update UI
    updateSelectedItemDisplay(categoryKey, item);
    updateSelectorHighlight(category, itemId);
    updateSaveButton();
}

function updateSelectedItemDisplay(categoryKey, item) {
    const displayMap = {
        'shirt': 'selectedShirt',
        'pants': 'selectedPants',
        'accessories': 'selectedAccessories',
        'shoes': 'selectedShoes'
    };

    const displayId = displayMap[categoryKey];
    const displayElement = document.getElementById(displayId);
    
    if (!displayElement) return;

    displayElement.innerHTML = `
        <div class="outfit-item-selected">
            <img src="${item.image_url}" alt="${item.title}">
            <div class="item-name">${item.title}</div>
            <button class="remove-item" data-category="${categoryKey}">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    displayElement.classList.add('selected');

    // Add remove handler
    const removeBtn = displayElement.querySelector('.remove-item');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = removeBtn.getAttribute('data-category');
            removeSelectedItem(category);
        });
    }
}

function updateSelectorHighlight(category, itemId) {
    const gridId = `${category}Grid`;
    const grid = document.getElementById(gridId);
    
    if (!grid) return;

    // Remove previous selection
    grid.querySelectorAll('.selector-item').forEach(item => {
        item.classList.remove('selected');
    });

    // Highlight selected item
    const selectedItem = grid.querySelector(`[data-id="${itemId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
}

function removeSelectedItem(categoryKey) {
    selectedItems[categoryKey] = null;

    // Update display
    const displayMap = {
        'shirt': 'selectedShirt',
        'pants': 'selectedPants',
        'accessories': 'selectedAccessories',
        'shoes': 'selectedShoes'
    };

    const iconMap = {
        'shirt': { icon: 'fa-tshirt', text: 'Select a Shirt' },
        'pants': { icon: 'fa-socks', text: 'Select Pants' },
        'accessories': { icon: 'fa-gem', text: 'Select Accessories' },
        'shoes': { icon: 'fa-shoe-prints', text: 'Select Shoes' }
    };

    const displayId = displayMap[categoryKey];
    const displayElement = document.getElementById(displayId);
    
    if (displayElement) {
        const info = iconMap[categoryKey];
        displayElement.innerHTML = `
            <div class="outfit-item-placeholder">
                <i class="fas ${info.icon}"></i>
                <p>${info.text}</p>
            </div>
        `;
        displayElement.classList.remove('selected');
    }

    // Remove highlight from selector
    const categoryMap = {
        'shirt': 'shirts',
        'pants': 'pants',
        'accessories': 'accessories',
        'shoes': 'shoes'
    };

    const category = categoryMap[categoryKey];
    const gridId = `${category}Grid`;
    const grid = document.getElementById(gridId);
    
    if (grid) {
        grid.querySelectorAll('.selector-item').forEach(item => {
            item.classList.remove('selected');
        });
    }

    updateSaveButton();
}

function clearSelection() {
    selectedItems = {
        shirt: null,
        pants: null,
        accessories: null,
        shoes: null
    };

    // Clear all displays
    ['shirt', 'pants', 'accessories', 'shoes'].forEach(category => {
        removeSelectedItem(category);
    });

    Utils.showSuccess('Selection cleared');
}

function randomizeOutfit() {
    // Clear current selection
    clearSelection();

    // Select random items from each category
    if (allItems.shirts.length > 0) {
        const randomShirt = allItems.shirts[Math.floor(Math.random() * allItems.shirts.length)];
        selectItem(randomShirt.id, 'shirts');
    }

    if (allItems.pants.length > 0) {
        const randomPants = allItems.pants[Math.floor(Math.random() * allItems.pants.length)];
        selectItem(randomPants.id, 'pants');
    }

    if (allItems.accessories.length > 0) {
        const randomAccessories = allItems.accessories[Math.floor(Math.random() * allItems.accessories.length)];
        selectItem(randomAccessories.id, 'accessories');
    }

    if (allItems.shoes.length > 0) {
        const randomShoes = allItems.shoes[Math.floor(Math.random() * allItems.shoes.length)];
        selectItem(randomShoes.id, 'shoes');
    }

    Utils.showSuccess('Random outfit generated!');
}

function updateSaveButton() {
    const saveBtn = document.getElementById('saveOutfitBtn');
    if (!saveBtn) return;

    // Enable button if at least one item is selected
    const hasSelection = Object.values(selectedItems).some(item => item !== null);
    saveBtn.disabled = !hasSelection;
}

function openSaveModal() {
    const modal = document.getElementById('saveModal');
    if (modal) {
        modal.classList.add('active');
        // Focus on outfit name input
        const outfitNameInput = document.getElementById('outfitName');
        if (outfitNameInput) {
            setTimeout(() => outfitNameInput.focus(), 100);
        }
    }
}

function closeSaveModalFn() {
    const modal = document.getElementById('saveModal');
    if (modal) {
        modal.classList.remove('active');
        // Reset form
        const form = document.getElementById('saveOutfitForm');
        if (form) form.reset();
    }
}

async function handleSaveOutfit(e) {
    e.preventDefault();

    const outfitName = document.getElementById('outfitName').value.trim();
    const outfitNotes = document.getElementById('outfitNotes').value.trim();

    if (!outfitName) {
        Utils.showError('Please enter an outfit name');
        return;
    }

    // Check if at least one item is selected
    const hasSelection = Object.values(selectedItems).some(item => item !== null);
    if (!hasSelection) {
        Utils.showError('Please select at least one item');
        return;
    }

    const outfitData = {
        outfit_name: outfitName,
        shirt_id: selectedItems.shirt ? selectedItems.shirt.id : null,
        pants_id: selectedItems.pants ? selectedItems.pants.id : null,
        accessories_id: selectedItems.accessories ? selectedItems.accessories.id : null,
        shoes_id: selectedItems.shoes ? selectedItems.shoes.id : null,
        notes: outfitNotes
    };

    try {
        await API.createOutfit(outfitData);
        Utils.showSuccess('Outfit saved successfully!');
        closeSaveModalFn();
        
        // Optionally clear selection after saving
        setTimeout(() => {
            if (confirm('Would you like to create another outfit?')) {
                clearSelection();
            }
        }, 1000);

    } catch (error) {
        console.error('Error saving outfit:', error);
        Utils.showError('Failed to save outfit');
    }
}
