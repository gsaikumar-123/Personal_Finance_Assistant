# Personal Finance Assistant - Frontend

A modern, responsive frontend for the Personal Finance Assistant application built with React, Vite, and Tailwind CSS.

## Features

- **User Authentication**: Sign up, login, and logout functionality
- **Transaction Management**: Add, edit, delete, and filter transactions
- **Data Visualization**: Interactive charts showing expenses by category and income vs expenses over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI/UX**: Clean, professional interface with smooth transitions

## Tech Stack

- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Chart.js** - Data visualization library
- **React Chart.js 2** - React wrapper for Chart.js

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running on `http://localhost:1234`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── charts/
│   │   │   ├── CategoryChart.jsx
│   │   │   └── DateChart.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Select.jsx
│   │   └── transactions/
│   │       ├── TransactionForm.jsx
│   │       ├── TransactionList.jsx
│   │       └── TransactionFilter.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── Signup.jsx
│   ├── utils/
│   │   ├── api.js
│   │   └── format.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the backend API running on `http://localhost:1234`. The API proxy is configured in `vite.config.js` to handle CORS and cookie-based authentication.

### Authentication Endpoints
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/logout` - User logout
- `GET /api/profile/view` - Get user profile

### Transaction Endpoints
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions/add` - Add new transaction
- `PUT /api/transactions/update/:id` - Update transaction
- `DELETE /api/transactions/delete/:id` - Delete transaction
- `GET /api/transactions/:type` - Filter by type
- `GET /api/transactions/filter/:fromDate/:toDate` - Filter by date range
- `GET /api/transactions/filter/:category` - Filter by category

## Features Overview

### Dashboard
- Financial overview with total income, expenses, and balance
- Interactive charts showing expense categories and trends
- Transaction management with add, edit, and delete functionality
- Advanced filtering options

### Authentication
- Secure user registration and login
- Protected routes for authenticated users
- Automatic session management with JWT cookies

### Transaction Management
- Add income and expense transactions
- Categorize transactions with predefined categories
- Track payment methods
- Filter and search transactions

### Data Visualization
- Doughnut chart for expense categories
- Line chart for income vs expenses over time
- Responsive charts that work on all devices

## Styling

The application uses Tailwind CSS with a custom color scheme:
- Primary: `#1E3A8A` (Blue)
- Secondary: `#64748B` (Gray)
- Income: `#10B981` (Green)
- Expense: `#EF4444` (Red)
- Background: `#F1F5F9` (Light Gray)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Components
1. Create the component in the appropriate directory under `src/components/`
2. Follow the existing naming conventions and structure
3. Use Tailwind CSS classes for styling
4. Add proper TypeScript types if using TypeScript

### Adding New Pages
1. Create the page component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Use the `ProtectedRoute` component for authenticated pages

### API Integration
1. Add new API functions in `src/utils/api.js`
2. Use the existing axios instance with proper error handling
3. Update the AuthContext if needed for new authentication flows

## Troubleshooting

### Common Issues

1. **Blank Page**: Check browser console for JavaScript errors
2. **API Connection**: Ensure backend server is running on port 1234
3. **Authentication Issues**: Clear browser cookies and try again
4. **Build Errors**: Run `npm install` to ensure all dependencies are installed

### Development Tips

- Use browser developer tools to debug API calls
- Check the Network tab for failed requests
- Use React Developer Tools for component debugging
- Monitor the console for error messages

## Contributing

1. Follow the existing code style and conventions
2. Test your changes thoroughly
3. Ensure responsive design works on mobile devices
4. Update documentation as needed

## License

This project is part of the Personal Finance Assistant application.
