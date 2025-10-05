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
    });
});

// Render items in the grid
function renderItems() {
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
                <span>Qty: <span class="${item.quantity <= item.lowStockThreshold ? 'quantity-low' : 'quantity-normal'}">${item.quantity}</span></span>
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

// Render low stock items
function renderLowStockItems() {
    const lowStockSection = document.getElementById('lowStockSection');
    const lowStockItems = document.getElementById('lowStockItems');
    
    const lowStockList = inventoryItems.filter(item => item.quantity <= item.lowStockThreshold);
    
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

// Function to populate Google Sheets with sample data
async function populateWithSampleData() {
    const SPREADSHEET_ID = '1nSxUmaf0bmc97YR_51-L0uLqi1AC6meFbFFNedZJUeE';
    const API_KEY = localStorage.getItem('googleSheetsApiKey') || 'AIzaSyCNRmSZkvCLPNisXGi0FjVQKEXNfNoN4fo';
    
    if (!API_KEY || API_KEY === 'YOUR_GOOGLE_SHEETS_API_KEY') {
        alert('Please configure your Google Sheets API key first in Settings.');
        return;
    }

    // Show instructions for manual setup
    const manualSetup = confirm(
        'Automated data upload requires special permissions.\n\n' +
        'Click OK to see manual setup instructions, or Cancel to try automated upload anyway.'
    );

    if (manualSetup) {
        showManualSetupInstructions();
        return;
    }

    const sampleData = [
        // Header row
        ['Item Name', 'Category', 'Location', 'Quantity', 'Price', 'Purchase Date', 'Description', 'Image URL', 'Low Stock Threshold'],
        // Sample data rows
        ['MacBook Pro', 'Electronics', 'Living Room', '1', '2499.99', '2023-01-15', '13-inch MacBook Pro with M2 chip', 'https://via.placeholder.com/300x200?text=MacBook+Pro', '1'],
        ['Gaming Chair', 'Furniture', 'Bedroom', '0', '299.99', '2023-03-10', 'Ergonomic gaming chair with lumbar support', 'https://via.placeholder.com/300x200?text=Gaming+Chair', '1'],
        ['Coffee Maker', 'Appliances', 'Kitchen', '1', '149.99', '2023-02-20', 'Programmable drip coffee maker', 'https://via.placeholder.com/300x200?text=Coffee+Maker', '1'],
        ['Wireless Headphones', 'Electronics', 'Living Room', '2', '199.99', '2023-04-05', 'Noise-cancelling wireless headphones', 'https://via.placeholder.com/300x200?text=Headphones', '1'],
        ['Dining Table', 'Furniture', 'Kitchen', '1', '899.99', '2022-12-10', 'Solid wood dining table for 6 people', 'https://via.placeholder.com/300x200?text=Dining+Table', '1'],
        ['Smart TV', 'Electronics', 'Living Room', '1', '1299.99', '2023-06-20', '55-inch 4K Smart TV with HDR', 'https://via.placeholder.com/300x200?text=Smart+TV', '1'],
        ['Office Chair', 'Furniture', 'Bedroom', '1', '349.99', '2023-07-15', 'Ergonomic office chair with lumbar support', 'https://via.placeholder.com/300x200?text=Office+Chair', '1'],
        ['Robot Vacuum', 'Appliances', 'Living Room', '1', '399.99', '2023-08-01', 'Smart robot vacuum with app control', 'https://via.placeholder.com/300x200?text=Robot+Vacuum', '1'],
        ['Winter Jacket', 'Clothing', 'Bedroom', '3', '129.99', '2023-09-10', 'Waterproof winter jacket', 'https://via.placeholder.com/300x200?text=Winter+Jacket', '2'],
        ['Kitchen Knives Set', 'Appliances', 'Kitchen', '1', '89.99', '2023-05-25', 'Professional chef knife set with block', 'https://via.placeholder.com/300x200?text=Knife+Set', '1']
    ];

    try {
        // First, clear the existing data
        const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A:I:clear?key=${API_KEY}`;
        await fetch(clearUrl, { method: 'POST' });

        // Then add the sample data
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Sheet1!A1:I${sampleData.length}?valueInputOption=RAW&key=${API_KEY}`;
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: sampleData
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            if (response.status === 403) {
                showPermissionError();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return;
        }

        console.log('Sample data added to Google Sheets successfully');
        alert('Sample data has been added to your Google Sheet! Click Reload to see the data.');
        
    } catch (error) {
        console.error('Error adding sample data to Google Sheets:', error);
        showPermissionError();
    }
}

function showManualSetupInstructions() {
    const instructions = `
MANUAL SETUP INSTRUCTIONS:

1. Open your Google Sheet:
   https://docs.google.com/spreadsheets/d/1nSxUmaf0bmc97YR_51-L0uLqi1AC6meFbFFNedZJUeE/edit

2. Copy the sample data from the browser console (F12 → Console)

3. Paste it into your sheet starting at cell A1

4. Return to this app and click Reload to load the data

The sample data will be logged to the console now...
    `;
    
    alert(instructions);
    
    // Log the sample data to console for easy copying
    console.log('%cSample Data for Copy-Paste:', 'font-weight: bold; color: blue;');
    console.log('Item Name\tCategory\tLocation\tQuantity\tPrice\tPurchase Date\tDescription\tImage URL\tLow Stock Threshold');
    console.log('MacBook Pro\tElectronics\tLiving Room\t1\t2499.99\t2023-01-15\t13-inch MacBook Pro with M2 chip\thttps://via.placeholder.com/300x200?text=MacBook+Pro\t1');
    console.log('Gaming Chair\tFurniture\tBedroom\t0\t299.99\t2023-03-10\tErgonomic gaming chair with lumbar support\thttps://via.placeholder.com/300x200?text=Gaming+Chair\t1');
    console.log('Coffee Maker\tAppliances\tKitchen\t1\t149.99\t2023-02-20\tProgrammable drip coffee maker\thttps://via.placeholder.com/300x200?text=Coffee+Maker\t1');
    console.log('Wireless Headphones\tElectronics\tLiving Room\t2\t199.99\t2023-04-05\tNoise-cancelling wireless headphones\thttps://via.placeholder.com/300x200?text=Headphones\t1');
    console.log('Dining Table\tFurniture\tKitchen\t1\t899.99\t2022-12-10\tSolid wood dining table for 6 people\thttps://via.placeholder.com/300x200?text=Dining+Table\t1');
    console.log('Smart TV\tElectronics\tLiving Room\t1\t1299.99\t2023-06-20\t55-inch 4K Smart TV with HDR\thttps://via.placeholder.com/300x200?text=Smart+TV\t1');
    console.log('Office Chair\tFurniture\tBedroom\t1\t349.99\t2023-07-15\tErgonomic office chair with lumbar support\thttps://via.placeholder.com/300x200?text=Office+Chair\t1');
    console.log('Robot Vacuum\tAppliances\tLiving Room\t1\t399.99\t2023-08-01\tSmart robot vacuum with app control\thttps://via.placeholder.com/300x200?text=Robot+Vacuum\t1');
    console.log('Winter Jacket\tClothing\tBedroom\t3\t129.99\t2023-09-10\tWaterproof winter jacket\thttps://via.placeholder.com/300x200?text=Winter+Jacket\t2');
    console.log('Kitchen Knives Set\tAppliances\tKitchen\t1\t89.99\t2023-05-25\tProfessional chef knife set with block\thttps://via.placeholder.com/300x200?text=Knife+Set\t1');
}

function showPermissionError() {
    const errorMsg = `
WRITE PERMISSION REQUIRED

To enable automated data upload, you need to:

1. Open your Google Sheet
2. Click "Share" → "Change to anyone with the link"
3. Set permission to "Editor" (not just Viewer)

OR use the manual setup method instead.

Would you like to see manual setup instructions?
    `;
    
    if (confirm(errorMsg)) {
        showManualSetupInstructions();
    }
}
