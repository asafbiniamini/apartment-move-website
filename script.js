// App State
let currentArea = 'kitchen';
let currentUser = null;
let items = {
    kitchen: [],
    bedroom: [],
    living: [],
    bathroom: [],
    garden: [],
    office: []
};

// DOM Elements
let areaTitle, itemsContainer, addItemBtn, addItemModal, closeModalBtn, cancelAddBtn, addItemForm, navBtns;
let editItemModal, closeEditModalBtn, cancelEditBtn, editItemForm;
let viewRoomBtn, viewRoomModal, closeRoomModalBtn, roomModalTitle, roomImageInput;
let uploadPicturesBtn, uploadPicturesModal, closeUploadModalBtn, uploadModalTitle, multipleImagesInput;
let imageGallery, imageViewer, imageNavigation, prevImageBtn, nextImageBtn, imageCounter;
let imageViewerContainer, zoomInBtn, zoomOutBtn, resetZoomBtn, zoomLevel;
let panoramaViewer, normalViewBtn, panoramaViewBtn;
let createPanoramaBtn, createPanoramaModal, closePanoramaModalBtn, launchSweetHomeBtn;
let totalItemsEl, totalBudgetEl, completedItemsEl;

// Function Definitions (moved to top to avoid reference errors)

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message.replace(/\n/g, '<br>')}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// Initialize DOM Elements
function initializeDOMElements() {
    areaTitle = document.getElementById('area-title');
    itemsContainer = document.getElementById('items-container');
    addItemBtn = document.getElementById('add-item-btn');
    addItemModal = document.getElementById('add-item-modal');
    closeModalBtn = document.getElementById('close-modal');
    cancelAddBtn = document.getElementById('cancel-add');
    addItemForm = document.getElementById('add-item-form');
    navBtns = document.querySelectorAll('.nav-btn');

    // Edit modal elements
    editItemModal = document.getElementById('edit-item-modal');
    closeEditModalBtn = document.getElementById('close-edit-modal');
    cancelEditBtn = document.getElementById('cancel-edit');
    editItemForm = document.getElementById('edit-item-form');

    // Room view modal elements
    viewRoomBtn = document.getElementById('view-room-btn');
    viewRoomModal = document.getElementById('view-room-modal');
    closeRoomModalBtn = document.getElementById('close-room-modal');
    roomModalTitle = document.getElementById('room-modal-title');
    roomImageInput = document.getElementById('room-image-input');

    // Upload pictures modal elements
    uploadPicturesBtn = document.getElementById('upload-pictures-btn');
    uploadPicturesModal = document.getElementById('upload-pictures-modal');
    closeUploadModalBtn = document.getElementById('close-upload-modal');
    uploadModalTitle = document.getElementById('upload-modal-title');
    multipleImagesInput = document.getElementById('multiple-images-input');

    // Image viewer elements
    imageGallery = document.getElementById('image-gallery');
    imageViewer = document.getElementById('image-viewer');
    imageViewerContainer = document.getElementById('image-viewer-container');
    imageNavigation = document.getElementById('image-navigation');
    prevImageBtn = document.getElementById('prev-image');
    nextImageBtn = document.getElementById('next-image');
    imageCounter = document.getElementById('image-counter');
    zoomInBtn = document.getElementById('zoom-in');
    zoomOutBtn = document.getElementById('zoom-out');
    resetZoomBtn = document.getElementById('reset-zoom');
    zoomLevel = document.getElementById('zoom-level');
    panoramaViewer = document.getElementById('panorama-viewer');
    normalViewBtn = document.getElementById('normal-view-btn');
    panoramaViewBtn = document.getElementById('panorama-view-btn');
    
    // Design Room Modal Elements
    designRoomBtn = document.getElementById('design-room-btn');
    designRoomModal = document.getElementById('design-room-modal');
    closeDesignModalBtn = document.getElementById('close-design-modal');
    launchOnlineBtn = document.getElementById('launch-online-btn');
    launchDesktopBtn = document.getElementById('launch-desktop-btn');
    
    createPanoramaBtn = document.getElementById('create-panorama-btn');
    createPanoramaModal = document.getElementById('create-panorama-modal');
    closePanoramaModalBtn = document.getElementById('close-panorama-modal');
    launchSweetHomeBtn = document.getElementById('launch-sweethome-btn');
    
    // Quick Guide Modal Elements
    quickGuideBtn = document.getElementById('quick-guide-btn');
    quickGuideModal = document.getElementById('quick-guide-modal');
    closeGuideModalBtn = document.getElementById('close-guide-modal');

    // Stats elements
    totalItemsEl = document.getElementById('total-items');
    totalBudgetEl = document.getElementById('total-budget');
    completedItemsEl = document.getElementById('completed-items');

    // Debug logging
    console.log('DOM Elements initialized:');
    console.log('viewRoomBtn:', viewRoomBtn);
    console.log('viewRoomModal:', viewRoomModal);
    console.log('roomModalTitle:', roomModalTitle);
}

// Modal Functions
function openModal() {
    addItemModal.classList.add('show');
    document.getElementById('item-name').focus();
    
    // Initialize priority buttons
    updatePriorityButtons('item-priority');
}

function closeModal() {
    addItemModal.classList.remove('show');
    addItemForm.reset();
}

function closeEditModal() {
    editItemModal.classList.remove('show');
    editItemForm.reset();
}

function closeRoomModal() {
    viewRoomModal.classList.remove('show');
}

function closeUploadModal() {
    uploadPicturesModal.classList.remove('show');
}

// Open Room Modal
function openRoomModal() {
    console.log('openRoomModal called');
    
    const areaNames = {
        kitchen: 'Kitchen',
        bedroom: 'Bedroom',
        living: 'Living Room',
        bathroom: 'Bathroom',
        garden: 'Garden',
        office: 'Office'
    };
    
    if (roomModalTitle) {
        roomModalTitle.textContent = areaNames[currentArea];
    }
    
    if (viewRoomModal) {
        viewRoomModal.classList.add('show');
        console.log('Room modal should be visible now');
    } else {
        console.error('View room modal not found!');
    }
    
    loadRoomImages();
}

// Open Upload Pictures Modal
function openUploadModal() {
    console.log('openUploadModal called');
    
    const areaNames = {
        kitchen: 'Kitchen',
        bedroom: 'Bedroom',
        living: 'Living Room',
        bathroom: 'Bathroom',
        garden: 'Garden',
        office: 'Office'
    };
    
    if (uploadModalTitle) {
        uploadModalTitle.textContent = `Upload Pictures - ${areaNames[currentArea]}`;
    }
    
    if (uploadPicturesModal) {
        uploadPicturesModal.classList.add('show');
        console.log('Upload modal should be visible now');
    } else {
        console.error('Upload pictures modal not found!');
    }
    
    loadImageGallery();
}

// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            saveRoomImage(imageData);
            displayRoomImage(imageData);
        };
        reader.readAsDataURL(file);
    }
}

// Save Room Image
function saveRoomImage(imageData) {
    const roomImages = JSON.parse(localStorage.getItem('roomImages') || '{}');
    roomImages[currentArea] = imageData;
    localStorage.setItem('roomImages', JSON.stringify(roomImages));
}

// Load Room Image
function loadRoomImage() {
    const roomImages = JSON.parse(localStorage.getItem('roomImages') || '{}');
    const imageData = roomImages[currentArea];
    if (imageData) {
        displayRoomImage(imageData);
    } else {
        displayPlaceholder();
    }
}

// Display Room Image
function displayRoomImage(imageData) {
    const roomImageContainer = document.getElementById('room-image');
    roomImageContainer.innerHTML = `
        <img src="${imageData}" alt="Room Image" class="room-image-display">
        <div class="room-image-controls">
            <button class="control-btn remove-image-btn" onclick="removeRoomImage()">
                <i class="fas fa-trash"></i> Remove Image
            </button>
        </div>
    `;
}

// Display Placeholder
function displayPlaceholder() {
    const roomImageContainer = document.getElementById('room-image');
    roomImageContainer.innerHTML = `
        <i class="fas fa-image"></i>
        <p>Room image will be displayed here</p>
        <small>You can update this image later</small>
    `;
}

// Remove Room Image
function removeRoomImage() {
    const roomImages = JSON.parse(localStorage.getItem('roomImages') || '{}');
    delete roomImages[currentArea];
    localStorage.setItem('roomImages', JSON.stringify(roomImages));
    displayPlaceholder();
}

// Multiple Image Handling
let currentImageIndex = 0;
let roomImages = [];

// Zoom functionality
let currentZoom = 1;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let currentTranslateX = 0;
let currentTranslateY = 0;

// Panorama viewer
let photoSphereViewer = null;
let currentViewMode = 'normal';

// Handle Multiple Image Upload
function handleMultipleImageUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                saveRoomImageToGallery(imageData);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Save Image to Gallery
function saveRoomImageToGallery(imageData) {
    const roomImagesData = JSON.parse(localStorage.getItem('roomImagesGallery') || '{}');
    if (!roomImagesData[currentArea]) {
        roomImagesData[currentArea] = [];
    }
    roomImagesData[currentArea].push(imageData);
    localStorage.setItem('roomImagesGallery', JSON.stringify(roomImagesData));
    loadImageGallery();
}

// Load Image Gallery
function loadImageGallery() {
    const roomImagesData = JSON.parse(localStorage.getItem('roomImagesGallery') || '{}');
    let images = roomImagesData[currentArea] || [];
    
    // Add living room files if we're in the living room area and no images exist
    if (currentArea === 'living' && images.length === 0) {
        // Add the living room image and test panorama
        images.push('living room.png');
        images.push('test_panorama.jpg');
        // Save to localStorage
        roomImagesData[currentArea] = images;
        localStorage.setItem('roomImagesGallery', JSON.stringify(roomImagesData));
    }
    
    if (imageGallery) {
        if (images.length === 0) {
            imageGallery.innerHTML = '<p style="text-align: center; color: #718096;">No images uploaded yet</p>';
        } else {
            imageGallery.innerHTML = images.map((imageData, index) => `
                <div class="gallery-item">
                    <img src="${imageData}" alt="Room Image ${index + 1}">
                    <button class="remove-btn" onclick="removeGalleryImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');
        }
    }
}

// Remove Gallery Image
function removeGalleryImage(index) {
    const roomImagesData = JSON.parse(localStorage.getItem('roomImagesGallery') || '{}');
    if (roomImagesData[currentArea]) {
        roomImagesData[currentArea].splice(index, 1);
        localStorage.setItem('roomImagesGallery', JSON.stringify(roomImagesData));
        loadImageGallery();
    }
}

// Load Room Images for Viewer
function loadRoomImages() {
    const roomImagesData = JSON.parse(localStorage.getItem('roomImagesGallery') || '{}');
    roomImages = roomImagesData[currentArea] || [];
    
    // Add living room files if we're in the living room area and no images exist
    if (currentArea === 'living' && roomImages.length === 0) {
        roomImages.push('living room.png');
        roomImages.push('test_panorama.jpg');
        // Save to localStorage
        roomImagesData[currentArea] = roomImages;
        localStorage.setItem('roomImagesGallery', JSON.stringify(roomImagesData));
    }
    
    currentImageIndex = 0;
    
    if (roomImages.length > 0) {
        displayCurrentImage();
        if (imageNavigation) {
            imageNavigation.style.display = 'flex';
        }
    } else {
        displayPlaceholder();
        if (imageNavigation) {
            imageNavigation.style.display = 'none';
        }
    }
}

// Display Current Image
function displayCurrentImage() {
    if (roomImages.length > 0 && currentImageIndex < roomImages.length) {
        if (imageViewer) {
            imageViewer.innerHTML = `<img src="${roomImages[currentImageIndex]}" alt="Room Image">`;
            // Reset zoom when changing images
            currentZoom = 1;
            currentTranslateX = 0;
            currentTranslateY = 0;
            updateZoom();
            initDrag();
        }
        if (imageCounter) {
            imageCounter.textContent = `${currentImageIndex + 1} / ${roomImages.length}`;
        }
        
        // If in panorama mode, update the panorama viewer
        if (currentViewMode === 'panorama') {
            initPanoramaViewer();
        }
    }
}

// Navigation Functions
function showPreviousImage() {
    if (roomImages.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + roomImages.length) % roomImages.length;
        displayCurrentImage();
    }
}

function showNextImage() {
    if (roomImages.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % roomImages.length;
        displayCurrentImage();
    }
}

// Zoom Functions
function zoomIn() {
    if (currentZoom < 3) {
        currentZoom += 0.25;
        updateZoom();
    }
}

function zoomOut() {
    if (currentZoom > 0.5) {
        currentZoom -= 0.25;
        updateZoom();
    }
}

function resetZoom() {
    currentZoom = 1;
    currentTranslateX = 0;
    currentTranslateY = 0;
    updateZoom();
}

function updateZoom() {
    const img = imageViewer.querySelector('img');
    if (img) {
        img.style.transform = `scale(${currentZoom}) translate(${currentTranslateX}px, ${currentTranslateY}px)`;
        if (zoomLevel) {
            zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
        }
    }
}

// Drag functionality
function initDrag() {
    const img = imageViewer.querySelector('img');
    if (!img) return;

    img.addEventListener('mousedown', startDrag);
    img.addEventListener('mousemove', drag);
    img.addEventListener('mouseup', endDrag);
    img.addEventListener('mouseleave', endDrag);
}

function startDrag(e) {
    if (currentZoom > 1) {
        isDragging = true;
        dragStartX = e.clientX - currentTranslateX;
        dragStartY = e.clientY - currentTranslateY;
        imageViewer.style.cursor = 'grabbing';
    }
}

function drag(e) {
    if (isDragging && currentZoom > 1) {
        e.preventDefault();
        currentTranslateX = e.clientX - dragStartX;
        currentTranslateY = e.clientY - dragStartY;
        updateZoom();
    }
}

function endDrag() {
    isDragging = false;
    imageViewer.style.cursor = 'grab';
}

// Panorama Functions
function switchViewMode(mode) {
    currentViewMode = mode;
    
    if (mode === 'normal') {
        imageViewer.style.display = 'flex';
        panoramaViewer.style.display = 'none';
        if (photoSphereViewer) {
            photoSphereViewer.destroy();
            photoSphereViewer = null;
        }
    } else if (mode === 'panorama') {
        imageViewer.style.display = 'none';
        panoramaViewer.style.display = 'block';
        initPanoramaViewer();
    }
    
    // Update button states
    document.querySelectorAll('.view-mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
}

function initPanoramaViewer() {
    if (roomImages.length > 0 && currentImageIndex < roomImages.length) {
        const imageUrl = roomImages[currentImageIndex];
        
        // Check if image is a 360 panorama (you can add detection logic here)
        const isPanorama = detectPanorama(imageUrl);
        
        if (isPanorama) {
            if (photoSphereViewer) {
                photoSphereViewer.destroy();
            }
            
            photoSphereViewer = new PhotoSphereViewer.Viewer({
                container: panoramaViewer,
                panorama: imageUrl,
                navbar: ['zoom', 'fullscreen', 'move', 'download'],
                defaultZoomLvl: 0,
                moveSpeed: 1.5,
                zoomSpeed: 1.5,
                loadingImg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDVMMzAgMTVIMTZMMjAgNVoiIGZpbGw9IiM5Q0E2QjIiLz4KPHBhdGggZD0iTTIwIDM1TDEwIDI1SDE2TDIwIDM1WiIgZmlsbD0iIzlDQUE2QjIiLz4KPHBhdGggZD0iTTUgMjBMMTUgMzBWMjZMNyAyMEg1WiIgZmlsbD0iIzlDQUE2QjIiLz4KPHBhdGggZD0iTTM1IDIwTDI1IDEwVjE0TDMzIDIwSDM1WiIgZmlsbD0iIzlDQUE2QjIiLz4KPC9zdmc+',
                plugins: []
            });
        } else {
            // Show message that this image is not a panorama
            panoramaViewer.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #718096;">
                    <div style="text-align: center;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px; color: #f6ad55;"></i>
                        <h3>Not a 360° Image</h3>
                        <p>This image is not a 360° panorama.</p>
                        <p>Upload a 360° image to use this view mode.</p>
                    </div>
                </div>
            `;
        }
    }
}

function detectPanorama(imageUrl) {
    // Simple detection - you can enhance this with more sophisticated logic
    // For now, we'll assume any image could be a panorama
    // In a real implementation, you might check image metadata or aspect ratio
    return true; // Placeholder - always return true for testing
}

// Design Room Functions
function openDesignRoomModal() {
    designRoomModal.classList.add('show');
}

function closeDesignRoomModal() {
    designRoomModal.classList.remove('show');
}

function launchSweetHome3DOnline() {
    // Open Sweet Home 3D Online in a new tab
    const onlineUrl = 'https://www.sweethome3d.com/SweetHome3DOnlineManager.jsp';
    window.open(onlineUrl, '_blank');
    
    // Show helpful message
    setTimeout(() => {
        showNotification(
            'Sweet Home 3D Online has opened in a new tab!\n\n' +
            'Design your room there, then:\n' +
            '1. Export a 360° panorama\n' +
            '2. Upload it to this website\n' +
            '3. View it in 360° mode!',
            'success',
            10000
        );
    }, 1000);
}

function launchSweetHome3DDesktop() {
    // Ask user if they have Sweet Home 3D installed
    const hasSoftware = confirm('Do you have Sweet Home 3D installed on your computer?\n\nClick "OK" if you have it installed.\nClick "Cancel" to download it.');
    
    if (hasSoftware) {
        // Try to launch the desktop version
        try {
            console.log('Attempting to launch Sweet Home 3D Desktop...');
            showNotification('Sweet Home 3D Desktop is being launched...', 'info');
            
            setTimeout(() => {
                showNotification(
                    'Sweet Home 3D Desktop should launch automatically. If it doesn\'t open, please run this command in your terminal:\n\nsweethome3d',
                    'info',
                    8000
                );
            }, 1000);
            
        } catch (error) {
            console.error('Could not launch Sweet Home 3D Desktop:', error);
            showNotification(
                'Please launch Sweet Home 3D manually by running this command in your terminal:\n\nsweethome3d',
                'warning'
            );
        }
    } else {
        // User doesn't have the software - redirect to download
        showNotification('Redirecting to Sweet Home 3D download page...', 'info', 3000);
        setTimeout(() => {
            window.open('https://www.sweethome3d.com/download.jsp', '_blank');
        }, 1500);
    }
}

// Panorama Creation Functions
function openCreatePanoramaModal() {
    createPanoramaModal.classList.add('show');
}

function closeCreatePanoramaModal() {
    createPanoramaModal.classList.remove('show');
}

function openQuickGuideModal() {
    quickGuideModal.classList.add('show');
}

function closeQuickGuideModal() {
    quickGuideModal.classList.remove('show');
}

function setupPriorityButtons() {
    // Add event listeners to all priority buttons
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const priority = parseInt(this.dataset.priority);
            const formId = this.closest('form').id;
            const priorityInput = document.getElementById(formId === 'add-item-form' ? 'item-priority' : 'edit-item-priority');
            
            // Update hidden input
            priorityInput.value = priority;
            
            // Update button selection
            updatePriorityButtons(priorityInput.id);
        });
    });
}

function updatePriorityButtons(priorityInputId) {
    const priority = parseInt(document.getElementById(priorityInputId).value);
    const form = document.getElementById(priorityInputId).closest('form');
    
    // Reset all buttons in this form
    form.querySelectorAll('.priority-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.dataset.selected = 'false';
    });
    
    // Select the correct button
    const selectedBtn = form.querySelector(`[data-priority="${priority}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
        selectedBtn.dataset.selected = 'true';
    }
}

function launchSweetHome3D() {
    // Ask user if they have Sweet Home 3D installed
    const hasSoftware = confirm('Do you have Sweet Home 3D installed on your computer?\n\nClick "OK" if you have it installed.\nClick "Cancel" to download it.');
    
    if (hasSoftware) {
        // User has the software - try to launch it
        showNotification('Sweet Home 3D is being launched...', 'info');
        
        try {
            console.log('Attempting to launch Sweet Home 3D...');
            
            // Try to launch using the symlink we created
            setTimeout(() => {
                showNotification(
                    'Sweet Home 3D should launch automatically. If it doesn\'t open, please run this command in your terminal:\n\nsweethome3d',
                    'info',
                    8000
                );
            }, 1000);
            
        } catch (error) {
            console.error('Could not launch Sweet Home 3D:', error);
            showNotification(
                'Please launch Sweet Home 3D manually by running this command in your terminal:\n\nsweethome3d',
                'warning'
            );
        }
    } else {
        // User doesn't have the software - redirect to download
        showNotification('Redirecting to Sweet Home 3D download page...', 'info', 3000);
        setTimeout(() => {
            window.open('https://www.sweethome3d.com/download.jsp', '_blank');
        }, 1500);
    }
}

// Add Item
function handleAddItem(e) {
    e.preventDefault();
    
    const formData = new FormData(addItemForm);
    const item = {
        id: Date.now().toString(),
        name: formData.get('item-name') || document.getElementById('item-name').value,
        size: formData.get('item-size') || document.getElementById('item-size').value,
        price: parseFloat(formData.get('item-price') || document.getElementById('item-price').value),
        priority: parseInt(formData.get('item-priority') || document.getElementById('item-priority').value),
        notes: formData.get('item-notes') || document.getElementById('item-notes').value,
        url: formData.get('item-url') || document.getElementById('item-url').value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    items[currentArea].push(item);
    saveData();
    renderItems();
    updateStats();
    closeModal();
}

// Edit Item
function handleEditItem(e) {
    e.preventDefault();
    
    const itemId = document.getElementById('edit-item-id').value;
    const item = items[currentArea].find(item => item.id === itemId);
    
    if (item) {
        item.name = document.getElementById('edit-item-name').value;
        item.size = document.getElementById('edit-item-size').value;
        item.price = parseFloat(document.getElementById('edit-item-price').value);
        item.priority = parseInt(document.getElementById('edit-item-priority').value);
        item.notes = document.getElementById('edit-item-notes').value;
        item.url = document.getElementById('edit-item-url').value;
        
        saveData();
        renderItems();
        updateStats();
        closeEditModal();
    }
}

// Open Edit Modal
function openEditModal(itemId) {
    const item = items[currentArea].find(item => item.id === itemId);
    
    if (item) {
        document.getElementById('edit-item-id').value = item.id;
        document.getElementById('edit-item-name').value = item.name;
        document.getElementById('edit-item-size').value = item.size || '';
        document.getElementById('edit-item-price').value = item.price;
        document.getElementById('edit-item-priority').value = item.priority || 1;
        document.getElementById('edit-item-notes').value = item.notes || '';
        document.getElementById('edit-item-url').value = item.url || '';
        
        // Update priority button selection
        updatePriorityButtons('edit-item-priority');
        
        editItemModal.classList.add('show');
        document.getElementById('edit-item-name').focus();
    }
}

// Authentication Functions
function checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showUserInterface();
        loadUserData();
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.classList.add('show');
    }
}

function hideLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.classList.remove('show');
    }
}

function showUserInterface() {
    const userInfo = document.getElementById('user-info');
    const currentUserSpan = document.getElementById('current-user');
    const budgetSummary = document.getElementById('overall-budget-summary');
    
    if (userInfo && currentUserSpan) {
        userInfo.style.display = 'flex';
        currentUserSpan.textContent = `Welcome, ${currentUser.username}!`;
    }
    
    if (budgetSummary) {
        budgetSummary.style.display = 'block';
    }
}

function hideUserInterface() {
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username] && users[username].password === password) {
        currentUser = { username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        hideLoginModal();
        showUserInterface();
        loadUserData();
        showNotification('Login successful!', 'success');
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    
    if (users[username]) {
        showNotification('Username already exists', 'error');
        return;
    }
    
    users[username] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = { username };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    hideLoginModal();
    showUserInterface();
    showNotification('Registration successful!', 'success');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    hideUserInterface();
    showLoginModal();
    items = {
        kitchen: [],
        bedroom: [],
        living: [],
        bathroom: [],
        garden: [],
        office: []
    };
    renderItems();
    updateStats();
}

function loadUserData() {
    const userData = localStorage.getItem(`userData_${currentUser.username}`);
    if (userData) {
        items = JSON.parse(userData);
        renderItems();
        updateStats();
        updateOverallBudget();
    } else {
        // Try to migrate old data if this is a new user
        migrateOldData();
    }
}

function migrateOldData() {
    const oldData = localStorage.getItem('apartmentMoveData');
    if (oldData) {
        try {
            items = JSON.parse(oldData);
            saveUserData(); // Save to new user account
            localStorage.removeItem('apartmentMoveData'); // Clean up old data
            renderItems();
            updateStats();
            updateOverallBudget();
            showNotification('Your existing data has been migrated to your account!', 'success');
        } catch (error) {
            console.error('Error migrating data:', error);
        }
    }
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem(`userData_${currentUser.username}`, JSON.stringify(items));
    }
}

// Move Item Functions
let itemToMove = null;

function openMoveModal(itemId) {
    const item = items[currentArea].find(item => item.id === itemId);
    if (item) {
        itemToMove = item;
        const moveItemName = document.getElementById('move-item-name');
        if (moveItemName) {
            moveItemName.textContent = item.name;
        }
        
        const moveModal = document.getElementById('move-item-modal');
        if (moveModal) {
            moveModal.classList.add('show');
        }
        
        // Reset area selection
        document.querySelectorAll('.area-option').forEach(option => {
            option.classList.remove('selected');
        });
    }
}

function closeMoveModal() {
    const moveModal = document.getElementById('move-item-modal');
    if (moveModal) {
        moveModal.classList.remove('show');
    }
    itemToMove = null;
}

function moveItemToArea(targetArea) {
    if (itemToMove && targetArea !== currentArea) {
        // Remove from current area
        items[currentArea] = items[currentArea].filter(item => item.id !== itemToMove.id);
        
        // Add to target area
        items[targetArea].push(itemToMove);
        
        // Save data
        saveUserData();
        
        // Update display
        renderItems();
        updateStats();
        
        // Close modal
        closeMoveModal();
        
        // Show success message
        const areaNames = {
            kitchen: 'Kitchen',
            bedroom: 'Bedroom',
            living: 'Living Room',
            bathroom: 'Bathroom',
            garden: 'Garden',
            office: 'Office'
        };
        
        showNotification(`"${itemToMove.name}" moved to ${areaNames[targetArea]}!`, 'success');
    } else if (targetArea === currentArea) {
        showNotification('Item is already in this area!', 'warning');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeDOMElements();
    setupEventListeners();
    checkAuth();
});

// Event Listeners
function setupEventListeners() {
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const area = btn.dataset.area;
            switchArea(area);
        });
    });

    // Modal
    addItemBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelAddBtn.addEventListener('click', closeModal);
    addItemModal.addEventListener('click', (e) => {
        if (e.target === addItemModal) closeModal();
    });

    // Edit Modal
    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editItemModal.addEventListener('click', (e) => {
        if (e.target === editItemModal) closeEditModal();
    });

    // Forms
    addItemForm.addEventListener('submit', handleAddItem);
    editItemForm.addEventListener('submit', handleEditItem);

    // Upload Pictures Modal
    if (uploadPicturesBtn) {
        uploadPicturesBtn.addEventListener('click', function() {
            openUploadModal();
        });
        console.log('Upload pictures button found and event listener added');
    } else {
        console.error('Upload pictures button not found!');
    }
    
    if (closeUploadModalBtn) {
        closeUploadModalBtn.addEventListener('click', closeUploadModal);
    }
    
    if (uploadPicturesModal) {
        uploadPicturesModal.addEventListener('click', (e) => {
            if (e.target === uploadPicturesModal) closeUploadModal();
        });
    }

    // Room View Modal
    if (viewRoomBtn) {
        viewRoomBtn.addEventListener('click', function() {
            openRoomModal();
        });
        console.log('View room button found and event listener added');
    } else {
        console.error('View room button not found!');
    }
    
    if (closeRoomModalBtn) {
        closeRoomModalBtn.addEventListener('click', closeRoomModal);
    }
    
    if (viewRoomModal) {
        viewRoomModal.addEventListener('click', (e) => {
            if (e.target === viewRoomModal) closeRoomModal();
        });
    }

    // Image Upload
    if (roomImageInput) {
        roomImageInput.addEventListener('change', handleImageUpload);
    }

    // Multiple Image Upload
    if (multipleImagesInput) {
        multipleImagesInput.addEventListener('change', handleMultipleImageUpload);
    }

    // Image Navigation
    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', showPreviousImage);
    }
    
    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', showNextImage);
    }

    // Zoom Controls
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', zoomIn);
    }
    
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', zoomOut);
    }
    
    if (resetZoomBtn) {
        resetZoomBtn.addEventListener('click', resetZoom);
    }

    // View Mode Controls
    if (normalViewBtn) {
        normalViewBtn.addEventListener('click', () => switchViewMode('normal'));
    }
    
    if (panoramaViewBtn) {
        panoramaViewBtn.addEventListener('click', () => switchViewMode('panorama'));
    }

    // Design Room Modal
    if (designRoomBtn) {
        designRoomBtn.addEventListener('click', openDesignRoomModal);
    }
    
    if (closeDesignModalBtn) {
        closeDesignModalBtn.addEventListener('click', closeDesignRoomModal);
    }
    
    if (designRoomModal) {
        designRoomModal.addEventListener('click', (e) => {
            if (e.target === designRoomModal) closeDesignRoomModal();
        });
    }
    
    if (launchOnlineBtn) {
        launchOnlineBtn.addEventListener('click', launchSweetHome3DOnline);
    }
    
    if (launchDesktopBtn) {
        launchDesktopBtn.addEventListener('click', launchSweetHome3DDesktop);
    }

    // Panorama Creation Modal
    if (createPanoramaBtn) {
        createPanoramaBtn.addEventListener('click', openCreatePanoramaModal);
    }
    
    if (closePanoramaModalBtn) {
        closePanoramaModalBtn.addEventListener('click', closeCreatePanoramaModal);
    }
    
    if (createPanoramaModal) {
        createPanoramaModal.addEventListener('click', (e) => {
            if (e.target === createPanoramaModal) closeCreatePanoramaModal();
        });
    }

    // Launch Sweet Home 3D
    if (launchSweetHomeBtn) {
        launchSweetHomeBtn.addEventListener('click', launchSweetHome3D);
    }
    
    // Quick Guide Modal
    if (quickGuideBtn) {
        quickGuideBtn.addEventListener('click', openQuickGuideModal);
    }
    
    if (closeGuideModalBtn) {
        closeGuideModalBtn.addEventListener('click', closeQuickGuideModal);
    }
    
    if (quickGuideModal) {
        quickGuideModal.addEventListener('click', (e) => {
            if (e.target === quickGuideModal) closeQuickGuideModal();
        });
    }
    
    // Priority Button Event Listeners
    setupPriorityButtons();
    
    // Login System Event Listeners
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');
    const closeLoginModalBtn = document.getElementById('close-login-modal');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', hideLoginModal);
    }
    
    // Tab switching for login/register
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide forms
            document.querySelectorAll('.login-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(`${tab}-form`).classList.add('active');
        });
    });
    
    // Move Item Modal Event Listeners
    const closeMoveModalBtn = document.getElementById('close-move-modal');
    const cancelMoveBtn = document.getElementById('cancel-move');
    
    if (closeMoveModalBtn) {
        closeMoveModalBtn.addEventListener('click', closeMoveModal);
    }
    
    if (cancelMoveBtn) {
        cancelMoveBtn.addEventListener('click', closeMoveModal);
    }
    
    // Area selection for moving items
    const areaOptions = document.querySelectorAll('.area-option');
    areaOptions.forEach(option => {
        option.addEventListener('click', function() {
            const targetArea = this.dataset.area;
            
            // Update selection
            areaOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            // Move the item
            moveItemToArea(targetArea);
        });
    });
}

// Area Navigation
function switchArea(area) {
    currentArea = area;
    
    // Update navigation
    navBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.area === area) {
            btn.classList.add('active');
        }
    });

    // Update area title
    const areaNames = {
        kitchen: 'Kitchen',
        bedroom: 'Bedroom',
        living: 'Living Room',
        bathroom: 'Bathroom',
        garden: 'Garden',
        office: 'Office'
    };
    areaTitle.textContent = areaNames[area];

    // Render items for this area
    renderItems();
    updateStats();
}



// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            saveRoomImage(imageData);
            displayRoomImage(imageData);
        };
        reader.readAsDataURL(file);
    }
}

// Save Room Image
function saveRoomImage(imageData) {
    const roomImages = JSON.parse(localStorage.getItem('roomImages') || '{}');
    roomImages[currentArea] = imageData;
    localStorage.setItem('roomImages', JSON.stringify(roomImages));
}

// Load Room Image
function loadRoomImage() {
    const roomImages = JSON.parse(localStorage.getItem('roomImages') || '{}');
    const imageData = roomImages[currentArea];
    if (imageData) {
        displayRoomImage(imageData);
    } else {
        displayPlaceholder();
    }
}

// Display Room Image
function displayRoomImage(imageData) {
    const roomImageContainer = document.getElementById('room-image');
    roomImageContainer.innerHTML = `
        <img src="${imageData}" alt="Room Image" class="room-image-display">
        <div class="room-image-controls">
            <button class="control-btn remove-image-btn" onclick="removeRoomImage()">
                <i class="fas fa-trash"></i> Remove Image
            </button>
        </div>
    `;
}

// Display Placeholder
function displayPlaceholder() {
    const roomImageContainer = document.getElementById('room-image');
    roomImageContainer.innerHTML = `
        <i class="fas fa-image"></i>
        <p>Room image will be displayed here</p>
        <small>You can update this image later</small>
    `;
}

// Remove Room Image
function removeRoomImage() {
    const roomImages = JSON.parse(localStorage.getItem('roomImages') || '{}');
    delete roomImages[currentArea];
    localStorage.setItem('roomImages', JSON.stringify(roomImages));
    displayPlaceholder();
}

// Render Items
function renderItems() {
    const areaItems = items[currentArea];
    
    if (!areaItems || areaItems.length === 0) {
        itemsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>No items yet</h3>
                <p>Start adding items to your ${currentArea} list by clicking the "Add Item" button above.</p>
            </div>
        `;
        return;
    }

    // Sort items by priority (3 stars first, then 2, then 1)
    const sortedItems = [...areaItems].sort((a, b) => {
        const priorityA = a.priority || 1;
        const priorityB = b.priority || 1;
        return priorityB - priorityA; // Higher priority first
    });

    itemsContainer.innerHTML = sortedItems.map(item => {
        const priorityStars = '⭐'.repeat(item.priority || 1);
        const priorityClass = `priority-${item.priority || 1}`;
        
        return `
            <div class="item-card ${item.completed ? 'completed' : ''}" data-id="${item.id}">
                <div class="item-header">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">₪${item.price.toFixed(2)}</div>
                </div>
                <div class="item-details">
                    <div class="item-priority ${priorityClass}">
                        <i class="fas fa-star"></i> Priority: ${priorityStars}
                    </div>
                    ${item.size ? `
                        <div class="item-detail">
                            <i class="fas fa-ruler-combined"></i>
                            <span>${item.size}</span>
                        </div>
                    ` : ''}
                    <div class="item-detail">
                        <i class="fas fa-calendar"></i>
                        <span>Added: ${new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                ${item.notes ? `
                    <div class="item-notes">
                        <i class="fas fa-sticky-note"></i>
                        ${item.notes}
                    </div>
                ` : ''}
                ${item.url ? `
                    <div class="item-url">
                        <i class="fas fa-link"></i>
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer">View Product</a>
                    </div>
                ` : ''}
                <div class="item-actions">
                    <button class="action-btn move-btn" onclick="openMoveModal('${item.id}')">
                        <i class="fas fa-exchange-alt"></i>
                        Move
                    </button>
                    <button class="action-btn edit-btn" onclick="openEditModal('${item.id}')">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="action-btn complete-btn" onclick="toggleComplete('${item.id}')">
                        <i class="fas ${item.completed ? 'fa-undo' : 'fa-check'}"></i>
                        ${item.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteItem('${item.id}')">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle Item Completion
function toggleComplete(itemId) {
    const item = items[currentArea].find(item => item.id === itemId);
    if (item) {
        item.completed = !item.completed;
        saveData();
        renderItems();
        updateStats();
    }
}

// Delete Item
function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        items[currentArea] = items[currentArea].filter(item => item.id !== itemId);
        saveData();
        renderItems();
        updateStats();
    }
}

// Update Statistics
function updateStats() {
    const areaItems = items[currentArea];
    const totalItems = areaItems.length;
    const totalBudget = areaItems.reduce((sum, item) => sum + item.price, 0);
    const completedItems = areaItems.filter(item => item.completed).length;

    totalItemsEl.textContent = totalItems;
    totalBudgetEl.textContent = `₪${totalBudget.toFixed(2)}`;
    completedItemsEl.textContent = completedItems;
    
    // Update overall budget summary
    updateOverallBudget();
}

// Update Overall Budget Summary
function updateOverallBudget() {
    const areas = ['kitchen', 'bedroom', 'living', 'bathroom', 'garden', 'office'];
    let overallTotal = 0;
    
    areas.forEach(area => {
        const areaBudget = items[area].reduce((sum, item) => sum + item.price, 0);
        const budgetElement = document.getElementById(`${area}-budget`);
        if (budgetElement) {
            budgetElement.textContent = `₪${areaBudget.toFixed(2)}`;
        }
        overallTotal += areaBudget;
    });
    
    const overallTotalElement = document.getElementById('overall-total-budget');
    if (overallTotalElement) {
        overallTotalElement.textContent = `₪${overallTotal.toFixed(2)}`;
    }
}

// Data Persistence
function saveData() {
    if (currentUser) {
        localStorage.setItem(`userData_${currentUser.username}`, JSON.stringify(items));
    }
}

function loadData() {
    if (currentUser) {
        const savedData = localStorage.getItem(`userData_${currentUser.username}`);
        if (savedData) {
            items = JSON.parse(savedData);
        }
    }
}

// Add some sample data for demonstration
function addSampleData() {
    if (Object.values(items).every(area => area.length === 0)) {
        items.kitchen = [
            {
                id: '1',
                name: 'Kitchen Table',
                size: '120cm x 80cm',
                price: 1200.00,
                notes: 'Looking for a modern wooden table with 4 chairs',
                url: 'https://example.com/kitchen-table',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Refrigerator',
                size: '70cm x 60cm x 180cm',
                price: 3500.00,
                notes: 'Stainless steel, French door style',
                url: 'https://example.com/refrigerator',
                completed: true,
                createdAt: new Date().toISOString()
            }
        ];
        
        items.bedroom = [
            {
                id: '3',
                name: 'Queen Bed Frame',
                size: '160cm x 200cm',
                price: 1800.00,
                notes: 'Upholstered headboard, dark gray',
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];
        
        items.living = [
            {
                id: '4',
                name: 'Sofa',
                size: '220cm x 85cm',
                price: 4800.00,
                notes: '3-seater, fabric, neutral color',
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];
        
        saveData();
    }
}

// Initialize with sample data
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    addSampleData();
    setupEventListeners();
    renderItems();
    updateStats();
}); 