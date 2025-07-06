import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Navigation from './components/common/Navigation'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import AddTransaction from './pages/AddTransaction'
import EditTransaction from './pages/EditTransaction'
import FilterTransactions from './pages/FilterTransactions'
import ReceiptExtractor from './pages/ReceiptExtractor'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="App">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-transaction"
                element={
                  <ProtectedRoute>
                    <AddTransaction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-transaction/:id"
                element={
                  <ProtectedRoute>
                    <EditTransaction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/filter-transactions"
                element={
                  <ProtectedRoute>
                    <FilterTransactions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receipt-extractor"
                element={
                  <ProtectedRoute>
                    <ReceiptExtractor />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
