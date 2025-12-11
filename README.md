# QuickCloset Picker

Your Personal Virtual Wardrobe Management System

![QuickCloset Picker](https://img.shields.io/badge/Version-1.0.0-blue) ![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

## 🌟 Project Overview

**QuickCloset Picker** is a modern, intuitive web application that helps you organize your entire wardrobe digitally and create perfect outfit combinations. Never wonder what to wear again!

### Key Features

✨ **Wardrobe Organization**
- Upload and manage wardrobe items with images
- Organize into 4 categories: Shirts & T-shirts, Pants & Joggers, Accessories, and Shoes
- Add titles and tags for easy searching and filtering
- Full CRUD operations (Create, Read, Update, Delete)

🎨 **Outfit Builder**
- Interactive outfit creation interface
- Select one item from each category to preview combinations
- See your complete outfit before you wear it
- Visual preview of all selected items

🎲 **Randomize Feature**
- Get instant outfit inspiration with one click
- Automatically picks random items from each category
- Perfect for decision-making on busy mornings

💾 **Save Outfits**
- Save your favorite outfit combinations
- Add custom names and notes to outfits
- View saved outfits gallery
- Manage and delete saved combinations

📱 **Modern UI/UX**
- Clean, professional design
- Fully responsive (mobile, tablet, desktop)
- Fast loading and smooth interactions
- Intuitive navigation

## 🚀 Live Demo

Access your QuickCloset Picker by opening `index.html` in your web browser.

## 📁 Project Structure

```
quickcloset-picker/
├── index.html              # Homepage with statistics
├── upload.html             # Add new wardrobe items
├── gallery.html            # View and manage items by category
├── outfit-builder.html     # Create outfit combinations
├── saved-outfits.html      # View saved outfit combinations
├── css/
│   └── style.css          # Complete styling (responsive design)
├── js/
│   ├── api.js             # RESTful API service layer
│   ├── main.js            # Homepage functionality
│   ├── upload.js          # Image upload and item creation
│   ├── gallery.js         # Gallery view and item management
│   ├── outfit-builder.js  # Outfit creation and randomization
│   └── saved-outfits.js   # Saved outfits management
└── README.md              # Project documentation
```

## 🎯 Functional Entry URIs

### Main Pages

1. **Homepage** - `index.html`
   - Dashboard with wardrobe statistics
   - Quick access to all features
   - Category overview cards

2. **Add Items** - `upload.html`
   - Upload wardrobe item images (up to 5MB)
   - Add title, category, and tags
   - Drag-and-drop support
   - Image preview before upload

3. **Gallery** - `gallery.html?category={category}`
   - `?category=shirts` - View all shirts and t-shirts
   - `?category=pants` - View all pants and joggers
   - `?category=accessories` - View all accessories
   - `?category=shoes` - View all shoes
   - Search functionality by name or tags
   - Edit and delete items

4. **Outfit Builder** - `outfit-builder.html`
   - Select items from each category
   - Preview complete outfit
   - Randomize outfit button
   - Save outfit combinations

5. **Saved Outfits** - `saved-outfits.html`
   - View all saved outfit combinations
   - View outfit details
   - Delete saved outfits

## 🗄️ Data Models

### 1. Wardrobe Items Table (`wardrobe_items`)

| Field       | Type   | Description                              |
|-------------|--------|------------------------------------------|
| id          | text   | Unique identifier (auto-generated)       |
| title       | text   | Name of the wardrobe item                |
| category    | text   | Category: shirts, pants, accessories, shoes |
| image_url   | text   | Base64 encoded image data                |
| tags        | array  | Array of tags for organization           |
| created_at  | number | Creation timestamp (auto-generated)      |
| updated_at  | number | Last update timestamp (auto-generated)   |

### 2. Saved Outfits Table (`saved_outfits`)

| Field           | Type   | Description                           |
|-----------------|--------|---------------------------------------|
| id              | text   | Unique identifier (auto-generated)    |
| outfit_name     | text   | Name of the outfit                    |
| shirt_id        | text   | ID of selected shirt (nullable)       |
| pants_id        | text   | ID of selected pants (nullable)       |
| accessories_id  | text   | ID of selected accessories (nullable) |
| shoes_id        | text   | ID of selected shoes (nullable)       |
| notes           | text   | Optional notes about the outfit       |
| created_at      | number | Creation timestamp (auto-generated)   |
| updated_at      | number | Last update timestamp (auto-generated)|

## 🔧 Technical Implementation

### Frontend Technologies
- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No framework dependencies
- **Font Awesome** - Icons
- **Google Fonts (Inter)** - Typography

### Data Storage
- **RESTful Table API** - Server-side data persistence
- **Base64 Encoding** - Image storage within database
- **Automatic timestamps** - Created/updated tracking

### Features Implementation

**Image Upload**
- Drag-and-drop support
- File size validation (5MB limit)
- Image preview before submission
- Base64 conversion for database storage

**Search & Filter**
- Real-time search by item name
- Tag-based filtering
- Category-based organization

**Outfit Randomization**
- Random selection algorithm
- One item per category
- Instant preview update

**Responsive Design**
- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly interface

## ✅ Completed Features

- ✅ Homepage with statistics dashboard
- ✅ Image upload with drag-and-drop
- ✅ Wardrobe item management (CRUD)
- ✅ Category-based organization (4 categories)
- ✅ Gallery view with search functionality
- ✅ Edit and delete wardrobe items
- ✅ Outfit Builder with visual preview
- ✅ Item selection from each category
- ✅ Randomize outfit feature
- ✅ Save outfit combinations
- ✅ Saved outfits gallery
- ✅ View outfit details
- ✅ Delete saved outfits
- ✅ Fully responsive design
- ✅ Modern, clean UI
- ✅ Toast notifications for user feedback

## 🚧 Future Enhancements

Recommended features for future development:

1. **Advanced Filtering**
   - Filter by multiple tags
   - Color-based filtering
   - Season-based filtering
   - Occasion-based filtering

2. **Social Features**
   - Share outfits with friends
   - Export outfit images
   - Create outfit collections

3. **Smart Recommendations**
   - Weather-based outfit suggestions
   - Occasion-based recommendations
   - Color matching algorithms

4. **Wardrobe Analytics**
   - Most worn items
   - Least used items
   - Outfit popularity tracking
   - Wardrobe value calculator

5. **Enhanced Organization**
   - Custom categories
   - Sub-categories (e.g., casual shirts, formal shirts)
   - Outfit planning calendar
   - Laundry/cleaning reminders

6. **Image Enhancements**
   - Background removal
   - Image cropping tool
   - Multiple image angles per item
   - Zoom functionality

7. **Import/Export**
   - Export wardrobe data as JSON
   - Import from other apps
   - Backup and restore functionality

8. **User Preferences**
   - Theme customization (dark mode)
   - Language selection
   - Default category preferences

## 🎨 Design Philosophy

- **Simplicity** - Clean, uncluttered interface
- **Speed** - Fast loading and smooth interactions
- **Accessibility** - Clear icons and labels
- **Responsiveness** - Works on all devices
- **Visual Feedback** - Clear confirmation messages

## 📱 Browser Compatibility

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Data Privacy

- All data is stored in your project database
- Images are stored as base64 strings
- No external data transmission
- Complete control over your data

## 📝 Usage Guide

### Adding Items
1. Navigate to "Add Items" page
2. Upload an image (click or drag-and-drop)
3. Enter item name
4. Select category
5. Add tags (optional)
6. Click "Save Item"

### Creating Outfits
1. Go to "Outfit Builder"
2. Select one item from each category
3. Preview your complete outfit
4. Click "Randomize" for inspiration (optional)
5. Click "Save Outfit" to save the combination
6. Enter outfit name and notes

### Managing Items
1. Visit "Gallery" page
2. Select category tab
3. Use search to find items
4. Click "Edit" to modify item details
5. Click "Delete" to remove items

### Viewing Saved Outfits
1. Navigate to "Saved Outfits"
2. Click on any outfit card to view details
3. See all items in the outfit
4. Delete outfits you no longer need

## 🛠️ Maintenance

The application requires no special maintenance. Data is automatically managed through the RESTful API.

## 📄 License

This project is ready for personal or commercial use.

## 🤝 Support

For questions or issues, refer to the usage guide above or check the browser console for debugging information.

---

**Built with ❤️ for fashion enthusiasts and organization lovers**

*Last Updated: 2024*
