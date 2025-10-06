// Sample data - replace with Google Sheets API integration
let inventoryItems = [
    {
        id: 1,
        name: "MacBook Pro",
        category: "Electronics",
        location: "Living Room",
        quantity: 1,
        price: 2499.99,
        purchaseDate: "2023-01-15",
        description: "13-inch MacBook Pro with M2 chip",
        image: "https://via.placeholder.com/300x200?text=MacBook+Pro",
        lowStockThreshold: 1
    },
    {
        id: 2,
        name: "Gaming Chair",
        category: "Furniture",
        location: "Bedroom",
        quantity: 0,
        price: 299.99,
        purchaseDate: "2023-03-10",
        description: "Ergonomic gaming chair with lumbar support",
        image: "https://via.placeholder.com/300x200?text=Gaming+Chair",
        lowStockThreshold: 1
    },
    {
        id: 3,
        name: "Coffee Maker",
        category: "Appliances",
        location: "Kitchen",
        quantity: 1,
        price: 149.99,
        purchaseDate: "2023-02-20",
        description: "Programmable drip coffee maker",
        image: "https://via.placeholder.com/300x200?text=Coffee+Maker",
        lowStockThreshold: 1
    }
];

let filteredItems = [...inventoryItems];
let currentView = 'card'; // 'card' or 'table'
let sortColumn = -1;
let sortDirection = 'asc';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Try to load from Google Sheets first, fallback to sample data if it fails
    loadFromGoogleSheets().catch((error) => {
        console.log('Failed to load from Google Sheets:', error.message);
        console.log('Using sample data instead');
        
        // Show info message
        const infoMsg = document.createElement('div');
        infoMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #2196F3; color: white; padding: 10px 20px; border-radius: 5px; z-index: 1001;';
        infoMsg.textContent = 'Using sample data. Configure Google Sheets API to load your data.';
        document.body.appendChild(infoMsg);
        setTimeout(() => infoMsg.remove(), 5000);
        
        renderItems();
        renderLowStockItems();
        populateCategoryOptions(); // Populate category dropdowns with sample data
        populateLocationOptions(); // Populate location dropdowns with sample data
    });
});

// Populate category dropdowns dynamically
function populateCategoryOptions() {
    // Get unique categories from inventory items
    const uniqueCategories = [...new Set(inventoryItems.map(item => item.category).filter(category => category && category.trim() !== ''))];
    uniqueCategories.sort(); // Sort alphabetically
    
    // Update category filter dropdown
    const categoryFilter = document.getElementById('categoryFilter');
    const currentFilterValue = categoryFilter.value; // Preserve current selection
    
    // Clear existing options except the first "All Categories" option
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    // Add unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        if (category === currentFilterValue) {
            option.selected = true;
        }
        categoryFilter.appendChild(option);
    });
    
    // Update add item modal category dropdown
    const itemCategory = document.getElementById('itemCategory');
    const currentItemValue = itemCategory.value; // Preserve current selection
    
    // Clear existing options except the first "Select Category" option
    itemCategory.innerHTML = '<option value="">Select Category</option>';
    
    // Add unique categories
    uniqueCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        if (category === currentItemValue) {
            option.selected = true;
        }
        itemCategory.appendChild(option);
    });
}

// Populate location dropdowns dynamically
function populateLocationOptions() {
    // Get unique locations from inventory items
    const uniqueLocations = [...new Set(inventoryItems.map(item => item.location).filter(location => location && location.trim() !== ''))];
    uniqueLocations.sort(); // Sort alphabetically
    
    // Update location filter dropdown
    const locationFilter = document.getElementById('locationFilter');
    const currentFilterValue = locationFilter.value; // Preserve current selection
    
    // Clear existing options except the first "All Locations" option
    locationFilter.innerHTML = '<option value="">All Locations</option>';
    
    // Add unique locations
    uniqueLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        if (location === currentFilterValue) {
            option.selected = true;
        }
        locationFilter.appendChild(option);
    });
    
    // Update add item modal location dropdown
    const itemLocation = document.getElementById('itemLocation');
    const currentItemValue = itemLocation.value; // Preserve current selection
    
    // Clear existing options except the first "Select Location" option
    itemLocation.innerHTML = '<option value="">Select Location</option>';
    
    // Add unique locations
    uniqueLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        if (location === currentItemValue) {
            option.selected = true;
        }
        itemLocation.appendChild(option);
    });
}

// Render items in the grid or table
function renderItems() {
    if (currentView === 'card') {
        renderCardView();
    } else {
        renderTableView();
    }
}

// Render items in card view
function renderCardView() {
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.innerHTML = '';

    filteredItems.forEach(item => {
        const itemCard = createItemCard(item);
        itemsGrid.appendChild(itemCard);
    });

    if (filteredItems.length === 0) {
        itemsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">No items found matching your criteria.</div>';
    }
}

// Render items in table view
function renderTableView() {
    const tableBody = document.getElementById('itemsTableBody');
    tableBody.innerHTML = '';

    filteredItems.forEach(item => {
        const row = createTableRow(item);
        tableBody.appendChild(row);
    });

    if (filteredItems.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem; color: #666;">No items found matching your criteria.</td></tr>';
    }
}

// Create item card element
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.onclick = () => openItemModal(item);

    card.innerHTML = `
        <div class="item-image">
            ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-image"></i>'}
        </div>
        <div class="item-details">
            <h3>${item.name}</h3>
            <div class="item-meta">
                <span>Qty: <span class="${item.quantity < item.lowStockThreshold ? 'quantity-low' : 'quantity-normal'}">${item.quantity}</span></span>
                <span>$${item.price?.toFixed(2) || 'N/A'}</span>
            </div>
            <div class="item-tags">
                <span class="tag">${item.category}</span>
                <span class="tag">${item.location}</span>
            </div>
            <div class="quick-actions">
                <button class="quick-edit-btn" onclick="event.stopPropagation(); quickEdit(${item.id})">
                    <i class="fas fa-edit"></i> Quick Edit
                </button>
            </div>
        </div>
    `;

    return card;
}

// Create table row element
function createTableRow(item) {
    const row = document.createElement('tr');
    
    const quantityClass = item.quantity < item.lowStockThreshold ? 'low' : 'normal';
    
    row.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td>${item.location}</td>
        <td><span class="table-quantity ${quantityClass}">${item.quantity}</span></td>
        <td class="table-price">$${item.price?.toFixed(2) || 'N/A'}</td>
        <td>${item.purchaseDate || 'N/A'}</td>
        <td class="table-description" title="${item.description || 'No description'}">${item.description || 'No description'}</td>
        <td class="table-actions">
            <button class="table-action-btn btn-view" onclick="openItemModal(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="table-action-btn btn-edit" onclick="quickEdit(${item.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button class="table-action-btn btn-delete" onclick="deleteItem(${item.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        </td>
    `;
    
    return row;
}

// Render low stock items
function renderLowStockItems() {
    const lowStockSection = document.getElementById('lowStockSection');
    const lowStockItems = document.getElementById('lowStockItems');
    
    const lowStockList = inventoryItems.filter(item => item.quantity < item.lowStockThreshold);
    
    if (lowStockList.length === 0) {
        lowStockSection.style.display = 'none';
        return;
    }

    lowStockSection.style.display = 'block';
    lowStockItems.innerHTML = '';

    lowStockList.forEach(item => {
        const lowStockItem = document.createElement('div');
        lowStockItem.className = 'low-stock-item';
        lowStockItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>${item.location}</p>
        `;
        lowStockItem.onclick = () => openItemModal(item);
        lowStockItems.appendChild(lowStockItem);
    });
}

// Filter items based on search and filters
function filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const locationFilter = document.getElementById('locationFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;

    filteredItems = inventoryItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                            item.description.toLowerCase().includes(searchTerm) ||
                            item.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        const matchesLocation = !locationFilter || item.location === locationFilter;
        const matchesDate = !dateFilter || item.purchaseDate === dateFilter;

        return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });

    renderItems();
}

// Open item detail modal
function openItemModal(item) {
    const modal = document.getElementById('itemModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <h2>${item.name}</h2>
        ${item.image ? `<img src="${item.image}" alt="${item.name}" class="modal-item-image">` : ''}
        <div class="modal-item-details">
            <div class="detail-item">
                <label>Category</label>
                <span>${item.category}</span>
            </div>
            <div class="detail-item">
                <label>Location</label>
                <span>${item.location}</span>
            </div>
            <div class="detail-item">
                <label>Quantity</label>
                <span class="${item.quantity <= item.lowStockThreshold ? 'quantity-low' : 'quantity-normal'}">${item.quantity}</span>
            </div>
            <div class="detail-item">
                <label>Price</label>
                <span>$${item.price?.toFixed(2) || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <label>Purchase Date</label>
                <span>${item.purchaseDate || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <label>Item ID</label>
                <span>${item.id}</span>
            </div>
        </div>
        <div class="detail-item">
            <label>Description</label>
            <span>${item.description || 'No description available'}</span>
        </div>
        <div class="form-actions">
            <button onclick="editItem(${item.id})">Edit Item</button>
            <button onclick="deleteItem(${item.id})" style="background: #ff6b6b;">Delete Item</button>
        </div>
    `;

    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

// Open add item modal
function openAddItemModal() {
    document.getElementById('addItemModal').style.display = 'block';
}

// Close add item modal
function closeAddItemModal() {
    document.getElementById('addItemModal').style.display = 'none';
    document.getElementById('addItemForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
}

// Preview uploaded image
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Handle add item form submission
document.getElementById('addItemForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newItem = {
        id: Date.now(), // Simple ID generation
        name: document.getElementById('itemName').value,
        category: document.getElementById('itemCategory').value,
        location: document.getElementById('itemLocation').value,
        quantity: parseInt(document.getElementById('itemQuantity').value),
        price: parseFloat(document.getElementById('itemPrice').value) || 0,
        purchaseDate: document.getElementById('itemPurchaseDate').value,
        description: document.getElementById('itemDescription').value,
        image: document.getElementById('imagePreview').querySelector('img')?.src || null,
        lowStockThreshold: 1
    };

    // Here you would typically send the data to Google Sheets
    inventoryItems.push(newItem);
    filteredItems = [...inventoryItems];
    
    renderItems();
    renderLowStockItems();
    populateCategoryOptions(); // Refresh category options when new item is added
    populateLocationOptions(); // Refresh location options when new item is added
    closeAddItemModal();
    
    alert('Item added successfully!');
});

// Quick edit function
function quickEdit(itemId) {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = prompt(`Update quantity for ${item.name}:`, item.quantity);
    if (newQuantity !== null && !isNaN(newQuantity)) {
        item.quantity = parseInt(newQuantity);
        filteredItems = [...inventoryItems];
        renderItems();
        renderLowStockItems();
        
        // Here you would update the Google Sheet
        console.log('Updated item:', item);
    }
}

// Edit item function
function editItem(itemId) {
    // This would open an edit modal similar to add item modal
    alert('Edit functionality would be implemented here');
    closeModal();
}

// Delete item function
function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        inventoryItems = inventoryItems.filter(item => item.id !== itemId);
        filteredItems = [...inventoryItems];
        renderItems();
        renderLowStockItems();
        populateCategoryOptions(); // Refresh category options when item is deleted
        populateLocationOptions(); // Refresh location options when item is deleted
        closeModal();
        
        // Here you would delete from Google Sheet
        alert('Item deleted successfully!');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const itemModal = document.getElementById('itemModal');
    const addModal = document.getElementById('addItemModal');
    const settingsModal = document.getElementById('settingsModal');
    
    if (event.target === itemModal) {
        closeModal();
    }
    if (event.target === addModal) {
        closeAddItemModal();
    }
    if (event.target === settingsModal) {
        closeSettingsModal();
    }
}

// Settings Modal Functions
function openSettingsModal() {
    const apiKey = localStorage.getItem('googleSheetsApiKey') || '';
    document.getElementById('googleApiKey').value = apiKey;
    document.getElementById('settingsModal').style.display = 'block';
}

function closeSettingsModal() {
    document.getElementById('settingsModal').style.display = 'none';
}

function saveSettings() {
    const apiKey = document.getElementById('googleApiKey').value.trim();
    if (apiKey) {
        localStorage.setItem('googleSheetsApiKey', apiKey);
        alert('Settings saved successfully!');
        closeSettingsModal();
    } else {
        alert('Please enter a valid API key');
    }
}

function testConnection() {
    const apiKey = document.getElementById('googleApiKey').value.trim();
    if (!apiKey) {
        alert('Please enter an API key first');
        return;
    }
    
    // Temporarily save the API key for testing
    const oldApiKey = localStorage.getItem('googleSheetsApiKey');
    localStorage.setItem('googleSheetsApiKey', apiKey);
    
    loadFromGoogleSheets()
        .then(() => {
            alert('Connection successful! Data loaded from Google Sheets.');
        })
        .catch((error) => {
            alert(`Connection failed: ${error.message}`);
            // Restore old API key if test failed
            if (oldApiKey) {
                localStorage.setItem('googleSheetsApiKey', oldApiKey);
            } else {
                localStorage.removeItem('googleSheetsApiKey');
            }
        });
}

// Google Sheets Integration Functions
async function loadFromGoogleSheets() {
    const SPREADSHEET_ID = '1nSxUmaf0bmc97YR_51-L0uLqi1AC6meFbFFNedZJUeE';
    const API_KEY = localStorage.getItem('googleSheetsApiKey') || 'YOUR_GOOGLE_SHEETS_API_KEY';
    const RANGE = 'Sheet1!A:I'; // Adjust range based on your sheet structure
    
    // Check if API key is still placeholder or not set
    if (!API_KEY || API_KEY === 'YOUR_GOOGLE_SHEETS_API_KEY') {
        console.log('Google Sheets API key not configured. Using sample data.');
        throw new Error('API key not configured. Please set your API key in Settings.');
    }
    
    try {
        console.log('Attempting to load from Google Sheets...');
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        console.log('Request URL:', url);
        
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            let errorMessage = `HTTP ${response.status}`;
            if (response.status === 403) {
                errorMessage = 'Access denied. Check your API key and sheet permissions.';
            } else if (response.status === 404) {
                errorMessage = 'Spreadsheet not found. Check the spreadsheet ID.';
            } else if (response.status === 400) {
                errorMessage = 'Invalid request. Check your API key and sheet range.';
            }
            
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Data received:', data);
        const rows = data.values;
        
        if (!rows || rows.length === 0) {
            console.log('No data found in the spreadsheet');
            throw new Error('No data found in the spreadsheet');
        }
        
        // Skip header row (assuming first row contains headers)
        const dataRows = rows.slice(1);
        
        // Convert rows to inventory items
        inventoryItems = dataRows.map((row, index) => {
            return {
                id: index + 1,
                name: row[0] || '',
                category: row[1] || '',
                location: row[2] || '',
                quantity: parseInt(row[3]) || 0,
                price: parseFloat(row[4]) || 0,
                purchaseDate: row[5] || '',
                description: row[6] || '',
                image: row[7] || null,
                lowStockThreshold: parseInt(row[8]) || 1
            };
        }).filter(item => item.name); // Filter out empty rows
        
        filteredItems = [...inventoryItems];
        renderItems();
        renderLowStockItems();
        populateCategoryOptions(); // Populate category dropdowns with data from Google Sheets
        populateLocationOptions(); // Populate location dropdowns with data from Google Sheets
        
        console.log(`Successfully loaded ${inventoryItems.length} items from Google Sheets`);
        
        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; z-index: 1001;';
        successMsg.textContent = `Loaded ${inventoryItems.length} items from Google Sheets`;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
        
    } catch (error) {
        console.error('Error loading from Google Sheets:', error);
        throw error; // Re-throw to be caught by the caller
    }
}

async function saveToGoogleSheets(item) {
    const SPREADSHEET_ID = '1nSxUmaf0bmc97YR_51-L0uLqi1AC6meFbFFNedZJUeE';
    const API_KEY = localStorage.getItem('googleSheetsApiKey') || 'AIzaSyCNRmSZkvCLPNisXGi0FjVQKEXNfNoN4fo';
    const RANGE = 'Sheet1!A:I'; // Adjust range based on your sheet structure
    
    try {
        // For writing, you'll need OAuth2 authentication, not just API key
        // This is a simplified example - you'll need proper authentication
        const values = [[
            item.name,
            item.category,
            item.location,
            item.quantity,
            item.price,
            item.purchaseDate,
            item.description,
            item.image,
            item.lowStockThreshold
        ]];
        
        const body = {
            values: values
        };
        
        // Note: This requires OAuth2 authentication for write operations
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:append?valueInputOption=RAW&key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Item saved to Google Sheets:', item);
        
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        alert('Failed to save data to Google Sheets. Write operations require OAuth2 authentication.');
    }
}

async function uploadImageToGoogleDrive(imageFile) {
    // Implementation for uploading images to Google Drive
    console.log('Uploading image to Google Drive...');
}







// View switching functions
function switchView(viewType) {
    currentView = viewType;
    
    const cardViewBtn = document.getElementById('cardViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const itemsGrid = document.getElementById('itemsGrid');
    const itemsTableContainer = document.getElementById('itemsTableContainer');
    
    if (viewType === 'card') {
        cardViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        itemsGrid.style.display = 'grid';
        itemsTableContainer.style.display = 'none';
    } else {
        cardViewBtn.classList.remove('active');
        tableViewBtn.classList.add('active');
        itemsGrid.style.display = 'none';
        itemsTableContainer.style.display = 'block';
    }
    
    renderItems();
}

// Table sorting function
function sortTable(columnIndex) {
    if (sortColumn === columnIndex) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = columnIndex;
        sortDirection = 'asc';
    }
    
    const columnNames = ['name', 'category', 'location', 'quantity', 'price', 'purchaseDate', 'description'];
    const sortKey = columnNames[columnIndex];
    
    filteredItems.sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        
        // Handle numeric columns
        if (sortKey === 'quantity' || sortKey === 'price') {
            aVal = parseFloat(aVal) || 0;
            bVal = parseFloat(bVal) || 0;
        }
        
        // Handle date column
        if (sortKey === 'purchaseDate') {
            aVal = new Date(aVal || '1900-01-01');
            bVal = new Date(bVal || '1900-01-01');
        }
        
        // Handle string columns
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderItems();
    updateSortIcons(columnIndex);
}

// Update sort icons in table headers
function updateSortIcons(activeColumn) {
    const headers = document.querySelectorAll('.items-table th i');
    headers.forEach((icon, index) => {
        if (index === activeColumn) {
            icon.className = sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
        } else {
            icon.className = 'fas fa-sort';
        }
    });
}
