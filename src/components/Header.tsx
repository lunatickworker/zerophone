import { useState } from "react";
import { Search, /*Heart,*/ ShoppingCart, User, Menu, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "./Router";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

export function Header() {
  const { navigate } = useRouter();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        {/* Single Row Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center">
            <h1 className="text-xl font-bold hover:opacity-80 transition-opacity">
              ZERO<span className="text-gold">PHONE</span>
            </h1>
          </button>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-10 flex-1 justify-center">
            <button 
              className="text-white hover:text-gold transition-colors text-sm"
              onClick={() => navigate('/products')}
            >
              전체상품
            </button>
            <button 
              className="text-white hover:text-gold transition-colors text-sm"
              onClick={() => navigate('/products')}
            >
              브랜드별
            </button>
            <button 
              className="text-white hover:text-gold transition-colors text-sm"
              onClick={() => navigate('/products')}
            >
              가격대별
            </button>
            <button 
              className="text-white hover:text-gold transition-colors text-sm"
              onClick={() => navigate('/products')}
            >
              인기상품
            </button>
            <button className="text-white hover:text-gold transition-colors text-sm">
              이벤트
            </button>
            <button 
              className="text-white hover:text-gold transition-colors text-sm"
              onClick={() => navigate('/community')}
            >
              커뮤니티
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Icon */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-gold hidden md:flex"
              onClick={() => navigate('/search')}
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-gold relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-primary text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:text-gold"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 text-sm text-gold border-b">
                    {user.name}님
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    내 프로필
                  </DropdownMenuItem>
                  {(user.isAdmin || true) && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      관리자 페이지
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-yellow-400 text-xs"
                onClick={() => navigate('/login')}
              >
                로그인
              </Button>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="lg:hidden text-white hover:text-yellow-400">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden border-t border-gray-800 py-3">
          <div className="flex items-center bg-gray-900 rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-gray-400 mr-3" />
            <Input
              placeholder="휴대폰 검색"
              className="bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}