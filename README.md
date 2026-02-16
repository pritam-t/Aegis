# Aegis AI Admin Dashboard

An intelligent vision-driven decision platform for traffic violation management with AI-powered validation and reasoning.

## Project Structure

```
admin-dashboard/
├── index.html              # Entry point (redirects to login)
├── README.md              # Documentation
├── css/
│   └── styles.css         # All CSS styles
├── js/
│   └── data.js            # Violation data and utilities
└── pages/
    ├── login.html         # Login page
    ├── signup.html        # Signup page
    ├── home.html          # Dashboard home page
    ├── events.html        # Events page (grouped by date)
    └── detail.html        # Event detail page
```

## Key Changes from Previous Version

### 1. Branding
- Changed from "TrafficWatch" to **"Aegis"**
- Updated all references and branding throughout

### 2. Navigation Bar
- Added persistent navigation bar on all dashboard pages
- Shows: **Home** | **Events** | **Logout**
- Active page highlighting with orange color

### 3. Home Page Improvements
- Content based on Aegis AI documentation
- Professional system description
- Architecture overview with key components
- AI agent layer explanation
- Key features highlighting

### 4. Events Page (Renamed from Violations)
- **3 Summary cards at top:**
  - Today's Events
  - High Confidence (>95%)
  - Pending Payment
- **Date-grouped cards layout:**
  - Violations organized by date
  - Each date shows formatted header (e.g., "Thursday, February 15, 2024")
  - Cards display in responsive grid (3 columns on desktop)
  - Hover effects for better UX
- **Card-based design** instead of table
- Click any card to view full details

### 5. Detail Page
- Updated with navigation bar
- "Event Details" instead of "Violation Details"
- Consistent navigation across all pages

## Features

### Pages
1. **Login Page** - Email and password authentication
2. **Signup Page** - User registration
3. **Home Page** - System overview with Aegis AI description, architecture, and features
4. **Events Page** - Date-grouped violation cards with summary statistics
5. **Detail Page** - Complete event information with evidence image

### Design Specifications
- **Font**: Hubot Sans
- **Colors**: 
  - Primary: Orange (#ff6b35)
  - Dark Gray: (#2d2d2d)
  - Green: (#28a745) for success
  - Yellow: (#ffc107) for warning
  - Red: (#dc3545) for violations
  - White background throughout
- **Layout**: Card-based design with clean shadows
- **Navigation**: Persistent top bar with menu

### Data Structure
- 10 sample violation records
- Grouped by date for organized display
- Each record includes:
  - ID, Number Plate, Date, Time
  - Confidence Score, Violation Type
  - Fine Amount, Payment Status
  - Owner Details (Name, Mobile, Email)
  - Location, Address, Evidence Image

## Navigation Flow

1. **index.html** → Redirects to login
2. **login.html** → Login → Home
3. **signup.html** → Signup → Home
4. **home.html** → Dashboard with Aegis overview
   - Click "View All Events" → Events page
5. **events.html** → Date-grouped violation cards
   - Click any card → Detail page
6. **detail.html** → Full event information
   - Click "Back to Events" → Events page
7. **Logout button** → Returns to login

## How to Use

1. Open `index.html` in a web browser
2. You'll be redirected to the login page
3. Click "Login" (demo mode - no validation)
4. Explore the dashboard:
   - **Home**: View system overview and statistics
   - **Events**: Browse violations grouped by date
   - Click any event card for detailed information
5. Use navigation bar to switch between pages
6. Click "Logout" to return to login

## Technical Implementation

### CSS Organization
- Authentication styles
- Dashboard and navigation styles
- Card-based layouts
- Date-grouped section styles
- Responsive grid systems

### JavaScript Features
- Date grouping function
- Statistics calculation
- Dynamic card generation
- URL parameter handling for detail pages
- Date formatting utilities

## Customization

### Adding More Events
Edit `js/data.js` and add objects to the `violationData` array with the same structure.

### Changing Colors
Edit `css/styles.css` and update color values (search for `#ff6b35`, `#2d2d2d`, etc.)

### Modifying Content
Edit individual HTML files in the `pages/` folder to update content and layout.

## Future Enhancements

- Real backend integration with Spring Boot
- AI agent validation display
- Confidence score visualization
- Real-time event monitoring
- Advanced filtering and search
- Export functionality
- Multi-camera support
