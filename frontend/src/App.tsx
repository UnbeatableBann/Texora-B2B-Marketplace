import { BrowserRouter, Routes, Route } from 'react-router';
import { LoginForm } from './features/auth/components/LoginForm';
import { RegisterForm } from './features/auth/components/RegisterForm';
import { AppLayout } from './layouts/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './features/auth/useAuthStore';
import { useEffect } from 'react';
import { OnboardingPage } from './features/onboarding/pages/OnboardingPage';
import { BuyerDashboardPage } from './features/dashboard/pages/BuyerDashboardPage';
import { SupplierDashboardPage } from './features/dashboard/pages/SupplierDashboardPage';
import { DashboardPage } from './features/dashboard/pages/DashboardPage';
import { SupplierProductsPage } from './features/catalog/pages/SupplierProductsPage';
import { CreateProductPage } from './features/catalog/pages/CreateProductPage';
import { EditProductPage } from './features/catalog/pages/EditProductPage';
import { SupplierInventoryPage } from './features/catalog/pages/SupplierInventoryPage';
import { MarketplacePage } from './features/catalog/pages/MarketplacePage';
import { HomePage } from './features/catalog/pages/HomePage';
import { CategoryPage } from './features/catalog/pages/CategoryPage';
import { ProductDetailsPage } from './features/catalog/pages/ProductDetailsPage';
import { CartPage } from './features/commerce/pages/CartPage';
import { CheckoutPage } from './features/commerce/pages/CheckoutPage';
import { OrderConfirmationPage } from './features/commerce/pages/OrderConfirmationPage';
import { OrdersPage } from './features/commerce/pages/OrdersPage';

import { AIAssistant } from './features/ai/components/AIAssistant';

function App() {
  const fetchUser = useAuthStore(state => state.fetchUser);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        
        {/* Unified Layout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/categories/:id" element={<CategoryPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Protected Routes inside AppLayout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/dashboard/buyer" element={<BuyerDashboardPage />} />
            <Route path="/dashboard/supplier" element={<SupplierDashboardPage />} />
            <Route path="/dashboard/supplier/products" element={<SupplierProductsPage />} />
            <Route path="/dashboard/supplier/products/new" element={<CreateProductPage />} />
            <Route path="/dashboard/supplier/products/:id/edit" element={<EditProductPage />} />
            <Route path="/dashboard/supplier/inventory" element={<SupplierInventoryPage />} />
            
            <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
        </Route>
      </Routes>
      <AIAssistant />
    </BrowserRouter>
  );
}

export default App;
