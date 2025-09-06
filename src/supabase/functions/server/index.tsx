import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createClient } from "@supabase/supabase-js";

// 타입 정의 추가
type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
};
type Product = {
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
};
type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  grade: string;
  points: number;
  totalPurchase: number;
  joinDate: string;
  isAdmin: boolean;
};
type Review = {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
};
type CommunityPost = {
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
};
type Event = {
  id: number;
  title: string;
  description: string;
  type: string;
  reward: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  image: string;
};
type Order = {
  id: number;
  userId: string;
  items: { productId: number; productName: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  shippedAt?: string;
  deliveredAt?: string;
};
type PointHistory = {
  id: number;
  userId: string;
  type: string;
  amount: number;
  reason: string;
  createdAt: string;
};

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-requested-with"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    exposeHeaders: ["Content-Length"],
    maxAge: 86400,
    credentials: false,
  }),
);

// Initialize Supabase client for server operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// dataStore에 타입 적용
const dataStore: {
  products: Product[];
  categories: Category[];
  users: Map<string, User>;
  reviews: Review[];
  communityPosts: CommunityPost[];
  events: Event[];
  orders: Order[];
  pointHistory: PointHistory[];
  cart: Map<string, any[]>;
  counters: {
    lastProductId: number;
    lastReviewId: number;
    lastCommunityPostId: number;
    lastEventId: number;
    lastOrderId: number;
    lastPointHistoryId: number;
  };
  initialized: boolean;
} = {
  products: [],
  categories: [],
  users: new Map(),
  reviews: [],
  communityPosts: [],
  events: [],
  orders: [],
  pointHistory: [],
  cart: new Map(),
  counters: {
    lastProductId: 5,
    lastReviewId: 3,
    lastCommunityPostId: 3,
    lastEventId: 3,
    lastOrderId: 2,
    lastPointHistoryId: 4
  },
  initialized: false
};

// Initialize sample data
function initializeData() {
  if (dataStore.initialized) {
    console.log('Data already initialized');
    return;
  }

  console.log('Initializing ZeroPhone data store...');

  // Initialize categories
  dataStore.categories = [
    { id: 1, name: 'iPhone', slug: 'iphone', description: 'Apple iPhone 시리즈' },
    { id: 2, name: 'Galaxy', slug: 'galaxy', description: 'Samsung Galaxy 시리즈' },
    { id: 3, name: 'LG', slug: 'lg', description: 'LG 휴대폰 시리즈' },
    { id: 4, name: 'Pixel', slug: 'pixel', description: 'Google Pixel 시리즈' },
    { id: 5, name: '기타', slug: 'others', description: '기타 브랜드' }
  ];

  // Initialize products
  dataStore.products = [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      storage: '128GB',
      color: '딥 퍼플',
      condition: 'S급',
      price: 980000,
      originalPrice: 1350000,
      discount: 27,
      description: '완전 새것같은 상태의 iPhone 14 Pro입니다.',
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'],
      categoryId: 1,
      batteryHealth: 98,
      warranty: '1개월',
      verified: true,
      stock: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Galaxy S23 Ultra',
      brand: 'Samsung',
      model: 'Galaxy S23 Ultra',
      storage: '256GB',
      color: '팬텀 블랙',
      condition: 'A급',
      price: 850000,
      originalPrice: 1200000,
      discount: 29,
      description: '최고 성능의 갤럭시 S23 울트라입니다.',
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500'],
      categoryId: 2,
      batteryHealth: 95,
      warranty: '1개월',
      verified: true,
      stock: 5,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'iPhone 13',
      brand: 'Apple',
      model: 'iPhone 13',
      storage: '128GB',
      color: '미드나이트',
      condition: 'A급',
      price: 650000,
      originalPrice: 950000,
      discount: 32,
      description: '깔끔한 상태의 iPhone 13입니다.',
      images: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500'],
      categoryId: 1,
      batteryHealth: 92,
      warranty: '1개월',
      verified: true,
      stock: 2,
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      name: 'Galaxy S22',
      brand: 'Samsung',
      model: 'Galaxy S22',
      storage: '128GB',
      color: '팬텀 화이트',
      condition: 'B급',
      price: 450000,
      originalPrice: 700000,
      discount: 36,
      description: '사용감은 있지만 기능상 문제없는 제품입니다.',
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'],
      categoryId: 2,
      batteryHealth: 88,
      warranty: '1개월',
      verified: true,
      stock: 4,
      createdAt: new Date().toISOString()
    },
    {
      id: 5,
      name: 'Pixel 7 Pro',
      brand: 'Google',
      model: 'Pixel 7 Pro',
      storage: '256GB',
      color: '오브시디안',
      condition: 'S급',
      price: 750000,
      originalPrice: 1000000,
      discount: 25,
      description: '구글의 최고 카메라 성능을 자랑하는 제품입니다.',
      images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500'],
      categoryId: 4,
      batteryHealth: 96,
      warranty: '1개월',
      verified: true,
      stock: 1,
      createdAt: new Date().toISOString()
    }
  ];

  // Initialize users
  const users = [
    {
      id: 'user1',
      email: 'user1@example.com',
      name: '김철수',
      phone: '010-1234-5678',
      grade: 'VIP',
      points: 15000,
      totalPurchase: 2000000,
      joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      isAdmin: false
    },
    {
      id: 'user2',
      email: 'user2@example.com',
      name: '이영희',
      phone: '010-2345-6789',
      grade: 'GOLD',
      points: 8000,
      totalPurchase: 800000,
      joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      isAdmin: false
    },
    {
      id: 'admin',
      email: 'admin@zerophone.com',
      name: '관리자',
      phone: '010-0000-0000',
      grade: 'ADMIN',
      points: 0,
      totalPurchase: 0,
      joinDate: new Date().toISOString(),
      isAdmin: true
    }
  ];

  users.forEach(user => dataStore.users.set(user.id, user));

  // Initialize reviews
  dataStore.reviews = [
    {
      id: 1,
      productId: 1,
      userId: 'user1',
      userName: '김철수',
      rating: 5,
      comment: '정말 새것같아요! 배송도 빠르고 포장도 완벽했습니다.',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true
    },
    {
      id: 2,
      productId: 2,
      userId: 'user2',
      userName: '이영희',
      rating: 4,
      comment: '상태 좋고 성능도 만족합니다. 다음에도 이용할게요.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true
    },
    {
      id: 3,
      productId: 1,
      userId: 'user2',
      userName: '이영희',
      rating: 5,
      comment: '검수 기준이 엄격해서 믿고 살 수 있어요.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      verified: true
    }
  ];

  // Initialize community posts
  dataStore.communityPosts = [
    {
      id: 1,
      title: 'iPhone 14 Pro 후기',
      content: '제로폰에서 구매한 iPhone 14 Pro 정말 만족합니다. 검수 기준이 정말 까다로워서 믿고 살 수 있어요!',
      author: '김철수',
      authorId: 'user1',
      category: '후기',
      likes: 15,
      replies: 3,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isNotice: false
    },
    {
      id: 2,
      title: '[공지] 제로폰 리뉴얼 안내',
      content: '더 나은 서비스 제공을 위해 제로폰이 리뉴얼되었습니다. 많은 이용 부탁드립니다.',
      author: '관리자',
      authorId: 'admin',
      category: '공지',
      likes: 42,
      replies: 8,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isNotice: true
    },
    {
      id: 3,
      title: 'Galaxy S23 vs iPhone 14 비교',
      content: '두 제품 모두 사용해본 결과 각각 장단점이 있네요. 여러분은 어떤 제품을 선호하시나요?',
      author: '이영희',
      authorId: 'user2',
      category: '토론',
      likes: 28,
      replies: 12,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isNotice: false
    }
  ];

  // Initialize events
  dataStore.events = [
    {
      id: 1,
      title: '신규 회원 가입 이벤트',
      description: '신규 회원 가입 시 5,000원 적립금 지급!',
      type: 'signup',
      reward: 5000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500'
    },
    {
      id: 2,
      title: '첫 구매 할인 이벤트',
      description: '첫 구매 시 10% 할인 쿠폰 제공!',
      type: 'first_purchase',
      reward: 10,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=500'
    },
    {
      id: 3,
      title: '리뷰 작성 적립금 이벤트',
      description: '상품 구매 후 리뷰 작성 시 1,000원 적립금 지급!',
      type: 'review',
      reward: 1000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500'
    }
  ];

  // Initialize orders
  dataStore.orders = [
    {
      id: 1,
      userId: 'user1',
      items: [
        { productId: 1, productName: 'iPhone 14 Pro', quantity: 1, price: 980000 }
      ],
      totalAmount: 980000,
      status: 'delivered',
      paymentMethod: '카드',
      shippingAddress: '서울시 강남구 테헤란로 123',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      userId: 'user2',
      items: [
        { productId: 2, productName: 'Galaxy S23 Ultra', quantity: 1, price: 850000 }
      ],
      totalAmount: 850000,
      status: 'shipped',
      paymentMethod: '카드',
      shippingAddress: '부산시 해운대구 센텀로 456',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Initialize point history
  dataStore.pointHistory = [
    {
      id: 1,
      userId: 'user1',
      type: 'earned',
      amount: 5000,
      reason: '신규 가입 적립금',
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      userId: 'user1',
      type: 'earned',
      amount: 10000,
      reason: '첫 구매 적립금',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      userId: 'user2',
      type: 'earned',
      amount: 5000,
      reason: '신규 가입 적립금',
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 4,
      userId: 'user2',
      type: 'earned',
      amount: 3000,
      reason: '리뷰 작성 적립금',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  dataStore.initialized = true;
  console.log('ZeroPhone data store initialized successfully!');
  console.log('Sample products created:', dataStore.products.length);
  console.log('Sample categories created:', dataStore.categories.length);
}

// Initialize data on startup
initializeData();

// Health check endpoint
app.get("/make-server-a2a27f6d/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: {
      initialized: dataStore.initialized,
      productsCount: dataStore.products.length,
      categoriesCount: dataStore.categories.length
    }
  });
});

// Authentication endpoints
app.post("/make-server-a2a27f6d/signup", async (c) => {
  try {
    const { email, password, name, phone } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, phone },
      email_confirm: true // Auto-confirm since email server not configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create user profile in memory
    const userId = data.user?.id;
    if (userId) {
      const userProfile = {
        id: userId,
        email,
        name,
        phone,
        grade: 'BRONZE',
        points: 5000, // Welcome bonus
        totalPurchase: 0,
        joinDate: new Date().toISOString(),
        isAdmin: false
      };

      dataStore.users.set(userId, userProfile);

      // Add welcome point history
      dataStore.counters.lastPointHistoryId++;
      const pointRecord = {
        id: dataStore.counters.lastPointHistoryId,
        userId,
        type: 'earned',
        amount: 5000,
        reason: '신규 가입 적립금',
        createdAt: new Date().toISOString()
      };

      dataStore.pointHistory.push(pointRecord);
    }

    return c.json({
      message: 'User created successfully',
      user: { id: userId, email, name }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

app.post("/make-server-a2a27f6d/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Handle admin login specially
    if ((email === 'admin@zerophone.com' || email === 'admin') && password === 'admin') {
      const adminUser = dataStore.users.get('admin') || {
        id: 'admin',
        email: 'admin@zerophone.com',
        name: '관리자',
        phone: '010-0000-0000',
        grade: 'ADMIN',
        points: 0,
        totalPurchase: 0,
        joinDate: new Date().toISOString(),
        isAdmin: true
      };

      return c.json({
        message: 'Admin login successful',
        user: adminUser,
        access_token: 'admin_token'
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Signin error:', error);
      return c.json({ error: error.message }, 401);
    }

    // Get user profile from memory
    const userId = data.user?.id;
    const userProfile = dataStore.users.get(userId);

    return c.json({
      message: 'Login successful',
      user: userProfile || data.user,
      access_token: data.session?.access_token
    });
  } catch (error) {
    console.error('Signin error:', error);
    return c.json({ error: 'Internal server error during signin' }, 500);
  }
});

app.post("/make-server-a2a27f6d/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    if (accessToken && accessToken !== 'admin_token') {
      await supabase.auth.admin.signOut(accessToken);
    }

    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Signout error:', error);
    return c.json({ error: 'Internal server error during signout' }, 500);
  }
});

// Products endpoints
app.get("/make-server-a2a27f6d/products", (c) => {
  try {
    const category = c.req.query('category');
    const search = c.req.query('search');
    const sort = c.req.query('sort') || 'newest';

    let products = [...dataStore.products];

    // Filter by category
    if (category && category !== 'all') {
      const categoryData = dataStore.categories.find(cat => cat.slug === category);
      if (categoryData) {
        products = products.filter(p => p.categoryId === categoryData.id);
      }
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.model.toLowerCase().includes(searchLower)
      );
    }

    // Sort products
    switch (sort) {
      case 'price_low':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        products.sort((a, b) => b.discount - a.discount);
        break;
      case 'newest':
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return c.json(products);
  } catch (error) {
    const err = error as Error;
    console.error('Error message:', err.message);
    return c.json({ error: err.message }, 500);
  }
});

  app.get("/make-server-a2a27f6d/products/:id", (c) => {
    try {
      const id = parseInt(c.req.param('id'));
      const product = dataStore.products.find(p => p.id === id);

      if (!product) {
        return c.json({ error: 'Product not found' }, 404);
      }

      // Get product reviews
      const productReviews = dataStore.reviews.filter(r => r.productId === id);

      return c.json({
        ...product,
        reviews: productReviews,
        averageRating: productReviews.length > 0
          ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
          : 0
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      return c.json({ error: 'Failed to fetch product' }, 500);
    }
  });

  // Categories endpoint
  app.get("/make-server-a2a27f6d/categories", (c) => {
    try {
      return c.json(dataStore.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return c.json({ error: 'Failed to fetch categories' }, 500);
    }
  });

  // Reviews endpoints
  app.post("/make-server-a2a27f6d/reviews", async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      if (!accessToken) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { productId, rating, comment } = await c.req.json();

      let userId: string, userName: string;
      if (accessToken === 'admin_token') {
        userId = 'admin';
        userName = '관리자';
      } else {
        const { data: { user } } = await supabase.auth.getUser(accessToken);
        if (!user) {
          return c.json({ error: 'Unauthorized' }, 401);
        }
        userId = user.id;
        const userProfile = dataStore.users.get(userId);
        userName = userProfile?.name ?? user.email ?? "알수없음"; // 항상 string이 되도록!
      }

      dataStore.counters.lastReviewId++;
      const review = {
        id: dataStore.counters.lastReviewId,
        productId: parseInt(productId),
        userId,
        userName,
        rating: parseInt(rating),
        comment,
        createdAt: new Date().toISOString(),
        verified: true
      };

      dataStore.reviews.push(review);
      return c.json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      return c.json({ error: 'Failed to create review' }, 500);
    }
  });

  // Community endpoints
  app.get("/make-server-a2a27f6d/community", (c) => {
    try {
      const sortedPosts = [...dataStore.communityPosts].sort((a, b) => {
        // Notice posts first, then by creation date
        if (a.isNotice && !b.isNotice) return -1;
        if (!a.isNotice && b.isNotice) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      return c.json(sortedPosts);
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return c.json({ error: 'Failed to fetch community posts' }, 500);
    }
  });

  app.post("/make-server-a2a27f6d/community", async (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      if (!accessToken) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const { title, content, category } = await c.req.json();

      let userId: string, author: string;
      if (accessToken === 'admin_token') {
        userId = 'admin';
        author = '관리자';
      } else {
        const { data: { user } } = await supabase.auth.getUser(accessToken);
        if (!user) {
          return c.json({ error: 'Unauthorized' }, 401);
        }
        userId = user.id;
        const userProfile = dataStore.users.get(userId);
        author = userProfile?.name ?? user.email ?? "알수없음"; // 항상 string이 되도록!
      }

      dataStore.counters.lastCommunityPostId++;
      const post = {
        id: dataStore.counters.lastCommunityPostId,
        title,
        content,
        author,
        authorId: userId,
        category: category || '일반',
        likes: 0,
        replies: 0,
        createdAt: new Date().toISOString(),
        isNotice: userId === 'admin' && category === '공지'
      };

      dataStore.communityPosts.push(post);
      return c.json(post);
    } catch (error) {
      console.error('Error creating community post:', error);
      return c.json({ error: 'Failed to create community post' }, 500);
    }
  });

  // Cart endpoints
  app.get("/make-server-a2a27f6d/cart/:userId", (c) => {
    try {
      const userId = c.req.param('userId');
      const cartItems = dataStore.cart.get(userId) || [];

      // Get full product details for cart items
      const itemsWithDetails = cartItems.map(item => {
        const product = dataStore.products.find(p => p.id === item.productId);
        return product ? { ...item, product } : null;
      }).filter(Boolean);

      return c.json(itemsWithDetails);
    } catch (error) {
      console.error('Error fetching cart:', error);
      return c.json({ error: 'Failed to fetch cart' }, 500);
    }
  });

  app.post("/make-server-a2a27f6d/cart", async (c) => {
    try {
      const { userId, productId, quantity } = await c.req.json();
      const cartItems: { productId: number; quantity: number; addedAt: string }[] = dataStore.cart.get(userId) || [];
      const existingItem = cartItems.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartItems.push({
          productId,
          quantity,
          addedAt: new Date().toISOString()
        });
      }
      dataStore.cart.set(userId, cartItems);
      return c.json({ message: 'Item added to cart' });
    } catch (error) {
      const err = error as Error;
      console.error('Error adding to cart:', err);
      return c.json({ error: err.message }, 500);
    }
  });

  app.delete("/make-server-a2a27f6d/cart/:userId/:productId", (c) => {
    try {
      const userId = c.req.param('userId');
      const productId = parseInt(c.req.param('productId'));
      const cartItems: { productId: number; quantity: number; addedAt: string }[] = dataStore.cart.get(userId) || [];
      const updatedItems = cartItems.filter(item => item.productId !== productId);
      dataStore.cart.set(userId, updatedItems);
      return c.json({ message: 'Item removed from cart' });
    } catch (error) {
      const err = error as Error;
      console.error('Error removing from cart:', err);
      return c.json({ error: err.message }, 500);
    }
  });

  // Orders endpoints
  app.post("/make-server-a2a27f6d/orders", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { items, totalAmount, paymentMethod, shippingAddress } = await c.req.json();

    let userId;
    if (accessToken === 'admin_token') {
      userId = 'admin';
    } else {
      const { data: { user } } = await supabase.auth.getUser(accessToken);
      if (!user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
      userId = user.id;
    }

      dataStore.counters.lastOrderId++;
      const order = {
        id: dataStore.counters.lastOrderId,
        userId,
        items,
        totalAmount,
        status: 'pending',
        paymentMethod,
        shippingAddress,
        createdAt: new Date().toISOString()
      };

      dataStore.orders.push(order);

      // Clear cart
      dataStore.cart.set(userId, []);

      // Update user's total purchase
      if (userId !== 'admin') {
        const userProfile = dataStore.users.get(userId);
        if (userProfile) {
          userProfile.totalPurchase += totalAmount;
          // Update user grade based on total purchase
          if (userProfile.totalPurchase >= 2000000) {
            userProfile.grade = 'VIP';
          } else if (userProfile.totalPurchase >= 500000) {
            userProfile.grade = 'GOLD';
          } else if (userProfile.totalPurchase >= 100000) {
            userProfile.grade = 'SILVER';
          }
          dataStore.users.set(userId, userProfile);
        }
      }

      return c.json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      return c.json({ error: 'Failed to create order' }, 500);
    }
  });

  app.get("/make-server-a2a27f6d/cart/:userId", (c) => {
    try {
      const userId = c.req.param('userId');
      const cartItems: { productId: number; quantity: number; addedAt: string }[] = dataStore.cart.get(userId) || [];
      const itemsWithDetails = cartItems.map((item) => {
        const product = dataStore.products.find(p => p.id === item.productId);
        return product ? { ...item, product } : null;
      }).filter(Boolean);
      return c.json(itemsWithDetails);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching cart:', err);
      return c.json({ error: err.message }, 500);
    }
  });

  // Events endpoints
  app.get("/make-server-a2a27f6d/events", (c) => {
    try {
      const activeEvents = dataStore.events.filter(event => event.isActive);
      return c.json(activeEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      return c.json({ error: 'Failed to fetch events' }, 500);
    }
  });

  // User profile endpoints
  app.get("/make-server-a2a27f6d/user/:id", (c) => {
    try {
      const id = c.req.param('id');
      const user = dataStore.users.get(id);

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      // Get user's point history
      const userPoints = dataStore.pointHistory.filter(point => point.userId === id);

      return c.json({
        ...user,
        pointHistory: userPoints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return c.json({ error: 'Failed to fetch user' }, 500);
    }
  });

  // Admin endpoints
  app.get("/make-server-a2a27f6d/admin/stats", (c) => {
    try {
      const accessToken = c.req.header('Authorization')?.split(' ')[1];
      if (accessToken !== 'admin_token') {
        return c.json({ error: 'Admin access required' }, 403);
      }

      const totalRevenue = dataStore.orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const recentOrders = dataStore.orders
        .filter(order => new Date(order.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .length;

      return c.json({
        totalProducts: dataStore.products.length,
        totalOrders: dataStore.orders.length,
        totalRevenue,
        totalReviews: dataStore.reviews.length,
        totalCommunityPosts: dataStore.communityPosts.length,
        recentOrders,
        averageRating: dataStore.reviews.length > 0
          ? dataStore.reviews.reduce((sum, r) => sum + r.rating, 0) / dataStore.reviews.length
          : 0
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      return c.json({ error: 'Failed to fetch admin stats' }, 500);
    }
  });

//Deno.serve(app.fetch);