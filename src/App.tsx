import { Router, Route } from "./components/Router";
import { CartProvider } from "./hooks/useCart";
import { AuthProvider } from "./hooks/useAuth";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
// import { FeaturedProducts } from "./components/FeaturedProducts";
import { BrandCategories } from "./components/BrandCategories";
import { CommunitySection } from "./components/CommunitySection";
import { EventsSection } from "./components/EventsSection";
import { Footer } from "./components/Footer";
import { ProductDetail } from "./components/ProductDetail";
import { Cart } from "./components/Cart";
import { Checkout } from "./components/Checkout";
import { Community } from "./components/Community";
import { AdminDashboard } from "./components/AdminDashboard";
import { UserProfile } from "./components/UserProfile";
import { ProductSearch } from "./components/ProductSearch";
import { LoginForm } from "./components/LoginForm";
import "./styles/globals.css";

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <BrandCategories />
        <CommunitySection />
        <EventsSection />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <Route path="/">
          <HomePage />
        </Route>
        
        <Route path="/product/:id">
          <ProductDetail productId="1" />
        </Route>
        
        <Route path="/cart">
          <Cart />
        </Route>
        
        <Route path="/checkout">
          <Checkout />
        </Route>
        
        <Route path="/community">
          <Community />
        </Route>
        
        <Route path="/admin">
          <AdminDashboard />
        </Route>
        
        <Route path="/profile">
          <UserProfile />
        </Route>
        
        <Route path="/search">
          <ProductSearch />
        </Route>
        
        <Route path="/products">
          <ProductSearch />
        </Route>
        
        <Route path="/login">
          <LoginForm />
        </Route>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}