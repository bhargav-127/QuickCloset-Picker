// JavaScript for Gallery Page (gallery.html)

let currentCategory = 'shirts';
let allItems = [];
let currentEditItemId = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
});

function initializeGallery() {
    // Get category from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        currentCategory = categoryParam;
    }

    // Set active tab
    setActiveTab(currentCategory);

    // Update page title
    updatePageTitle();

    // Load items
    loadItems();

    // Set up event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Category tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            currentCategory = category;
            setActiveTab(category);
            updatePageTitle();
            displayItems();
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterItems(e.target.value);
        });
    }

    // Edit modal
    const editForm = document.getElementById('editForm');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');

    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmit);
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeEditModal();
        });
    }

    if (cancelEdit) {
        cancelEdit.addEventListener('click', () => {
            closeEditModal();
        });
    }

    // Close modal on outside click
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditModal();
            }
        });
    }
}

function setActiveTab(category) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updatePageTitle() {
    const title = document.getElementById('galleryTitle');
    if (title) {
        const categoryName = Utils.getCategoryName(currentCategory);
        const icon = Utils.getCategoryIcon(currentCategory);
        title.innerHTML = `<i class="fas ${icon}"></i> ${categoryName}`;
    }
}

async function loadItems() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('emptyState');

    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (galleryGrid) galleryGrid.innerHTML = '';
    if (emptyState) emptyState.style.display = 'none';

    try {
        const response = await API.getAllItems();
        allItems = response.data;
        displayItems();
    } catch (error) {
        console.error('Error loading items:', error);
        Utils.showError('Failed to load items');
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

function displayItems() {
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('emptyState');
    const itemCount = document.getElementById('itemCount');

    // Filter by category
    const filteredItems = allItems.filter(item => item.category === currentCategory);

    // Update count
    if (itemCount) {
        itemCount.textContent = `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`;
    }

    // Display items
    if (filteredItems.length === 0) {
        galleryGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        galleryGrid.innerHTML = filteredItems.map(item => createGalleryItemHTML(item)).join('');
        
        // Attach event listeners
        attachItemEventListeners();
    }
}

function filterItems(searchQuery) {
    const galleryGrid = document.getElementById('galleryGrid');
    const emptyState = document.getElementById('emptyState');
    const itemCount = document.getElementById('itemCount');

    if (!searchQuery.trim()) {
        displayItems();
        return;
    }

    const query = searchQuery.toLowerCase();
    const filteredItems = allItems.filter(item => {
        if (item.category !== currentCategory) return false;
        
        const titleMatch = item.title.toLowerCase().includes(query);
        const tagsMatch = item.tags && item.tags.some(tag => 
            tag.toLowerCase().includes(query)
        );
        
        return titleMatch || tagsMatch;
    });

    // Update count
    if (itemCount) {
        itemCount.textContent = `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''}`;
    }

    // Display filtered items
    if (filteredItems.length === 0) {
        galleryGrid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        galleryGrid.innerHTML = filteredItems.map(item => createGalleryItemHTML(item)).join('');
        attachItemEventListeners();
    }
}

function createGalleryItemHTML(item) {
    const tags = item.tags && item.tags.length > 0 
        ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
        : '<span class="tag">No tags</span>';

    return `
        <div class="gallery-item" data-id="${item.id}">
            <img src="${item.image_url}" alt="${item.title}" class="gallery-item-image">
            <div class="gallery-item-content">
                <h3 class="gallery-item-title">${item.title}</h3>
                <div class="gallery-item-tags">${tags}</div>
                <div class="gallery-item-actions">
                    <button class="icon-btn edit-btn" data-id="${item.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="icon-btn danger delete-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `;
}

function attachItemEventListeners() {
    // Edit buttons
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemId = btn.getAttribute('data-id');
            openEditModal(itemId);
        });
    });

    // Delete buttons
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const itemId = btn.getAttribute('data-id');
            await handleDelete(itemId);
        });
    });
}

function openEditModal(itemId) {
    const item = allItems.find(i => i.id === itemId);
    if (!item) return;

    currentEditItemId = itemId;

    // Populate form
    document.getElementById('editItemId').value = item.id;
    document.getElementById('editTitle').value = item.title;
    document.getElementById('editCategory').value = item.category;
    document.getElementById('editTags').value = item.tags ? item.tags.join(', ') : '';

    // Show modal
    const modal = document.getElementById('editModal');
    modal.classList.add('active');
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
    currentEditItemId = null;
}

async function handleEditSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('editTitle').value.trim();
    const category = document.getElementById('editCategory').value;
    const tagsInput = document.getElementById('editTags').value.trim();

    if (!title || !category) {
        Utils.showError('Please fill in all required fields');
        return;
    }

    const tags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

    // Get current item to preserve image
    const currentItem = allItems.find(i => i.id === currentEditItemId);
    if (!currentItem) {
        Utils.showError('Item not found');
        return;
    }

    const updatedData = {
        title: title,
        category: category,
        tags: tags,
        image_url: currentItem.image_url // Preserve image
    };

    try {
        await API.updateItem(currentEditItemId, updatedData);
        Utils.showSuccess('Item updated successfully!');
        closeEditModal();
        await loadItems();
    } catch (error) {
        console.error('Error updating item:', error);
        Utils.showError('Failed to update item');
    }
}

async function handleDelete(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        await API.deleteItem(itemId);
        Utils.showSuccess('Item deleted successfully!');
        await loadItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        Utils.showError('Failed to delete item');
    }
}
