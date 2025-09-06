import { useState } from 'react';
import { /*User,*/ Star, ShoppingBag, Gift, Edit, Heart, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRouter } from './Router';

const userGrades = {
  bronze: { name: '브론즈', color: 'bg-orange-500', benefits: ['기본 할인 1%', '생일 쿠폰'], nextGrade: 'silver', requiredAmount: 500000 },
  silver: { name: '실버', color: 'bg-gray-400', benefits: ['기본 할인 3%', '생일 쿠폰', '무료배송'], nextGrade: 'gold', requiredAmount: 1000000 },
  gold: { name: '골드', color: 'bg-yellow-500', benefits: ['기본 할인 5%', '생일 쿠폰', '무료배송', '전용 상담'], nextGrade: 'vip', requiredAmount: 3000000 },
  vip: { name: 'VIP', color: 'bg-purple-500', benefits: ['기본 할인 7%', '생일 쿠폰', '무료배송', '전용 상담', '신상품 우선구매'], nextGrade: null, requiredAmount: 0 }
};

const orderHistory = [
  {
    id: 'ZP20240115001',
    product: 'iPhone 15 Pro 128GB 티타늄 블루',
    price: 1280000,
    date: '2024-01-15',
    status: 'delivered',
    image: 'https://images.unsplash.com/photo-1695619575333-fc73accd441e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhpcGhvbmUlMjBzYW1zdW5nJTIwbHV4dXJ5JTIwcGhvbmVzfGVufDF8fHx8MTc1NzEzNzQzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: 'ZP20240105002',
    product: 'Galaxy S23 256GB 팬텀 블랙',
    price: 890000,
    date: '2024-01-05',
    status: 'delivered',
    image: 'https://images.unsplash.com/photo-1698613080997-d3573f22b82c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGNvbGxlY3Rpb24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTcxMzc0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

const favoriteProducts = [
  {
    id: 1,
    name: 'iPhone 15',
    model: '128GB 블루',
    price: 1150000,
    originalPrice: 1350000,
    image: 'https://images.unsplash.com/photo-1603313011186-4711e7f8e477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc21hcnRwaG9uZSUyMGJsYWNrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTcxMzc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function UserProfile() {
  const [activeTab, setActiveTab] = useState('overview');
  const { navigate } = useRouter();
  
  // Mock user data
  const currentUser = {
    name: '김제로',
    email: 'user@zerophone.co.kr',
    phone: '010-1234-5678',
    grade: 'gold' as keyof typeof userGrades,
    totalSpent: 2170000,
    points: 15240,
    joinDate: '2023-05-15',
    orderCount: 8,
    reviewCount: 5
  };

  const currentGrade = userGrades[currentUser.grade];
  const progressToNext = currentGrade.nextGrade 
    ? (currentUser.totalSpent / userGrades[currentGrade.nextGrade as keyof typeof userGrades].requiredAmount) * 100 
    : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  👤
                </div>
                <h3 className="font-semibold text-lg mb-1">{currentUser.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{currentUser.email}</p>
                
                {/* Grade Badge */}
                <div className="space-y-3">
                  <Badge className={`${currentGrade.color} text-white px-4 py-2`}>
                    {currentGrade.name} 등급
                  </Badge>
                  
                  {currentGrade.nextGrade && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        {userGrades[currentGrade.nextGrade as keyof typeof userGrades].name} 등급까지
                      </div>
                      <Progress value={Math.min(progressToNext, 100)} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {Math.max(0, userGrades[currentGrade.nextGrade as keyof typeof userGrades].requiredAmount - currentUser.totalSpent).toLocaleString()}원 더 구매
                      </div>
                    </div>
                  )}
                </div>
                
                <Button className="w-full mt-4" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  프로필 수정
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">활동 현황</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">총 주문</span>
                  </div>
                  <span className="font-semibold">{currentUser.orderCount}회</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">리뷰 작성</span>
                  </div>
                  <span className="font-semibold">{currentUser.reviewCount}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">보유 포인트</span>
                  </div>
                  <span className="font-semibold">{currentUser.points.toLocaleString()}P</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">총 구매액</span>
                  </div>
                  <span className="font-semibold">{currentUser.totalSpent.toLocaleString()}원</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">개요</TabsTrigger>
                <TabsTrigger value="orders">주문내역</TabsTrigger>
                <TabsTrigger value="reviews">리뷰</TabsTrigger>
                <TabsTrigger value="favorites">찜목록</TabsTrigger>
                <TabsTrigger value="benefits">혜택</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Grade Benefits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      {currentGrade.name} 등급 혜택
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentGrade.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>최근 주문</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                            <ImageWithFallback
                              src={order.image}
                              alt={order.product}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{order.product}</h4>
                            <p className="text-sm text-gray-600">{order.date}</p>
                            <p className="text-sm font-semibold">{order.price.toLocaleString()}원</p>
                          </div>
                          <Badge className="bg-green-500 text-white">배송완료</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>주문 내역</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={order.image}
                              alt={order.product}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium">{order.product}</h4>
                            <p className="text-sm text-gray-600">주문번호: {order.id}</p>
                            <p className="text-sm text-gray-600">주문일: {order.date}</p>
                            <p className="font-semibold">{order.price.toLocaleString()}원</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className="bg-green-500 text-white">배송완료</Badge>
                            <Button size="sm" variant="outline">
                              재주문
                            </Button>
                            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                              리뷰 작성
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>작성한 리뷰</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          product: 'iPhone 15 Pro',
                          rating: 5,
                          content: '정말 깨끗한 상태로 왔어요! 검수도 꼼꼼히 해주시고 포장도 완벽했습니다.',
                          date: '2024-01-16',
                          helpful: 12
                        },
                        {
                          product: 'Galaxy S23',
                          rating: 4,
                          content: '배터리 성능도 좋고 외관도 거의 새것 같아요. 가격도 합리적이고 만족합니다.',
                          date: '2024-01-06',
                          helpful: 8
                        }
                      ].map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{review.product}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">도움됨 {review.helpful}명</span>
                          </div>
                          <p className="text-gray-700">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      찜한 상품
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {favoriteProducts.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.model}</p>
                            <div className="space-y-1">
                              <div className="text-sm text-gray-500 line-through">
                                {product.originalPrice.toLocaleString()}원
                              </div>
                              <div className="font-semibold">
                                {product.price.toLocaleString()}원
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-black">
                              장바구니
                            </Button>
                            <Button size="sm" variant="outline">
                              <Heart className="w-3 h-3 mr-1 fill-red-500 text-red-500" />
                              해제
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Benefits Tab */}
              <TabsContent value="benefits" className="space-y-6">
                {/* Grade Progression */}
                <Card>
                  <CardHeader>
                    <CardTitle>등급별 혜택</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {Object.entries(userGrades).map(([gradeKey, grade]) => (
                        <div key={gradeKey} className={`p-4 rounded-lg border-2 ${gradeKey === currentUser.grade ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge className={`${grade.color} text-white`}>
                                {grade.name}
                              </Badge>
                              {gradeKey === currentUser.grade && (
                                <Badge variant="outline">현재 등급</Badge>
                              )}
                            </div>
                            {gradeKey !== 'bronze' && (
                              <span className="text-sm text-gray-600">
                                {grade.requiredAmount.toLocaleString()}원 이상 구매
                              </span>
                            )}
                          </div>
                          <div className="grid md:grid-cols-2 gap-2">
                            {grade.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Available Coupons */}
                <Card>
                  <CardHeader>
                    <CardTitle>사용 가능한 쿠폰</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { name: '신규회원 10% 할인', discount: '10%', minAmount: 100000, expires: '2024-12-31' },
                        { name: '골드등급 5% 할인', discount: '5%', minAmount: 50000, expires: '2024-12-31' },
                        { name: '생일축하 20% 할인', discount: '20%', minAmount: 200000, expires: '2024-02-15' }
                      ].map((coupon, index) => (
                        <div key={index} className="border border-dashed border-yellow-400 rounded-lg p-4 bg-yellow-50">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600 mb-1">{coupon.discount}</div>
                            <div className="font-medium mb-2">{coupon.name}</div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>{coupon.minAmount.toLocaleString()}원 이상 구매시</div>
                              <div>유효기간: {coupon.expires}</div>
                            </div>
                          </div>
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
    </div>
  );
}