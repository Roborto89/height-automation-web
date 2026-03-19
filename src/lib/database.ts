import { supabase } from './supabase';
import { mockDb, User, TimeEntry, BlogPost, MediaItem, NewsletterSubscriber } from './mockDb';

// This utility ensures a seamless transition from Prototype (mockDb) to Production (Supabase).
// If NEXT_PUBLIC_SUPABASE_URL is not set, it falls back to LocalStorage automatically.

const isSupabaseConfigured = !!supabase;

export const db = {
  // Users
  async getUsers(): Promise<User[]> {
    if (!supabase) return mockDb.getUsers();
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) {
      console.error('Supabase Error:', error);
      return mockDb.getUsers();
    }
    return data as User[];
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!supabase) return mockDb.getUserByEmail(email);
    const { data, error } = await supabase.from('profiles').select('*').eq('email', email).single();
    if (error) return mockDb.getUserByEmail(email);
    return data as User;
  },

  async authenticate(email: string, password?: string): Promise<{ success: boolean; user?: User; message?: string }> {
    if (supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      const user = await this.getUserByEmail(email);
      if (!user) return { success: false, message: 'Profile not found.' };
      if (!user.active) return { success: false, message: 'Account deactivated.' };

      return { success: true, user };
    }

    // Fallback for local prototyping
    const user = await this.getUserByEmail(email);
    if (!user) return { success: false, message: 'Invalid credentials. Access denied.' };
    
    if (user.active) {
       if (email === 'admin@heightauto.com' && password !== 'AdminPassword123!') {
         return { success: false, message: 'Invalid Administrative credentials.' };
       }
       return { success: true, user };
    }
    return { success: false, message: 'Authentication failure.' };
  },

  // Time Entries
  async getTimeEntries(userId: string): Promise<TimeEntry[]> {
    if (!supabase) return mockDb.getTimeEntries(userId);
    const { data, error } = await supabase.from('time_entries').select('*').eq('user_id', userId);
    return (data?.map(e => ({
      id: e.id,
      userId: e.user_id,
      clockInAt: e.clock_in_at,
      clockOutAt: e.clock_out_at,
      notes: e.notes
    })) as TimeEntry[]) || [];
  },

  async getActiveEntry(userId: string): Promise<TimeEntry | undefined> {
     const entries = await this.getTimeEntries(userId);
     return entries.find(e => !e.clockOutAt);
  },

  async clockIn(userId: string, notes?: string) {
    if (!supabase) return mockDb.clockIn(userId, notes);
    const { data, error } = await supabase.from('time_entries').insert([{ user_id: userId, notes }]).select().single();
    return data;
  },

  async clockOut(userId: string) {
    if (!supabase) return mockDb.clockOut(userId);
    const { data, error } = await supabase.from('time_entries')
      .update({ clock_out_at: new Date().toISOString() })
      .eq('user_id', userId)
      .is('clock_out_at', null)
      .select().single();
    
    if (data) return {
      id: data.id,
      userId: data.user_id,
      clockInAt: data.clock_in_at,
      clockOutAt: data.clock_out_at,
      notes: data.notes
    };
    return data;
  },

  // Blog
  async getBlogPosts(): Promise<BlogPost[]> {
    if (!supabase) return mockDb.getBlogPosts();
    const { data, error } = await supabase.from('blog_posts').select('*, profiles(name)').order('published_at', { ascending: false });
    return (data?.map(p => ({
      id: p.id,
      title: p.title,
      content: p.content,
      category: p.category,
      publishedAt: p.published_at,
      author: (p.profiles as any)?.name || 'Admin'
    })) as BlogPost[]) || [];
  },

  async addBlogPost(post: Omit<BlogPost, 'id' | 'publishedAt'>) {
    if (!supabase) return mockDb.addBlogPost(post as any);
    const { data, error } = await supabase.from('blog_posts').insert([{
       title: post.title,
       content: post.content,
       category: post.category,
       author_id: (post as any).authorId 
    }]).select().single();
    return data;
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    if (!supabase) return mockDb.getMedia();
    const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
    return (data as MediaItem[]) || [];
  },

  async addMedia(item: Omit<MediaItem, 'id'>) {
    if (!supabase) return mockDb.addMedia(item);
    const { data, error } = await supabase.from('media_assets').insert([item]).select().single();
    return data;
  },

  async deleteMedia(id: string) {
    if (!supabase) return mockDb.deleteMedia(id);
    await supabase.from('media_assets').delete().eq('id', id);
  },

  // Media Storage Upload via Secure Backend API
  async uploadMedia(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.error) throw new Error(result.error);
    
    return result.url;
  },

  // Newsletter
  async subscribe(email: string) {
    if (!supabase) return mockDb.subscribe(email);
    await supabase.from('subscribers').insert([{ email }]);
    return true;
  },

  async getSubscribers(): Promise<NewsletterSubscriber[]> {
    if (!supabase) return mockDb.getSubscribers();
    const { data, error } = await supabase.from('subscribers').select('*');
    return (data as NewsletterSubscriber[]) || [];
  }
};
