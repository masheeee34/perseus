import { Product, User, FullUser } from './types';

class PerseusAPI {
  private static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('perseus_token');
  }

  private static async request<T>(method: string, path: string, body?: any): Promise<T> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Erreur serveur' }));
      throw new Error(data.error || `Erreur ${res.status}`);
    }
    return res.json();
  }

  static async get<T>(path: string) { return this.request<T>('GET', path); }
  static async post<T>(path: string, body?: any) { return this.request<T>('POST', path, body); }
  static async put<T>(path: string, body?: any) { return this.request<T>('PUT', path, body); }
  static async del<T>(path: string) { return this.request<T>('DELETE', path); }

  // ─── AUTH ───
  static async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const data = await this.post<{ token: string; user: User }>('/auth/login', { email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_token', data.token);
      localStorage.setItem('perseus_user', JSON.stringify(data.user));
    }
    return data;
  }

  static async register(email: string, password: string, name: string): Promise<{ token: string; user: User }> {
    const data = await this.post<{ token: string; user: User }>('/auth/register', { email, password, name });
    if (typeof window !== 'undefined') {
      localStorage.setItem('perseus_token', data.token);
      localStorage.setItem('perseus_user', JSON.stringify(data.user));
    }
    return data;
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('perseus_token');
      localStorage.removeItem('perseus_user');
    }
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const u = localStorage.getItem('perseus_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  static isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('perseus_token');
  }

  // ─── PRODUCTS ───
  /**
   * RAM-BOOST : On utilise le bridge externe (Hugging Face - 16Go RAM) 
   * pour servir le catalogue instantanément au lieu de solliciter la DB Turso via Render.
   */
  private static _catalogCache: { data: Product[]; time: number } | null = null;

  static async getProducts(params: Record<string, string> = {}): Promise<Product[]> {
    const qs = new URLSearchParams(params).toString();
    if (!qs && this._catalogCache && (Date.now() - this._catalogCache.time < 60000)) {
      return this._catalogCache.data;
    }
    const data = await this.get<Product[]>('/products' + (qs ? '?' + qs : ''));
    if (!qs && Array.isArray(data)) {
      this._catalogCache = { data, time: Date.now() };
    }
    return data;
  }

  static async getProduct(id: string): Promise<Product> {
    if (this._catalogCache && Array.isArray(this._catalogCache.data)) {
      const found = this._catalogCache.data.find(p => p.id === id);
      if (found) return found;
    }
    return this.get<Product>(`/products/${id}`);
  }

  static async search(q: string): Promise<Product[]> {
    return this.get<Product[]>(`/products?q=${encodeURIComponent(q)}`);
  }

  // ─── PROFILE ───
  static async getProfile(): Promise<FullUser> {
    return this.get<FullUser>('/users/profile');
  }

  static async getRecommendations(): Promise<Product[]> {
    try {
      // Pour le boost, on extrait les catégories déjà possédées du localStorage
      const user = this.getUser();
      // On fetch le bridge avec ce contexte pour des recs éclairs
      const res = await fetch(`/bridge/recommendations`);
      if (res.ok) return res.json();
    } catch {}
    return this.get<Product[]>('/users/recommendations');
  }

  static async updateProfile(updates: Partial<User & { password?: string }>): Promise<{ success: boolean; user: User }> {
    return this.put<{ success: boolean; user: User }>('/users/profile', updates);
  }

  // ─── ORDERS ───
  static async checkout(
    address: string,
    items: any[],
    total: number,
    coupon?: string,
    payment_method: string = 'bank_transfer'
  ): Promise<{ orderId: string; points_earned: number }> {
    return this.post<{ orderId: string; points_earned: number }>('/orders/checkout', {
      address,
      items,
      total,
      coupon,
      payment_method,
    });
  }

  // ─── WISHLIST ───
  static async getWishlist(): Promise<Product[]> {
    return this.get<Product[]>('/loyalty/wishlist');
  }

  static async toggleFavorite(productId: string): Promise<{ action: 'added' | 'removed' }> {
    return this.post<{ action: 'added' | 'removed' }>('/loyalty/wishlist', { productId });
  }

  static async syncWishlist(productIds: string[]): Promise<{ success: boolean; wishlist: Product[] }> {
    return this.put<{ success: boolean; wishlist: Product[] }>('/loyalty/wishlist', { productIds });
  }
}

export default PerseusAPI;
