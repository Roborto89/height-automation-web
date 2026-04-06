import { supabase } from './supabase';
import { mockDb, User, TimeEntry, BlogPost, MediaItem, NewsletterSubscriber, CalendarEvent } from './mockDb';

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
    return data.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      active: u.active,
      mustChangePassword: u.must_change_password ?? true,
      title: u.title,
      bio: u.bio,
      avatarUrl: u.avatar_url
    })) as User[];
  },

  async updateUser(id: string, updates: Partial<User>) {
    if (!supabase) return mockDb.updateUser(id, updates);
    
    const { error } = await supabase.from('profiles').update({
       title: updates.title,
       bio: updates.bio,
       avatar_url: updates.avatarUrl,
       name: updates.name,
       role: updates.role,
       active: updates.active
    }).eq('id', id);
    
    if (error) throw error;
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const cleanEmail = email.toLowerCase();
    if (!supabase) return mockDb.getUserByEmail(cleanEmail);
    const { data, error } = await supabase.from('profiles').select('*').eq('email', cleanEmail).single();
    if (error) return mockDb.getUserByEmail(email);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      active: data.active,
      mustChangePassword: data.must_change_password ?? true,
      title: data.title,
      bio: data.bio,
      avatarUrl: data.avatar_url
    } as User;
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
       const isValid = mockDb.validatePassword(email, password);
       if (!isValid) {
         return { success: false, message: 'Correct authorization required.' };
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
      author: (p.profiles as any)?.name || 'Admin',
      readTime: p.read_time || '5 MIN',
      complexity: p.complexity || 'INTERMEDIATE'
    })) as BlogPost[]) || [];
  },

  async getBlogPostById(id: string): Promise<BlogPost | undefined> {
    if (!supabase) return mockDb.getBlogPosts().find(p => p.id === id);
    const { data, error } = await supabase.from('blog_posts').select('*, profiles(name)').eq('id', id).single();
    if (error || !data) return undefined;
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      category: data.category,
      publishedAt: data.published_at,
      author: (data.profiles as any)?.name || 'Admin',
      readTime: data.read_time || '5 MIN',
      complexity: data.complexity || 'INTERMEDIATE'
    } as BlogPost;
  },

  async addBlogPost(post: Omit<BlogPost, 'id' | 'publishedAt'>) {
    if (!supabase) return mockDb.addBlogPost(post as any);
    const { data, error } = await supabase.from('blog_posts').insert([{
       title: post.title,
       content: post.content,
       category: post.category,
       author_id: (post as any).authorId,
       read_time: post.readTime,
       complexity: post.complexity
    }]).select().single();
    return data;
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    if (!supabase) return mockDb.getMedia();
    const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
    return (data as MediaItem[]) || [];
  },

  async addMedia(item: Omit<MediaItem, 'id'>, file?: File) {
    if (!supabase) return mockDb.addMedia(item);

    const formData = new FormData();
    formData.append('title', item.title);
    formData.append('category', item.category);
    formData.append('type', item.type);
    if (item.url) formData.append('url', item.url);
    if (file) formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Action failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.part;
  },

  async deleteMedia(id: string) {
    if (!supabase) return mockDb.deleteMedia(id);
    await supabase.from('media_assets').delete().eq('id', id);
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
  },

  async updatePassword(userId: string, email: string, password: string) {
    if (!supabase) {
       // Mock Mode Persistence
       mockDb.updateUser(userId, { mustChangePassword: false });
       mockDb.updatePassword(email, password);
       return { success: true };
    }
    
    const { error } = await supabase.auth.updateUser({
       password: password
    });
    
    if (error) throw error;

    // Update must_change_password to false in profiles
    await supabase.from('profiles').update({ must_change_password: false }).eq('id', userId);
    
    return { success: true };
  },

  async resetUserPassword(targetUserId: string, newPassword: string) {
    if (!supabase) {
       // Mock Mode Reset
       mockDb.updateUser(targetUserId, { mustChangePassword: true });
       return { success: true };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Authentication required for administrative tasks.');

    const response = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ targetUserId, newPassword })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Administrative action failed');

    return result;
  },

  // Project Calendar
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    if (!supabase) return mockDb.getCalendarEvents();
    const { data, error } = await supabase.from('calendar_events').select('*').order('start_date', { ascending: true });
    return (data?.map(e => ({
      id: e.id,
      title: e.title,
      description: e.description,
      startDate: e.start_date,
      endDate: e.end_date,
      type: e.type,
      assignedTo: e.assigned_to,
      createdBy: e.created_by,
      createdAt: e.created_at
    })) as CalendarEvent[]) || [];
  },

  async addCalendarEvent(event: Omit<CalendarEvent, 'id' | 'createdAt'>) {
    if (!supabase) return mockDb.addCalendarEvent(event);
    const { data, error } = await supabase.from('calendar_events').insert([{
      title: event.title,
      description: event.description,
      start_date: event.startDate,
      end_date: event.endDate,
      type: event.type,
      assigned_to: event.assignedTo,
      created_by: event.createdBy
    }]).select().single();
    if (error) throw error;
    return data;
  },

  async deleteCalendarEvent(id: string) {
    if (!supabase) return mockDb.deleteCalendarEvent(id);
    const { error } = await supabase.from('calendar_events').delete().eq('id', id);
    if (error) throw error;
  }
};
