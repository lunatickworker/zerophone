import { MessageCircle, TrendingUp, Users, Award, ArrowRight, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent/*, CardHeader, CardTitle */ } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const communityPosts = [
  {
    id: 1,
    type: "review",
    title: "iPhone 15 Pro 구매 후기 - 정말 만족합니다!",
    author: "김****",
    rating: 5,
    likes: 234,
    comments: 45,
    time: "2시간 전",
    image: "https://images.unsplash.com/photo-1695619575333-fc73accd441e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHhpcGhvbmUlMjBzYW1zdW5nJTIwbHV4dXJ5JTIwcGhvbmVzfGVufDF8fHx8MTc1NzEzNzQzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    type: "discussion",
    title: "2025년 최고의 중고폰 브랜드는?",
    author: "박****",
    poll: { total: 1567, apple: 45, samsung: 35, google: 20 },
    likes: 89,
    comments: 156,
    time: "5시간 전",
    image: "https://images.unsplash.com/photo-1666232784495-d865a7dc7de9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tbXVuaXR5JTIwZGlzY3Vzc2lvbnxlbnwxfHx8fDE3NTcxMzc0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    type: "blog",
    title: "중고폰 구매 전 체크해야 할 10가지",
    author: "ZeroPhone",
    likes: 456,
    comments: 78,
    time: "1일 전",
    image: "https://images.unsplash.com/photo-1698613080997-d3573f22b82c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGNvbGxlY3Rpb24lMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTcxMzc0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const communityStats = [
  { icon: Users, label: "활성 회원", value: "15,234", color: "text-blue-500" },
  { icon: MessageCircle, label: "월간 리뷰", value: "2,456", color: "text-green-500" },
  { icon: TrendingUp, label: "토론 참여", value: "8,901", color: "text-purple-500" },
  { icon: Award, label: "베스트 후기", value: "156", color: "text-yellow-500" }
];

export function CommunitySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            <span className="text-yellow-500">커뮤니티</span> 소식
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            실제 구매 후기와 전문가 의견, 그리고 다양한 토론에 참여해보세요
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Rolling Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {communityPosts.map((post) => (
            <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={
                      post.type === "review" 
                        ? "bg-green-500 hover:bg-green-600" 
                        : post.type === "discussion"
                        ? "bg-purple-500 hover:bg-purple-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }>
                      {post.type === "review" ? "리뷰" : post.type === "discussion" ? "토론" : "블로그"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Author & Time */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>by {post.author}</span>
                    <span>{post.time}</span>
                  </div>

                  {/* Rating for reviews */}
                  {post.type === "review" && post.rating && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < post.rating ? "text-yellow-400" : "text-gray-300"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Poll for discussions */}
                  {post.type === "discussion" && post.poll && (
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">투표 결과 ({post.poll.total}명 참여)</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Apple</span>
                          <span>{post.poll.apple}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${post.poll.apple}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Interactions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-yellow-600 hover:text-yellow-700">
                      더보기
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Community CTA */}
        <div className="mt-12 bg-black rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            ZeroPhone 커뮤니티에 <span className="text-yellow-400">참여하세요</span>
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            구매 후기 작성하고 포인트 적립받고, 다양한 토론에 참여해서 
            더 나은 중고폰 경험을 함께 만들어가요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black">
              후기 작성하기
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black bg-transparent">
              토론 참여하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}