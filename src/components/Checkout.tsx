import { useState } from 'react';
import { CreditCard, Smartphone, Building, /*User,*/ MapPin, ArrowLeft, Check, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
//import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useCart } from '../hooks/useCart';
import { useRouter } from './Router';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { navigate } = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [qrCode, setQrCode] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: '',
    request: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const generateOrderNumber = () => {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ZP${date}${random}`;
  };

  const generateQRCode = (orderNum: string) => {
    // In a real app, this would generate an actual QR code
    // For demo purposes, we'll use a placeholder QR code image
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZeroPhone_Order_${orderNum}`;
  };

  const handlePayment = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newOrderNumber = generateOrderNumber();
    const newQrCode = generateQRCode(newOrderNumber);
    
    setOrderNumber(newOrderNumber);
    setQrCode(newQrCode);
    setOrderComplete(true);
    setIsProcessing(false);
    clearCart();
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">주문할 상품이 없습니다</h1>
          <Button onClick={() => navigate('/')} className="bg-yellow-400 hover:bg-yellow-500 text-black">
            쇼핑하러 가기
          </Button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">주문이 완료되었습니다!</h1>
              <p className="text-gray-600 mb-8">
                주문해주셔서 감사합니다. 24시간 내에 배송을 시작합니다.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">주문번호</span>
                    <span className="font-bold">{orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">결제금액</span>
                    <span className="font-bold text-yellow-600">{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">적립포인트</span>
                    <span className="font-bold text-green-600">+{Math.floor(totalPrice * 0.01).toLocaleString()}P</span>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white border rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <QrCode className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold">주문 확인 QR코드</h3>
                </div>
                <div className="flex justify-center mb-4">
                  <ImageWithFallback
                    src={qrCode}
                    alt="Order QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  배송 시 QR코드를 통해 주문을 확인할 수 있습니다.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/')} variant="outline">
                  홈으로 가기
                </Button>
                <Button onClick={() => navigate('/community')} className="bg-yellow-400 hover:bg-yellow-500 text-black">
                  후기 작성하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">주문/결제</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>주문 상품 ({items.length}개)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.model}</p>
                      <p className="text-sm text-gray-600">수량: {item.quantity}개</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{(item.price * item.quantity).toLocaleString()}원</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  배송 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">받는 분 이름 *</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">연락처 *</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="010-0000-0000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="주소를 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="detailAddress">상세주소</Label>
                  <Input
                    id="detailAddress"
                    value={shippingInfo.detailAddress}
                    onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                    placeholder="상세주소를 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="request">배송 요청사항</Label>
                  <Input
                    id="request"
                    value={shippingInfo.request}
                    onChange={(e) => handleInputChange('request', e.target.value)}
                    placeholder="배송 시 요청사항이 있으면 입력하세요"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>결제 방법</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      카드결제
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      간편결제
                    </TabsTrigger>
                    <TabsTrigger value="bank" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      계좌이체
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="cardNumber">카드번호</Label>
                      <Input id="cardNumber" placeholder="0000-0000-0000-0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">유효기간</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="000" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-16">
                        <div className="text-center">
                          <div className="text-blue-600 font-semibold">카카오페이</div>
                        </div>
                      </Button>
                      <Button variant="outline" className="h-16">
                        <div className="text-center">
                          <div className="text-green-600 font-semibold">네이버페이</div>
                        </div>
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="bank" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="bank">은행 선택</Label>
                      <select className="w-full p-2 border border-gray-300 rounded-md">
                        <option>은행을 선택하세요</option>
                        <option>국민은행</option>
                        <option>신한은행</option>
                        <option>우리은행</option>
                        <option>하나은행</option>
                      </select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>결제 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>상품 금액</span>
                    <span>{totalPrice.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span className="text-green-600">무료</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>적립 예정 포인트</span>
                    <span>+{Math.floor(totalPrice * 0.01).toLocaleString()}P</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-xl">
                      <span>총 결제 금액</span>
                      <span className="text-yellow-600">{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black h-12"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? '결제 처리 중...' : `${totalPrice.toLocaleString()}원 결제하기`}
                </Button>

                {/* Terms */}
                <div className="text-xs text-gray-500 space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    개인정보 수집 및 이용 동의 (필수)
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    결제 서비스 이용약관 동의 (필수)
                  </label>
                </div>

                {/* Security */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                    <span className="text-sm font-medium">안전한 결제</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    SSL 보안 암호화 및 PG사 안전결제 시스템으로 보호됩니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}