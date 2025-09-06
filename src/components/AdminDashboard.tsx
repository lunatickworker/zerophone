import { useState, useEffect } from 'react';
import { 
  Package, Users, MessageCircle, TrendingUp, ShoppingCart, Star, 
  Plus, Edit, Trash2, Eye, Filter, Search, Download, BarChart3,
  AlertTriangle, RefreshCw, Home //, CheckCircle, Clock,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRouter } from './Router';
import { useAuth } from '../hooks/useAuth';
//import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalReviews: number;
  totalCommunityPosts: number;
  recentOrders: number;
  averageRating: number;
}

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

interface Order {
  id: number;
  userId: string;
  items: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  deliveredAt?: string;
}

export function AdminDashboard() {
  const { navigate } = useRouter();
  const { user, /*accessToken*/ } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 모의 데이터로 대체
    setStats({
      totalProducts: 156,
      totalOrders: 1243,
      totalRevenue: 187500000,
      totalReviews: 892,
      totalCommunityPosts: 245,
      recentOrders: 47,
      averageRating: 4.7
    });

    setProducts([
      {
        id: 1,
        name: "iPhone 14 Pro",
        brand: "Apple",
        model: "iPhone 14 Pro",
        storage: "256GB",
        color: "스페이스 블랙",
        condition: "A등급",
        price: 890000,
        originalPrice: 1190000,
        discount: 25,
        description: "최고급 중고폰",
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"],
        categoryId: 1,
        batteryHealth: 92,
        warranty: "3개월",
        verified: true,
        stock: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: "Galaxy S23 Ultra",
        brand: "Samsung",
        model: "Galaxy S23 Ultra",
        storage: "512GB",
        color: "파라텀 블랙",
        condition: "S등급",
        price: 850000,
        originalPrice: 1200000,
        discount: 29,
        description: "최고급 갤럭시",
        images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"],
        categoryId: 2,
        batteryHealth: 95,
        warranty: "6개월",
        verified: true,
        stock: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: "iPhone 13",
        brand: "Apple", 
        model: "iPhone 13",
        storage: "128GB",
        color: "미드나이트",
        condition: "B등급",
        price: 650000,
        originalPrice: 950000,
        discount: 32,
        description: "검수완료 중고폰",
        images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop"],
        categoryId: 1,
        batteryHealth: 87,
        warranty: "1개월",
        verified: true,
        stock: 0,
        createdAt: new Date().toISOString()
      }
    ]);

    setOrders([
      {
        id: 1001,
        userId: "김철수",
        items: [{
          productId: 1,
          productName: "iPhone 14 Pro",
          quantity: 1,
          price: 890000
        }],
        totalAmount: 890000,
        status: "completed",
        paymentMethod: "카드결제",
        shippingAddress: "서울시 강남구",
        createdAt: "2025-01-15T10:30:00Z",
        deliveredAt: "2025-01-17T14:20:00Z"
      }
    ]);

    setLoading(false);
  }, []);

  // 관리자 권한 체크
  if (!loading && (!user || !user.isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              접근 권한 없음
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              관리자 권한이 필요합니다. 관리자 계정으로 로그인해주세요.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                로그인하기
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                홈페이지로
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500 text-white">완료</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500 text-white">배송중</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">대기</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out_of_stock', color: 'bg-red-500' };
    if (stock <= 2) return { status: 'low_stock', color: 'bg-yellow-500' };
    return { status: 'in_stock', color: 'bg-green-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
            <p className="text-gray-600 mt-2">ZeroPhone 운영 현황을 한눈에 확인하세요</p>
          </div>
          <Button
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            <Home className="w-4 h-4 mr-2" />
            홈페이지
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 상품</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <p className="text-xs text-muted-foreground">등록된 상품 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 주문</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                최근 7일: {stats?.recentOrders || 0}개
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 매출</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(stats?.totalRevenue || 0).toLocaleString()}원
              </div>
              <p className="text-xs text-muted-foreground">누적 매출액</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">고객 만족도</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
              </div>
              <p className="text-xs text-muted-foreground">
                총 {stats?.totalReviews || 0}개 리뷰
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">대시보드</TabsTrigger>
            <TabsTrigger value="products">상품 관리</TabsTrigger>
            <TabsTrigger value="orders">주문 관리</TabsTrigger>
            <TabsTrigger value="customers">고객 관리</TabsTrigger>
            <TabsTrigger value="reports">리포트</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    최신 등록 상품
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <div key={product.id} className="flex items-center gap-4">
                          <ImageWithFallback
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {product.storage} {product.color}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {product.price.toLocaleString()}원
                            </p>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${stockStatus.color}`}></div>
                              <span className="text-xs text-gray-600">
                                재고 {product.stock}개
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>빠른 작업</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Plus className="w-6 h-6" />
                      상품 등록
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <MessageCircle className="w-6 h-6" />
                      공지사항 작성
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Users className="w-6 h-6" />
                      회원 관리
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <BarChart3 className="w-6 h-6" />
                      매출 분석
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input placeholder="상품명 검색..." className="w-80" />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="w-4 h-4 mr-2" />
                상품 추가
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>상품</TableHead>
                    <TableHead>브랜드</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>재고</TableHead>
                    <TableHead>등급</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">
                                {product.storage} {product.color}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${stockStatus.color}`}></div>
                            <span className="text-sm">
                              {product.stock === 0 ? '품절' : product.stock <= 2 ? '부족' : '정상'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.price.toLocaleString()}원
                        </TableCell>
                        <TableCell>{product.stock}개</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.condition}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input placeholder="주문번호 검색..." className="w-80" />
                <Button variant="outline" size="icon">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                내보내기
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>고객</TableHead>
                    <TableHead>상품</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead>작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        주문 내역이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono">{order.id}</TableCell>
                        <TableCell>{order.userId}</TableCell>
                        <TableCell>
                          {order.items.map(item => item.productName).join(', ')}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.totalAmount.toLocaleString()}원
                        </TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>고객 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  고객 관리 기능은 준비중입니다.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>브랜드별 판매 비율</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    차트 데이터 준비중...
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>월별 매출 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    차트 데이터 준비중...
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}