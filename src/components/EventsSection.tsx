import { Gift, Clock, Users, Award, ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

const events = [
  {
    id: 1,
    title: "신규 회원 특가 이벤트",
    description: "첫 구매 시 최대 50만원 할인!",
    type: "discount",
    endTime: "2025-12-31",
    participants: 1234,
    maxParticipants: 5000,
    reward: "최대 50만원 할인",
    image: "🎉",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "iPhone 15 응모 이벤트",
    description: "매주 1명씩 iPhone 15를 드려요!",
    type: "giveaway",
    endTime: "2025-12-15",
    participants: 8901,
    maxParticipants: 10000,
    reward: "iPhone 15 Pro",
    image: "📱",
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: 3,
    title: "친구 추천 이벤트",
    description: "친구 추천하고 양쪽 모두 혜택 받기!",
    type: "referral",
    endTime: "상시 진행",
    participants: 2456,
    reward: "각 5만원 적립금",
    image: "👥",
    color: "from-green-500 to-emerald-500"
  }
];

const promotions = [
  {
    title: "⚡ 24시간 번개세일",
    description: "선착순 100명 추가 20% 할인",
    remaining: "23:45:12",
    discount: "20%",
    urgent: true
  },
  {
    title: "🎁 첫 구매 쿠폰팩",
    description: "신규회원 전용 할인쿠폰 5종 세트",
    remaining: "무제한",
    discount: "15%",
    urgent: false
  },
  {
    title: "💎 VIP 회원 특가",
    description: "골드 등급 이상 회원 전용 할인",
    remaining: "7일",
    discount: "25%",
    urgent: false
  }
];

export function EventsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-16">
        {/* Events */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 진행 중인 <span className="text-yellow-500">이벤트</span>
            </h2>
            <p className="text-lg text-gray-600">
              다양한 이벤트에 참여하고 특별한 혜택을 받아보세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${event.color} p-6 text-white text-center`}>
                    <div className="text-4xl mb-2">{event.image}</div>
                    <Badge className="bg-white/20 text-white mb-3">
                      {event.type === "discount" ? "할인이벤트" : 
                       event.type === "giveaway" ? "응모이벤트" : "추천이벤트"}
                    </Badge>
                    <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                    <p className="text-white/90">{event.description}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Progress */}
                    {event.maxParticipants && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>참여현황</span>
                          <span>{event.participants.toLocaleString()} / {event.maxParticipants.toLocaleString()}명</span>
                        </div>
                        <Progress value={(event.participants / event.maxParticipants) * 100} className="h-2" />
                      </div>
                    )}

                    {/* Reward */}
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="text-sm text-gray-600 mb-1">혜택</div>
                      <div className="font-semibold text-yellow-700">{event.reward}</div>
                    </div>

                    {/* End Time */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>종료일</span>
                      </div>
                      <span>{event.endTime}</span>
                    </div>

                    {/* Action */}
                    <Button className="w-full bg-black hover:bg-gray-800 text-white">
                      <Gift className="w-4 h-4 mr-2" />
                      이벤트 참여하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Promotions */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              🏷️ 특가 <span className="text-yellow-500">프로모션</span>
            </h2>
            <p className="text-lg text-gray-600">
              놓치면 아쉬운 한정 특가 혜택들을 확인해보세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promotions.map((promo, index) => (
              <Card key={index} className={`group hover:shadow-xl transition-all duration-300 ${promo.urgent ? 'border-red-500 shadow-lg' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{promo.title}</CardTitle>
                    {promo.urgent && (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
                        긴급
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{promo.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Discount */}
                  <div className="text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4">
                    <div className="text-3xl font-bold">{promo.discount}</div>
                    <div className="text-sm">할인</div>
                  </div>

                  {/* Remaining */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">남은 시간</span>
                    <span className={`font-semibold ${promo.urgent ? 'text-red-500' : 'text-gray-900'}`}>
                      {promo.remaining}
                    </span>
                  </div>

                  {/* Action */}
                  <Button className={`w-full ${promo.urgent ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-400 hover:bg-yellow-500'} text-black`}>
                    {promo.urgent && <Zap className="w-4 h-4 mr-2" />}
                    쿠폰 받기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Points System Info */}
        <div className="bg-gradient-to-r from-black to-gray-800 rounded-2xl p-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">
                <span className="text-yellow-400">포인트 적립</span> 시스템
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="font-semibold">구매 시 1% 적립</div>
                    <div className="text-gray-300 text-sm">모든 구매금액의 1% 포인트 적립</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="font-semibold">리뷰 작성 시 5,000P</div>
                    <div className="text-gray-300 text-sm">구매 후기 작성하고 포인트 받기</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6 text-yellow-400" />
                  <div>
                    <div className="font-semibold">이벤트 참여 보너스</div>
                    <div className="text-gray-300 text-sm">낙첨 시에도 참여 포인트 지급</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-yellow-400 text-black rounded-2xl p-6 inline-block">
                <div className="text-4xl font-bold mb-2">15,240P</div>
                <div className="text-sm">보유 포인트</div>
              </div>
              <div className="mt-6">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  포인트 사용하기
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}