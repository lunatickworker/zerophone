import { useState } from 'react';
import { Heart, Star, Shield, Truck, RotateCcw, Zap, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../hooks/useCart';
import { useRouter } from './Router';

interface ProductDetailProps {
  productId: string;
}

const productData = {
  "1": {
    id: "1",
    name: "iPhone 15 Pro",
    model: "128GB 티타늄 블루",
    originalPrice: 1550000,
    price: 1280000,
    discount: 17,
    rating: 4.9,
    reviews: 234,
    condition: "S급",
    images: [
      "https://images.unsplash.com/photo-1695619575333-fc73accd441e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhpcGhvbmUlMjBzYW1zdW5nJTIwbHV4dXJ5JTIwcGhvbmVzfGVufDF8fHx8MTc1NzEzNzQzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1603313011186-4711e7f8e477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc21hcnRwaG9uZSUyMGJsYWNrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTcxMzc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    specifications: {
      brand: "Apple",
      storage: "128GB",
      color: "티타늄 블루",
      network: "5G",
      display: "6.1인치 Super Retina XDR",
      processor: "A17 Pro 칩",
      camera: "48MP 메인 + 12MP 초광각 + 12MP 망원",
      battery: "3274mAh"
    },
    inspectionResults: {
      display: { score: 95, note: "미세한 스크래치 없음, 밝기 정상" },
      battery: { score: 88, note: "배터리 효율 88%, 교체 불필요" },
      camera: { score: 100, note: "모든 렌즈 정상 작동, 화질 우수" },
      body: { score: 92, note: "모서리 미세 사용감, 전체적으로 양호" },
      function: { score: 100, note: "모든 기능 정상 작동 확인" }
    },
    warranty: {
      period: "12개월",
      coverage: "하드웨어 결함, 배터리 성능 저하",
      note: "구매일로부터 12개월간 품질보증"
    }
  }
};

export function ProductDetail({ productId }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { navigate } = useRouter();

  const product = productData[productId as keyof typeof productData];

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
        <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        model: product.model,
        price: product.price,
        originalPrice: product.originalPrice,
        condition: product.condition,
        image: product.images[0]
      });
    }
  };

  const averageInspectionScore = Object.values(product.inspectionResults)
    .reduce((sum, result) => sum + result.score, 0) / Object.keys(product.inspectionResults).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-yellow-600">홈</button>
            <span>&gt;</span>
            <button onClick={() => navigate('/')} className="hover:text-yellow-600">전체상품</button>
            <span>&gt;</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-xl bg-white p-8">
              <ImageWithFallback
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? 'border-yellow-400' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Rating */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-green-500 text-white">{product.condition}</Badge>
                <Badge variant="outline">검수완료</Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.model}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-gray-500">({product.reviews}개 리뷰)</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-white rounded-xl p-6">
              <div className="space-y-2">
                <div className="text-gray-500 line-through">
                  정가 {product.originalPrice.toLocaleString()}원
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {product.price.toLocaleString()}원
                  </span>
                  <Badge className="bg-red-500 text-white">
                    {product.discount}% 할인
                  </Badge>
                </div>
                <div className="text-sm text-green-600">
                  ✓ 정가 대비 {(product.originalPrice - product.price).toLocaleString()}원 절약
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">수량</span>
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  장바구니
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black"
                  onClick={() => {
                    handleAddToCart();
                    navigate('/checkout');
                  }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  즉시구매
                </Button>
              </div>

              <Button size="sm" variant="ghost" className="w-full">
                <Heart className="w-4 h-4 mr-2" />
                찜하기
              </Button>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="font-semibold mb-4">구매 혜택</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span>12개월 품질보증</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span>무료배송 (24시간 내 발송)</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-5 h-5 text-purple-500" />
                  <span>30일 교환보장</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-16">
          <Tabs defaultValue="inspection" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inspection">검수 결과</TabsTrigger>
              <TabsTrigger value="specs">제품 사양</TabsTrigger>
              <TabsTrigger value="warranty">보증 서비스</TabsTrigger>
              <TabsTrigger value="reviews">구매 후기</TabsTrigger>
            </TabsList>

            <TabsContent value="inspection" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-green-500" />
                    전문 검수 결과
                    <Badge className="bg-green-500 text-white">
                      종합 {averageInspectionScore.toFixed(1)}점
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1740126102414-fee092192258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwaW5zcGVjdGlvbiUyMHF1YWxpdHklMjBjaGVja3xlbnwxfHx8fDE3NTcxMzk3NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="Product Inspection"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-4">
                      {Object.entries(product.inspectionResults).map(([category, result]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium capitalize">{
                              category === 'display' ? '디스플레이' :
                              category === 'battery' ? '배터리' :
                              category === 'camera' ? '카메라' :
                              category === 'body' ? '외관' : '기능'
                            }</span>
                            <span className="font-bold text-green-600">{result.score}점</span>
                          </div>
                          <Progress value={result.score} className="h-2" />
                          <p className="text-sm text-gray-600">{result.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs">
              <Card>
                <CardHeader>
                  <CardTitle>제품 사양</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600 capitalize">{
                          key === 'brand' ? '브랜드' :
                          key === 'storage' ? '저장용량' :
                          key === 'color' ? '색상' :
                          key === 'network' ? '네트워크' :
                          key === 'display' ? '디스플레이' :
                          key === 'processor' ? '프로세서' :
                          key === 'camera' ? '카메라' : '배터리'
                        }</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="warranty">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-500" />
                    보증 서비스
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-4">ZeroPhone 품질보증</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">보증 기간</span>
                        <span className="font-semibold text-blue-900">{product.warranty.period}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">보증 범위</span>
                        <span className="font-semibold text-blue-900">{product.warranty.coverage}</span>
                      </div>
                      <p className="text-sm text-blue-600 pt-3 border-t border-blue-200">
                        {product.warranty.note}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Shield className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">품질보증</h4>
                      <p className="text-sm text-gray-600">하드웨어 결함 시 무상 수리</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <RotateCcw className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">교환보장</h4>
                      <p className="text-sm text-gray-600">30일 내 무료 교환 가능</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Truck className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">무료배송</h4>
                      <p className="text-sm text-gray-600">A/S 시 왕복 무료배송</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>구매 후기 ({product.reviews}개)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { author: "김****", rating: 5, content: "정말 깨끗한 상태로 왔어요! 검수도 꼼꼼히 해주시고 포장도 완벽했습니다.", date: "2024-01-15" },
                      { author: "박****", rating: 5, content: "배터리 성능도 좋고 외관도 거의 새것 같아요. 가격도 합리적이고 만족합니다.", date: "2024-01-12" },
                      { author: "이****", rating: 4, content: "전체적으로 만족하지만 약간의 사용감은 있어요. 그래도 가성비는 최고!", date: "2024-01-10" }
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{review.author}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}