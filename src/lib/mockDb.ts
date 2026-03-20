export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  active: boolean;
}

export interface TimeEntry {
  id: string;
  userId: string;
  clockInAt: string;
  clockOutAt?: string;
  notes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
  author: string;
  readTime: string;
  complexity: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'ELITE';
}

export interface NewsletterSubscriber {
  email: string;
  joinedAt: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  url: string; // File path or YouTube URL
  thumbnail?: string;
  category: 'ROBOTICS' | 'VISION' | 'SAFETY';
}

const STORAGE_KEY = 'height_internal_db';

const initialUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@heightauto.com', role: 'ADMIN', active: true },
  { id: '2', name: 'John Doe', email: 'j.doe@heightauto.com', role: 'EMPLOYEE', active: true }
];

const initialBlog: BlogPost[] = [
  { 
    id: '1', 
    title: 'The Shift Toward Cobot Integration', 
    content: 'As manufacturing landscapes evolve, the transition from traditional industrial robotics to Collaborative Robots (Cobots) is accelerating. This shift is driven by the need for flexible, safe, and easily deployable automation solutions that can work alongside human technicians without the need for extensive safety caging.', 
    category: 'ROBOTICS', 
    publishedAt: '2026-03-15T12:00:00Z', 
    author: 'Chief Engineer',
    readTime: '6 MIN',
    complexity: 'INTERMEDIATE'
  },
  {
    id: '2',
    title: 'Sub-Micron Vision Inspection Protocols',
    content: 'Achieving sub-micron accuracy in high-speed inspection requires more than just high-resolution sensors. It demands optimized lighting geometry, ultra-low-latency processing pipelines, and sophisticated calibration algorithms that account for thermal expansion of the mechanical fixtures.',
    category: 'VISION',
    publishedAt: '2026-03-18T09:30:00Z',
    author: 'Vision Lead',
    readTime: '12 MIN',
    complexity: 'ELITE'
  },
  {
    id: '3',
    title: 'Safety PLC vs Standard Logic',
    content: 'The fundamental difference between standard and safety-rated control systems lies in the hardware redundancy and self-diagnostic capabilities. In this breakdown, we explore why a Category 4 safety rating requires dual-channel logic and how to properly implement emergency stop circuits.',
    category: 'SAFETY',
    publishedAt: '2026-03-19T14:15:00Z',
    author: 'Safety Dir',
    readTime: '8 MIN',
    complexity: 'ADVANCED'
  }
];

const initialMedia: MediaItem[] = [
  { id: '1', type: 'image', title: 'Automotive Inspection Cell', url: '/images/robotic_cell_inspection.png', category: 'ROBOTICS' },
  { id: '2', type: 'image', title: 'Precision PCB Assembly', url: '/images/vision_system_precision.png', category: 'VISION' }
];

export const mockDb = {
  getData() {
    if (typeof window === 'undefined') return { users: [], entries: [], blog: [], subscribers: [], media: [] };
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const initial = { 
        users: initialUsers, 
        entries: [], 
        blog: initialBlog, 
        subscribers: [], 
        media: initialMedia 
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  saveData(data: any) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  getUsers(): User[] {
    return this.getData().users;
  },

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  },

  getTimeEntries(userId: string): TimeEntry[] {
    return this.getData().entries.filter((e: TimeEntry) => e.userId === userId);
  },

  getActiveEntry(userId: string): TimeEntry | undefined {
    return this.getTimeEntries(userId).find(e => !e.clockOutAt);
  },

  clockIn(userId: string, notes?: string) {
    const data = this.getData();
    const entry: TimeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      clockInAt: new Date().toISOString(),
      notes
    };
    data.entries.push(entry);
    this.saveData(data);
    return entry;
  },

  clockOut(userId: string) {
    const data = this.getData();
    const entry = data.entries.find((e: TimeEntry) => e.userId === userId && !e.clockOutAt);
    if (entry) {
      entry.clockOutAt = new Date().toISOString();
      this.saveData(data);
    }
    return entry;
  },

  // News & Content
  getBlogPosts(): BlogPost[] {
    return this.getData().blog || [];
  },

  addBlogPost(post: Omit<BlogPost, 'id' | 'publishedAt'>) {
    const data = this.getData();
    const newPost: BlogPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      publishedAt: new Date().toISOString()
    };
    data.blog = data.blog || [];
    data.blog.push(newPost);
    this.saveData(data);
    return newPost;
  },

  subscribe(email: string) {
    const data = this.getData();
    data.subscribers = data.subscribers || [];
    if (!data.subscribers.find((s: NewsletterSubscriber) => s.email === email)) {
      data.subscribers.push({ email, joinedAt: new Date().toISOString() });
      this.saveData(data);
    }
    return true;
  },

  getSubscribers(): NewsletterSubscriber[] {
    return this.getData().subscribers || [];
  },

  // Media Management
  getMedia(): MediaItem[] {
    return this.getData().media || [];
  },

  addMedia(item: Omit<MediaItem, 'id'>) {
    const data = this.getData();
    const newItem: MediaItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9)
    };
    data.media = data.media || [];
    data.media.push(newItem);
    this.saveData(data);
    return newItem;
  },

  deleteMedia(id: string) {
    const data = this.getData();
    data.media = (data.media || []).filter((m: MediaItem) => m.id !== id);
    this.saveData(data);
  }
};
