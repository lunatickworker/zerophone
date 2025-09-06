import { Facebook, Instagram, Youtube, Twitter, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              <span className="text-yellow-400">특가 소식</span>을 가장 빠르게
            </h3>
            <p className="text-gray-300">
              신상품, 특가 이벤트, 커뮤니티 소식을 이메일로 받아보세요
            </p>
          </div>
          <div className="max-w-md mx-auto flex gap-3">
            <Input
              placeholder="이메일 주소를 입력하세요"
              className="bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6">
              구독하기
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              ZERO<span className="text-yellow-400">PHONE</span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              검증된 프리미엄 중고폰 전문 플랫폼으로, 
              안전하고 합리적인 중고폰 거래를 위해 
              최선을 다하고 있습니다.
            </p>
            <div className="flex gap-3">
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-yellow-400">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-yellow-400">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-yellow-400">
                <Youtube className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-300 hover:text-yellow-400">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-yellow-400">서비스</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">중고폰 구매</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">중고폰 판매</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">검수 서비스</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">AS 서비스</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">배송 서비스</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">보증 서비스</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-yellow-400">고객지원</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">고객센터</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">1:1 문의</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">이용가이드</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">교환/환불</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">분쟁해결</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-yellow-400">연락처</h4>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span>1588-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span>help@zerophone.co.kr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-yellow-400 mt-0.5" />
                <span>서울특별시 강남구<br />테헤란로 123길 45</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div>
                  <div>평일 09:00 - 18:00</div>
                  <div>토요일 09:00 - 15:00</div>
                  <div className="text-gray-400">일요일/공휴일 휴무</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 ZeroPhone. All rights reserved.
            </div>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-yellow-400 transition-colors">이용약관</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">개인정보처리방침</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">청소년보호정책</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">사업자정보확인</a>
            </div>
          </div>
          <div className="mt-4 text-gray-500 text-xs">
            <p>제로폰 주식회사 | 대표: 김제로 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 2024-서울강남-12345</p>
            <p>주소: 서울특별시 강남구 테헤란로 123길 45 | 개인정보보호책임자: 이보호 (privacy@zerophone.co.kr)</p>
          </div>
        </div>
      </div>
    </footer>
  );
}