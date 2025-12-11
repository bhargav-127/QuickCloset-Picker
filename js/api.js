// API Service for QuickCloset Picker
// Handles all data operations using the RESTful Table API

// Base URL can be overridden from the page by setting `window.API_BASE_URL`.
// Default points to a local json-server instance used for quick testing.
const BASE_URL = (window.API_BASE_URL && window.API_BASE_URL.endsWith('/'))
    ? window.API_BASE_URL
    : (window.API_BASE_URL ? window.API_BASE_URL + '/' : 'http://localhost:3000/');

const API = {
    // Base configuration
    tables: {
        wardrobeItems: 'wardrobe_items',
        savedOutfits: 'saved_outfits'
    },

    // Wardrobe Items API
    async getAllItems(category = null, page = 1, limit = 100) {
        try {
            let url = `tables/${this.tables.wardrobeItems}?page=${page}&limit=${limit}`;
            
            const response = await fetch(BASE_URL + url);
            if (!response.ok) throw new Error('Failed to fetch items');
            
            const data = await response.json();
            
            // Filter by category if specified
            if (category) {
                data.data = data.data.filter(item => item.category === category);
                data.total = data.data.length;
            }
            
            return data;
        } catch (error) {
            console.error('Error fetching items:', error);
            return { data: [], total: 0, page: 1, limit: limit };
        }
    },

    async getItemById(id) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.wardrobeItems}/${id}`);
            if (!response.ok) throw new Error('Item not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching item:', error);
            return null;
        }
    },

    async createItem(itemData) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.wardrobeItems}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
            
            if (!response.ok) throw new Error('Failed to create item');
            return await response.json();
        } catch (error) {
            console.error('Error creating item:', error);
            throw error;
        }
    },

    async updateItem(id, itemData) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.wardrobeItems}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });
            
            if (!response.ok) throw new Error('Failed to update item');
            return await response.json();
        } catch (error) {
            console.error('Error updating item:', error);
            throw error;
        }
    },

    async deleteItem(id) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.wardrobeItems}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete item');
            return true;
        } catch (error) {
            console.error('Error deleting item:', error);
            throw error;
        }
    },

    // Saved Outfits API
    async getAllOutfits(page = 1, limit = 100) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.savedOutfits}?page=${page}&limit=${limit}&sort=-created_at`);
            if (!response.ok) throw new Error('Failed to fetch outfits');
            return await response.json();
        } catch (error) {
            console.error('Error fetching outfits:', error);
            return { data: [], total: 0, page: 1, limit: limit };
        }
    },

    async getOutfitById(id) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.savedOutfits}/${id}`);
            if (!response.ok) throw new Error('Outfit not found');
            return await response.json();
        } catch (error) {
            console.error('Error fetching outfit:', error);
            return null;
        }
    },

    async createOutfit(outfitData) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.savedOutfits}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(outfitData)
            });
            
            if (!response.ok) throw new Error('Failed to create outfit');
            return await response.json();
        } catch (error) {
            console.error('Error creating outfit:', error);
            throw error;
        }
    },

    async deleteOutfit(id) {
        try {
            const response = await fetch(BASE_URL + `tables/${this.tables.savedOutfits}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete outfit');
            return true;
        } catch (error) {
            console.error('Error deleting outfit:', error);
            throw error;
        }
    },

    // Statistics and aggregation
    async getStats() {
        try {
            const [items, outfits] = await Promise.all([
                this.getAllItems(),
                this.getAllOutfits()
            ]);

            const stats = {
                totalItems: items.data.length,
                totalOutfits: outfits.data.length,
                byCategory: {
                    shirts: items.data.filter(i => i.category === 'shirts').length,
                    pants: items.data.filter(i => i.category === 'pants').length,
                    accessories: items.data.filter(i => i.category === 'accessories').length,
                    shoes: items.data.filter(i => i.category === 'shoes').length
                }
            };

            return stats;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalItems: 0,
                totalOutfits: 0,
                byCategory: { shirts: 0, pants: 0, accessories: 0, shoes: 0 }
            };
        }
    }
};

// Utility functions
const Utils = {
    // Convert file to base64 for storage
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    // Format date
    formatDate(timestamp) {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Show success message
    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.querySelector('span').textContent = message;
            successDiv.style.display = 'flex';
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 3000);
        }
    },

    // Show error message
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.querySelector('#errorText').textContent = message;
            errorDiv.style.display = 'flex';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 3000);
        }
    },

    // Get category display name
    getCategoryName(category) {
        const names = {
            'shirts': 'Shirts & T-shirts',
            'pants': 'Pants & Joggers',
            'accessories': 'Accessories',
            'shoes': 'Shoes'
        };
        return names[category] || category;
    },

    // Get category icon
    getCategoryIcon(category) {
        const icons = {
            'shirts': 'fa-tshirt',
            'pants': 'fa-socks',
            'accessories': 'fa-gem',
            'shoes': 'fa-shoe-prints'
        };
        return icons[category] || 'fa-question';
    }
};
