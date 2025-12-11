// JavaScript for Upload Page (upload.html)

let selectedImageData = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeUploadForm();
});

function initializeUploadForm() {
    const uploadForm = document.getElementById('uploadForm');
    const imageUploadArea = document.getElementById('imageUploadArea');
    const itemImage = document.getElementById('itemImage');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    const removeImage = document.getElementById('removeImage');

    // Click to upload
    imageUploadArea.addEventListener('click', () => {
        itemImage.click();
    });

    // File selection
    itemImage.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            await handleImageUpload(file);
        }
    });

    // Drag and drop
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.style.borderColor = 'var(--primary-color)';
    });

    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.style.borderColor = 'var(--border-color)';
    });

    imageUploadArea.addEventListener('drop', async (e) => {
        e.preventDefault();
        imageUploadArea.style.borderColor = 'var(--border-color)';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await handleImageUpload(file);
        }
    });

    // Remove image
    removeImage.addEventListener('click', (e) => {
        e.stopPropagation();
        clearImagePreview();
    });

    // Form submission
    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmit();
    });

    // Form reset
    uploadForm.addEventListener('reset', () => {
        clearImagePreview();
    });

    async function handleImageUpload(file) {
        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            Utils.showError('Image size must be less than 5MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            Utils.showError('Please upload a valid image file');
            return;
        }

        try {
            // Convert to base64
            selectedImageData = await Utils.fileToBase64(file);
            
            // Show preview
            previewImg.src = selectedImageData;
            uploadPlaceholder.style.display = 'none';
            imagePreview.style.display = 'block';
        } catch (error) {
            console.error('Error processing image:', error);
            Utils.showError('Error processing image. Please try again.');
        }
    }

    function clearImagePreview() {
        selectedImageData = null;
        itemImage.value = '';
        previewImg.src = '';
        uploadPlaceholder.style.display = 'flex';
        imagePreview.style.display = 'none';
    }

    async function handleFormSubmit() {
        // Validate image
        if (!selectedImageData) {
            Utils.showError('Please upload an image');
            return;
        }

        const formData = new FormData(uploadForm);
        const title = formData.get('title').trim();
        const category = formData.get('category');
        const tagsInput = formData.get('tags').trim();

        // Validate required fields
        if (!title || !category) {
            Utils.showError('Please fill in all required fields');
            return;
        }

        // Process tags
        const tags = tagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        // Create item data
        const itemData = {
            title: title,
            category: category,
            image_url: selectedImageData,
            tags: tags
        };

        try {
            // Disable submit button
            const submitBtn = uploadForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            // Save to database
            await API.createItem(itemData);

            // Show success message
            Utils.showSuccess('Item added successfully!');

            // Reset form after a short delay
            setTimeout(() => {
                uploadForm.reset();
                clearImagePreview();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Item';
            }, 1500);

        } catch (error) {
            console.error('Error saving item:', error);
            Utils.showError('Failed to save item. Please try again.');
            
            // Re-enable submit button
            const submitBtn = uploadForm.querySelector('button[type="submit"]');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Item';
        }
    }
}
