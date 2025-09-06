import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useRouter } from "./Router";

const brands = [
  {
    name: "Apple",
    logo: "🍎",
    count: "2,345",
    popular: true,
    gradient: "from-gray-100 to-gray-200"
  },
  {
    name: "Samsung",
    logo: "📱",
    count: "1,867",
    popular: true,
    gradient: "from-blue-100 to-blue-200"
  },
  {
    name: "Google",
    logo: "🔍",
    count: "456",
    popular: false,
    gradient: "from-green-100 to-green-200"
  },
  {
    name: "Xiaomi",
    logo: "⚡",
    count: "789",
    popular: false,
    gradient: "from-orange-100 to-orange-200"
  },
  {
    name: "OnePlus",
    logo: "1️⃣",
    count: "234",
    popular: false,
    gradient: "from-red-100 to-red-200"
  },
  {
    name: "기타",
    logo: "📲",
    count: "567",
    popular: false,
    gradient: "from-purple-100 to-purple-200"
  }
];

const priceRanges = [
  { range: "10만원 미만", count: "234", color: "bg-green-500" },
  { range: "10-30만원", count: "567", color: "bg-blue-500" },
  { range: "30-50만원", count: "890", color: "bg-yellow-500" },
  { range: "50-100만원", count: "1,234", color: "bg-orange-500" },
  { range: "100만원 이상", count: "890", color: "bg-red-500" }
];

export function BrandCategories() {
  const { navigate } = useRouter();
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* Brand Categories */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-yellow-500">브랜드별</span> 둘러보기
            </h2>
            <p className="text-lg text-gray-600">
              인기 브랜드별로 검증된 중고폰을 찾아보세요
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brands.map((brand) => (
              <Card 
                key={brand.name} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                    {brand.logo}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                      {brand.popular && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">
                          인기
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{brand.count}개 상품</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Price Categories */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-yellow-500">가격대별</span> 찾기
            </h2>
            <p className="text-lg text-gray-600">
              예산에 맞는 합리적인 가격의 중고폰을 선택하세요
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            {priceRanges.map((range, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  <div className={`${range.color} h-2 w-full`} />
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 mb-2">{range.range}</h3>
                    <p className="text-sm text-gray-500">{range.count}개 상품</p>
                    <div className="mt-4">
                      <div className="text-2xl mb-2">
                        {index === 0 ? "💚" : index === 1 ? "💙" : index === 2 ? "💛" : index === 3 ? "🧡" : "❤️"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">빠른 필터</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "신상품", "인기상품", "할인특가", "S급 상품", "빠른배송", 
              "24시간 내 검수", "30일 교환보장", "무료배송", "즉시구매 가능"
            ].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}