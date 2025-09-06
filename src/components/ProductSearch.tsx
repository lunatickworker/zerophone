import { useState, useEffect } from 'react';
import { Search, /*Filter,*/ SlidersHorizontal, Grid, List, /*Star,*/ Heart, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRouter } from './Router';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  condition: string;
  price: number;
  originalPrice: number;
  discount: number;
  description: string;
  images: string[];
  categoryId: number;
  batteryHealth: number;
  warranty: string;
  verified: boolean;
  stock: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface ProductSearchProps {
  searchQuery?: string;
  category?: string;
}

export function ProductSearch({ searchQuery = '', category = 'all' }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { navigate } = useRouter();
  const { addItem } = useCart();
  const { user, accessToken } = useAuth();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/categories`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched categories:', data);
        setCategories(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch categories:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('sort', sortBy);

      console.log('Fetching products with params:', params.toString());

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Products response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched products in search:', data);
        setProducts(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch products:', response.status, response.statusText, errorText);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken || publicAnonKey}`
        },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: 1
        })
      });

      // Also add to local cart for immediate UI feedback
      addItem({
        id: product.id.toString(),
        name: product.name,
        model: `${product.storage} ${product.color}`,
        price: product.price,
        originalPrice: product.originalPrice,
        condition: product.condition,
        image: product.images[0]
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('장바구니 추가 중 오류가 발생했습니다.');
    }
  };

  const filteredResults = products.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);
    const matchesStorage = selectedStorages.length === 0 || selectedStorages.includes(product.storage);
    
    return matchesPrice && matchesBrand && matchesCondition && matchesStorage;
  });

  // Get unique values for filters
  const brands = Array.from(new Set(products.map(p => p.brand)));
  const conditions = Array.from(new Set(products.map(p => p.condition)));
  const storages = Array.from(new Set(products.map(p => p.storage)));

  const getBadges = (product: Product) => {
    const badges = [];
    if (product.verified) badges.push('검수완료');
    if (product.discount >= 30) badges.push('할인특가');
    if (product.condition === 'S급') badges.push('최고등급');
    if (product.stock <= 2) badges.push('한정수량');
    return badges.slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">상품 검색</h1>
          </div>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="원하는 휴대폰을 검색하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && fetchProducts()}
              />
            </div>
            <Button onClick={fetchProducts} className="bg-black hover:bg-gray-800 text-white">
              검색
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              필터
            </Button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="whitespace-nowrap"
            >
              전체
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.slug)}
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold mb-4">가격대</h3>
                    <div className="space-y-4">
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={2000000}
                        min={0}
                        step={50000}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{priceRange[0].toLocaleString()}원</span>
                        <span>{priceRange[1].toLocaleString()}원</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">브랜드</h3>
                    <div className="space-y-3">
                      {brands.map(brand => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedBrands([...selectedBrands, brand]);
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand));
                              }
                            }}
                          />
                          <label htmlFor={`brand-${brand}`} className="text-sm">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Condition Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">상품 등급</h3>
                    <div className="space-y-3">
                      {conditions.map(condition => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={`condition-${condition}`}
                            checked={selectedConditions.includes(condition)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedConditions([...selectedConditions, condition]);
                              } else {
                                setSelectedConditions(selectedConditions.filter(c => c !== condition));
                              }
                            }}
                          />
                          <label htmlFor={`condition-${condition}`} className="text-sm">
                            {condition}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Storage Filter */}
                  <div>
                    <h3 className="font-semibold mb-4">저장용량</h3>
                    <div className="space-y-3">
                      {storages.map(storage => (
                        <div key={storage} className="flex items-center space-x-2">
                          <Checkbox
                            id={`storage-${storage}`}
                            checked={selectedStorages.includes(storage)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStorages([...selectedStorages, storage]);
                              } else {
                                setSelectedStorages(selectedStorages.filter(s => s !== storage));
                              }
                            }}
                          />
                          <label htmlFor={`storage-${storage}`} className="text-sm">
                            {storage}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setPriceRange([0, 2000000]);
                      setSelectedBrands([]);
                      setSelectedConditions([]);
                      setSelectedStorages([]);
                    }}
                  >
                    필터 초기화
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold">
                  {loading ? '검색 중...' : `검색결과 ${filteredResults.length}개`}
                </span>
                {searchTerm && (
                  <Badge variant="outline">
                    "{searchTerm}" 검색
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="price_low">낮은가격순</SelectItem>
                    <SelectItem value="price_high">높은가격순</SelectItem>
                    <SelectItem value="discount">할인율순</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="w-full h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        <div className="flex gap-2">
                          <div className="h-10 bg-gray-200 rounded flex-1"></div>
                          <div className="h-10 bg-gray-200 rounded flex-1"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Results Grid/List */}
            {!loading && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResults.map((product) => {
                      const badges = getBadges(product);
                      return (
                        <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                          <CardContent className="p-0">
                            {/* Image Container */}
                            <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                              <ImageWithFallback
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              
                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex flex-col gap-1">
                                {badges.map((badge) => (
                                  <Badge
                                    key={badge}
                                    className={`${
                                      badge === '검수완료' 
                                        ? 'bg-green-500 hover:bg-green-600' 
                                        : badge === '할인특가'
                                        ? 'bg-red-500 hover:bg-red-600'
                                        : 'bg-yellow-500 hover:bg-yellow-600'
                                    } text-white text-xs`}
                                  >
                                    {badge}
                                  </Badge>
                                ))}
                              </div>

                              {/* Condition */}
                              <div className="absolute top-3 right-3">
                                <Badge variant="secondary" className="bg-black text-white">
                                  {product.condition}
                                </Badge>
                              </div>

                              {/* Wishlist */}
                              <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-3 right-3 bg-white/90 hover:bg-white"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>

                              {/* Discount */}
                              <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
                                -{product.discount}%
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">{product.name}</h3>
                                <p className="text-gray-600 text-sm">{product.storage} {product.color}</p>
                              </div>

                              {/* Battery Health */}
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">배터리</span>
                                <div className="flex items-center gap-1">
                                  <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${product.batteryHealth >= 95 ? 'bg-green-500' : product.batteryHealth >= 85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                      style={{ width: `${product.batteryHealth}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-medium">{product.batteryHealth}%</span>
                                </div>
                              </div>

                              {/* Price */}
                              <div className="space-y-1">
                                <div className="text-gray-500 text-sm line-through">
                                  {product.originalPrice.toLocaleString()}원
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                  {product.price.toLocaleString()}원
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 pt-2">
                                <Button 
                                  className="flex-1 bg-black hover:bg-gray-800 text-white"
                                  onClick={() => handleAddToCart(product)}
                                  disabled={product.stock === 0}
                                >
                                  {product.stock === 0 ? '품절' : '장바구니'}
                                </Button>
                                <Button 
                                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                                  onClick={() => {
                                    handleAddToCart(product);
                                    navigate('/checkout');
                                  }}
                                  disabled={product.stock === 0}
                                >
                                  즉시구매
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredResults.map((product) => {
                      const badges = getBadges(product);
                      return (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex gap-6">
                              {/* Image */}
                              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                                   onClick={() => navigate(`/product/${product.id}`)}>
                                <ImageWithFallback
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Content */}
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      {badges.map((badge) => (
                                        <Badge key={badge} className="bg-yellow-500 text-white text-xs">
                                          {badge}
                                        </Badge>
                                      ))}
                                      <Badge variant="secondary" className="bg-black text-white">
                                        {product.condition}
                                      </Badge>
                                    </div>
                                    <h3 className="font-semibold text-xl text-gray-900 cursor-pointer hover:text-yellow-600"
                                        onClick={() => navigate(`/product/${product.id}`)}>
                                      {product.name}
                                    </h3>
                                    <p className="text-gray-600">{product.storage} {product.color}</p>
                                  </div>
                                  <Button size="icon" variant="ghost">
                                    <Heart className="w-5 h-5" />
                                  </Button>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm text-gray-600">배터리</span>
                                    <span className="font-medium">{product.batteryHealth}%</span>
                                  </div>
                                  <div className="text-red-500 font-medium">
                                    -{product.discount}% 할인
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <div className="text-gray-500 line-through">
                                      {product.originalPrice.toLocaleString()}원
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                      {product.price.toLocaleString()}원
                                    </div>
                                  </div>
                                  <div className="flex gap-3">
                                    <Button 
                                      className="bg-black hover:bg-gray-800 text-white"
                                      onClick={() => handleAddToCart(product)}
                                      disabled={product.stock === 0}
                                    >
                                      {product.stock === 0 ? '품절' : '장바구니'}
                                    </Button>
                                    <Button 
                                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                                      onClick={() => {
                                        handleAddToCart(product);
                                        navigate('/checkout');
                                      }}
                                      disabled={product.stock === 0}
                                    >
                                      즉시구매
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* No Results */}
                {filteredResults.length === 0 && (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                    <p className="text-gray-600 mb-6">다른 검색어를 시도해보거나 필터를 조정해보세요</p>
                    <Button 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        fetchProducts();
                      }} 
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      전체 상품 보기
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}