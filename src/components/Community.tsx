import { useState, useEffect } from 'react';
import { MessageCircle, TrendingUp, /*Users,*/ Plus, Heart, Eye, ArrowRight, Vote, BarChart3, Home, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
//import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
//import { Progress } from './ui/progress';
//import { ImageWithFallback } from './figma/ImageWithFallback';
import { useRouter } from './Router';
import { useAuth } from '../hooks/useAuth';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: string;
  likes: number;
  replies: number;
  createdAt: string;
  isNotice: boolean;
}

export function Community() {
  const { navigate } = useRouter();
  const { user, accessToken } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '일반'
  });
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);

  useEffect(() => {
    fetchCommunityPosts();
  }, []);

  const fetchCommunityPosts = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/community`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched community posts:', data);
        setPosts(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch community posts:', response.status, response.statusText);
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-a2a27f6d/community`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(newPost)
      });

      if (response.ok) {
        const createdPost = await response.json();
        setPosts([createdPost, ...posts]);
        setNewPost({ title: '', content: '', category: '일반' });
        setShowNewPostDialog(false);
        alert('게시글이 성공적으로 작성되었습니다!');
      } else {
        alert('게시글 작성 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  const getCategoryBadge = (category: string, isNotice: boolean) => {
    if (isNotice) {
      return <Badge className="bg-red-500 text-white">공지</Badge>;
    }

    switch (category) {
      case '후기':
        return <Badge className="bg-blue-500 text-white">후기</Badge>;
      case '토론':
        return <Badge className="bg-green-500 text-white">토론</Badge>;
      case '질문':
        return <Badge className="bg-yellow-500 text-white">질문</Badge>;
      default:
        return <Badge variant="secondary">{category}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              뒤로가기
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              홈
            </Button>
          </div>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900">커뮤니티</h1>
            <p className="text-gray-600 mt-2">ZeroPhone 사용자들과 소통해보세요</p>
          </div>
          <div className="w-32"></div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">전체 게시글</h2>
                <Badge variant="outline">{posts.length}개</Badge>
              </div>
              
              <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    글 쓰기
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>새 게시글 작성</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">카테고리</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      >
                        <option value="일반">일반</option>
                        <option value="후기">후기</option>
                        <option value="토론">토론</option>
                        <option value="질문">질문</option>
                        {user?.isAdmin && <option value="공지">공지</option>}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">제목</label>
                      <Input
                        placeholder="제목을 입력하세요"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">내용</label>
                      <Textarea
                        placeholder="내용을 입력하세요"
                        className="min-h-[200px]"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                        취소
                      </Button>
                      <Button onClick={handleCreatePost} className="bg-black hover:bg-gray-800 text-white">
                        게시글 작성
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getCategoryBadge(post.category, post.isNotice)}
                          <span className="text-sm text-gray-600">{post.author}</span>
                          <span className="text-sm text-gray-400">
                            {getTimeAgo(post.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 cursor-pointer hover:text-yellow-600">
                          {post.title}
                        </h3>
                        <p className="text-gray-700 line-clamp-2">
                          {post.content}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm">{post.replies}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">조회수</span>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          자세히 보기
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {posts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-16">
                    <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      아직 게시글이 없습니다
                    </h3>
                    <p className="text-gray-500 mb-6">
                      첫 번째 게시글을 작성해보세요!
                    </p>
                    <Button 
                      onClick={() => setShowNewPostDialog(true)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      글 쓰기
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  커뮤니티 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">전체 게시글</span>
                  <span className="font-semibold">{posts.length}개</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">오늘 등록</span>
                  <span className="font-semibold text-green-600">
                    {posts.filter(post => {
                      const today = new Date().toDateString();
                      const postDate = new Date(post.createdAt).toDateString();
                      return today === postDate;
                    }).length}개
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">활성 사용자</span>
                  <span className="font-semibold">
                    {new Set(posts.map(post => post.authorId)).size}명
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>카테고리</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['전체', '공지', '후기', '토론', '질문', '일반'].map((category) => {
                    const count = category === '전체' 
                      ? posts.length 
                      : posts.filter(post => 
                          category === '공지' 
                            ? post.isNotice 
                            : post.category === category && !post.isNotice
                        ).length;
                    
                    return (
                      <button
                        key={category}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <span className="text-sm">{category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  인기 글
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {posts
                    .sort((a, b) => b.likes - a.likes)
                    .slice(0, 5)
                    .map((post, index) => (
                      <div key={post.id} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            👍 {post.likes} · 💬 {post.replies}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>빠른 참여</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      if (!user) {
                        navigate('/login');
                        return;
                      }
                      setShowNewPostDialog(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    새 글 작성
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100">
                    <Vote className="w-4 h-4 mr-2" />
                    토론 참여하기
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    후기 작성
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}