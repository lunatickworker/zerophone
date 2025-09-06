import { Search, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "./Router";

export function HeroSection() {
  const { navigate } = useRouter();
  
  return (
    <section className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                검증된 중고폰
                <br />
                <span className="text-yellow-400">프리미엄 품질</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-lg">
                엄격한 검수 기준을 통과한 프리미엄 중고 스마트폰을 
                합리적인 가격에 만나보세요.
              </p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-6 shadow-xl">
              <div className="space-y-4">
                <h3 className="text-black text-lg font-semibold">원하는 기기를 찾아보세요</h3>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="브랜드, 모델명을 입력하세요"
                      className="pl-10 py-3 border-gray-300 text-black"
                    />
                  </div>
                  <Button 
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3"
                    onClick={() => navigate('/products')}
                  >
                    검색
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-600 text-sm">인기 검색:</span>
                  {["iPhone 15", "Galaxy S24", "iPhone 14", "Pixel 8"].map((term) => (
                    <button
                      key={term}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-yellow-100 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">98%</div>
                <div className="text-gray-300 text-sm">고객 만족도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">24h</div>
                <div className="text-gray-300 text-sm">빠른 배송</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">1년</div>
                <div className="text-gray-300 text-sm">품질 보증</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1603313011186-4711e7f8e477?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwc21hcnRwaG9uZSUyMGJsYWNrJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NTcxMzc0MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Premium Smartphone"
                className="w-full h-[500px] object-cover rounded-xl"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold">
              검수 완료
            </div>
            <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
              🔥 오늘의 인기상품
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}