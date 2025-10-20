export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

class AuthMockService {
  private users: Map<string, User> = new Map();
  private currentUser: User | null = null;

  async signUp(data: RegisterData): Promise<AuthResponse> {
    const { name, email, password } = data;

    // Check if user already exists
    if (this.users.has(email)) {
      return {
        success: false,
        error: 'Email já cadastrado.',
      };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
    };

    // Store user
    this.users.set(email, newUser);

    return {
      success: true,
      user: newUser,
    };
  }

  async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Find user by email
    const user = this.users.get(email);

    if (!user) {
      return {
        success: false,
        error: 'Credenciais inválidas.',
      };
    }

    // Check password
    if (user.password !== password) {
      return {
        success: false,
        error: 'Credenciais inválidas.',
      };
    }

    // Set current user
    this.currentUser = user;

    return {
      success: true,
      user,
    };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const authMock = new AuthMockService();
