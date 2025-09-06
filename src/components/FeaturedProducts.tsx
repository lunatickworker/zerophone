import { useEffect, useState } from "react";
import { Heart, /*Star,*/ Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "./Router";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
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

export function FeaturedProducts() {
  const { navigate } = useRouter();
  const { addItem } = useCart();
  const { user, accessToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const checkServerHealth = async () => {
    try {
      const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('Server health check:', healthData);
        return healthData;
      } else {
        console.error('Health check failed:', healthResponse.status, healthResponse.statusText);
        return null;
      }
    } catch (error) {
      console.error('Health check error:', error);
      return null;
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Starting product fetch...');
      
      // First check server health
      const health = await checkServerHealth();
      if (!health) {
        throw new Error('Server health check failed');
      }
      
      console.log('Fetching products from:', `https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/products?sort=newest`);
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/products?sort=newest`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched products:', data);
      
      if (Array.isArray(data)) {
        // Show only first 4 products for featured section
        setProducts(data.slice(0, 4));
      } else {
        console.error('Invalid data format:', data);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching products:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      // Set empty array on error to prevent breaking the UI
      setProducts([]);
    } finally {
      setLoading(false);
    }

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

  const handleQuickBuy = (product: Product) => {
    handleAddToCart(product);
    navigate('/checkout');
  };

  const getBadges = (product: Product) => {
    const badges = [];
    if (product.verified) badges.push('검수완료');
    if (product.discount >= 30) badges.push('할인특가');
    if (product.condition === 'S급') badges.push('최고등급');
    if (product.stock <= 2) badges.push('한정수량');
    return badges.slice(0, 2); // Show max 2 badges
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              오늘의 <span className="text-yellow-500">추천 상품</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              엄격한 검수를 통과한 프리미엄 중고폰을 특별한 가격에 만나보세요
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="w-full h-64 bg-gray-200"></div>
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            오늘의 <span className="text-yellow-500">추천 상품</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            엄격한 검수를 통과한 프리미엄 중고폰을 특별한 가격에 만나보세요
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const badges = getBadges(product);
            return (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Image Container */}
                  <div className="relative overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {badges.map((badge) => (
                        <Badge
                          key={badge}
                          className={`${
                            badge === "검수완료" 
                              ? "bg-green-500 hover:bg-green-600" 
                              : badge === "할인특가"
                              ? "bg-red-500 hover:bg-red-600"
                              : badge === "최고등급"
                              ? "bg-blue-500 hover:bg-blue-600"
                              : "bg-yellow-500 hover:bg-yellow-600"
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
                      <div className="text-2xl font-bold text-gray-900">
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
                        onClick={() => handleQuickBuy(product)}
                        disabled={product.stock === 0}
                      >
                        <Zap className="w-4 h-4 mr-1" />
                        {product.stock === 0 ? '품절' : '즉시구매'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View More */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="border-black text-black hover:bg-black hover:text-white"
            onClick={() => navigate('/products')}
          >
            더 많은 상품 보기
          </Button>
        </div>
      </div>
    </section>
  );
}
  }