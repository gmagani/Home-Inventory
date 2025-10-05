# Home Inventory Tracker

A modern web application for tracking home inventory items with Google Sheets integration.

## Features

- **Search & Filter**: Live search with category, location, and date filtering
- **Card-based Dashboard**: Modern card layout with item photos and key details
- **Modal Detail View**: Complete item information in elegant modals
- **Low Stock Alerts**: Prominent alerts for items below threshold quantities
- **Image Upload**: Direct image upload with preview functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Files Structure

- `index.html` - Main HTML structure and layout
- `styles.css` - Complete CSS styling with modern design
- `script.js` - JavaScript functionality and Google Sheets integration
- `README.md` - Project documentation

## Getting Started

1. Open `index.html` in a web browser
2. The app will load with sample data
3. Use the search bar and filters to find items
4. Click on items to view details
5. Use "Add Item" button to add new inventory

## Google Sheets Integration

To connect to Google Sheets:

1. Set up Google Sheets API credentials
2. Replace sample data with Google Sheets API calls
3. Implement the following functions in `script.js`:
   - `loadFromGoogleSheets()`
   - `saveToGoogleSheets(item)`
   - `uploadImageToGoogleDrive(imageFile)`

## Customization

- Modify categories and locations in both HTML and JavaScript
- Adjust styling in `styles.css`
- Update low stock thresholds per item
- Add additional form fields as needed

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design supported
