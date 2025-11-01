# ZappEats - Food Delivery App Project Plan

## Tech Stack Overview
- **Frontend**: React + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (with Mongoose ODM)

---

## 1. Project Structure

```
ZappEats/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context for state management
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Express API server
│   ├── config/              # Configuration files (DB, JWT, etc.)
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API route handlers
│   ├── controllers/         # Business logic
│   ├── middleware/          # Custom middleware (auth, validation)
│   ├── utils/               # Helper functions
│   ├── server.js            # Entry point
│   └── package.json
│
└── README.md
```

---

## 2. Database Models (MongoDB Schemas)

### 2.1 User Model
- `_id` (ObjectId)
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String, hashed, required)
- `phone` (String)
- `address` (Object with street, city, zipCode)
- `role` (String: 'customer' | 'admin' | 'restaurant_owner')
- `avatar` (String, URL)
- `createdAt` (Date)
- `updatedAt` (Date)

### 2.2 Restaurant Model
- `_id` (ObjectId)
- `name` (String, required)
- `description` (String)
- `cuisine` (String: 'Italian', 'Chinese', 'Indian', etc.)
- `image` (String, URL)
- `rating` (Number, default: 0)
- `reviewCount` (Number, default: 0)
- `deliveryTime` (String: "30-40 mins")
- `deliveryFee` (Number)
- `minimumOrder` (Number)
- `isActive` (Boolean, default: true)
- `location` (Object with coordinates for future map integration)
- `ownerId` (ObjectId, ref: User)
- `createdAt` (Date)
- `updatedAt` (Date)

### 2.3 MenuItem Model
- `_id` (ObjectId)
- `restaurantId` (ObjectId, ref: Restaurant)
- `name` (String, required)
- `description` (String)
- `price` (Number, required)
- `category` (String: 'appetizer', 'main', 'dessert', 'beverage')
- `image` (String, URL)
- `isAvailable` (Boolean, default: true)
- `ingredients` ([String])
- `createdAt` (Date)
- `updatedAt` (Date)

### 2.4 Order Model
- `_id` (ObjectId)
- `userId` (ObjectId, ref: User)
- `restaurantId` (ObjectId, ref: Restaurant)
- `items` ([{
    - `menuItemId` (ObjectId, ref: MenuItem)
    - `name` (String)
    - `quantity` (Number)
    - `price` (Number)
  }])
- `subtotal` (Number)
- `deliveryFee` (Number)
- `tax` (Number)
- `total` (Number)
- `status` (String: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled')
- `deliveryAddress` (Object)
- `paymentMethod` (String: 'cash' | 'card')
- `paymentStatus` (String: 'pending' | 'paid' | 'failed')
- `orderDate` (Date)
- `estimatedDeliveryTime` (Date)
- `createdAt` (Date)
- `updatedAt` (Date)

### 2.5 Review Model (Optional - for future)
- `_id` (ObjectId)
- `userId` (ObjectId, ref: User)
- `restaurantId` (ObjectId, ref: Restaurant)
- `orderId` (ObjectId, ref: Order)
- `rating` (Number, 1-5)
- `comment` (String)
- `createdAt` (Date)

---

## 3. Backend API Endpoints

### 3.1 Authentication Routes (`/api/auth`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### 3.2 Restaurant Routes (`/api/restaurants`)
- `GET /api/restaurants` - Get all restaurants (with filters: cuisine, rating, search)
- `GET /api/restaurants/:id` - Get single restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu
- `POST /api/restaurants` - Create restaurant (admin/owner only)
- `PUT /api/restaurants/:id` - Update restaurant (owner/admin only)
- `DELETE /api/restaurants/:id` - Delete restaurant (admin only)

### 3.3 Menu Routes (`/api/menu`)
- `GET /api/menu/:restaurantId` - Get menu items for restaurant
- `POST /api/menu` - Add menu item (restaurant owner only)
- `PUT /api/menu/:id` - Update menu item (owner only)
- `DELETE /api/menu/:id` - Delete menu item (owner only)

### 3.4 Order Routes (`/api/orders`)
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get order details (protected)
- `PUT /api/orders/:id/status` - Update order status (owner/admin only)
- `PUT /api/orders/:id/cancel` - Cancel order (customer/owner)

### 3.5 Cart Routes (`/api/cart`) - Optional (can use localStorage)
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

---

## 4. Frontend Components Structure

### 4.1 Layout Components
- `Header` - Navigation bar with logo, search, cart icon, user menu
- `Footer` - Footer with links and info
- `Layout` - Wrapper component for pages

### 4.2 Auth Components
- `Login` - Login form
- `Register` - Registration form
- `Profile` - User profile page

### 4.3 Restaurant Components
- `RestaurantList` - Grid/list of restaurants
- `RestaurantCard` - Individual restaurant card
- `RestaurantDetail` - Restaurant details page
- `RestaurantFilters` - Filter sidebar (cuisine, rating, etc.)

### 4.4 Menu Components
- `MenuList` - Menu items list
- `MenuItemCard` - Individual menu item card
- `MenuCategory` - Category section

### 4.5 Cart Components
- `Cart` - Cart sidebar/overlay
- `CartItem` - Individual cart item
- `CartSummary` - Cart total and checkout button

### 4.6 Order Components
- `Checkout` - Checkout page
- `OrderForm` - Delivery address and payment form
- `OrderHistory` - List of past orders
- `OrderDetails` - Single order details
- `OrderTracker` - Order status tracker

### 4.7 UI Components (Reusable)
- `Button` - Styled button component
- `Input` - Form input field
- `Modal` - Modal/dialog component
- `LoadingSpinner` - Loading indicator
- `Toast` - Notification toast
- `Rating` - Star rating display
- `SearchBar` - Search input component

---

## 5. Frontend Pages/Routes

- `/` - Home page (restaurant listings)
- `/login` - Login page
- `/register` - Registration page
- `/restaurants` - Restaurant list page
- `/restaurants/:id` - Restaurant detail page
- `/cart` - Shopping cart page
- `/checkout` - Checkout page
- `/orders` - Order history page
- `/orders/:id` - Order details page
- `/profile` - User profile page

---

## 6. State Management

### 6.1 React Context API
- `AuthContext` - User authentication state
- `CartContext` - Shopping cart state (can use localStorage for persistence)
- `OrderContext` - Order-related state

### 6.2 Local State
- Form states (React hooks)
- UI states (modals, loading, etc.)
- Filter/search states

---

## 7. Key Features Implementation Plan

### 7.1 Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes (frontend & backend)
- Role-based access control (customer, owner, admin)

### 7.2 Restaurant Browsing
- Search restaurants by name
- Filter by cuisine type
- Sort by rating, delivery time, price
- Pagination for restaurant list

### 7.3 Menu Display
- Categorized menu items
- Item details with images
- Add to cart functionality
- Availability status

### 7.4 Shopping Cart
- Add/remove items
- Update quantities
- Calculate subtotal, taxes, delivery fee
- Persist cart (localStorage or backend)

### 7.5 Order Management
- Create order with address
- Order confirmation
- Order status tracking
- Order history

### 7.6 Payment (Phase 1 - Mock)
- Cash on delivery option
- Card payment (mock for now)
- Payment status tracking

---

## 8. Middleware & Security

### 8.1 Backend Middleware
- `authMiddleware` - Verify JWT token
- `errorHandler` - Centralized error handling
- `validationMiddleware` - Request validation
- `rateLimiter` - Rate limiting for API
- `cors` - CORS configuration

### 8.2 Security Measures
- Password hashing (bcrypt)
- JWT token expiration
- Input validation & sanitization
- MongoDB injection prevention
- Environment variables for sensitive data

---

## 9. UI/UX Design Approach

### 9.1 Color Scheme
- Primary color (brand color)
- Secondary colors
- Success/Error/Warning colors
- Dark/Light mode (optional)

### 9.2 Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons and inputs
- Mobile navigation menu

### 9.3 User Experience
- Loading states for async operations
- Error messages and validation feedback
- Success notifications
- Smooth transitions and animations
- Accessible components (ARIA labels)

---

## 10. Development Phases

### Phase 1: Foundation
1. Set up project structure (frontend & backend)
2. Configure MongoDB connection
3. Create database models
4. Set up authentication (register/login)
5. Basic API structure

### Phase 2: Core Features
1. Restaurant listing and details
2. Menu display
3. Shopping cart functionality
4. Order creation
5. Order history

### Phase 3: Enhancement
1. Search and filters
2. Order tracking
3. User profile management
4. Restaurant management (for owners)
5. Reviews and ratings (optional)

### Phase 4: Polish
1. UI/UX improvements
2. Error handling
3. Performance optimization
4. Testing
5. Deployment preparation

---

## 11. Additional Considerations

### 11.1 Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

### 11.2 Dependencies

**Backend:**
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- express-validator (for validation)
- multer (for file uploads, if needed)

**Frontend:**
- react
- react-router-dom
- axios (for API calls)
- tailwindcss
- react-icons (for icons)
- react-toastify (for notifications)

### 11.3 File Structure Best Practices
- Separate concerns (routes, controllers, models)
- Reusable components
- Consistent naming conventions
- Error boundaries in React
- API service layer

---

## 12. Testing Strategy (Future)
- Unit tests for utilities
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical flows

---

## 13. Deployment Considerations
- Frontend: Vercel, Netlify, or similar
- Backend: Heroku, Railway, or AWS
- Database: MongoDB Atlas (cloud)
- Environment variables configuration
- CORS settings for production

---

This plan provides a comprehensive roadmap for building the ZappEats food delivery application. Each phase can be implemented incrementally, ensuring a working application at every stage.

