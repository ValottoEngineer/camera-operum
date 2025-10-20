/**
 * Firebase Web Fallback para Desenvolvimento
 * 
 * Este arquivo fornece mocks para desenvolvimento web quando
 * o Firebase nativo não está disponível.
 */

// Mock para desenvolvimento web
export const auth = {
  signInWithEmailAndPassword: async (email: string, password: string) => {
    console.log('🔐 Mock Auth - SignIn:', { email });
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      user: { 
        uid: 'mock-uid-' + Date.now(), 
        email,
        displayName: email.split('@')[0]
      } 
    };
  },
  
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    console.log('📝 Mock Auth - SignUp:', { email });
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { 
      user: { 
        uid: 'mock-uid-' + Date.now(), 
        email,
        displayName: email.split('@')[0]
      } 
    };
  },
  
  sendPasswordResetEmail: async (email: string) => {
    console.log('📧 Mock Auth - Reset Password:', { email });
    await new Promise(resolve => setTimeout(resolve, 500));
  },
  
  signOut: async () => {
    console.log('🚪 Mock Auth - SignOut');
    await new Promise(resolve => setTimeout(resolve, 300));
  },
  
  onAuthStateChanged: (callback: (user: any) => void) => {
    console.log('👤 Mock Auth - State Listener iniciado');
    
    // Simular usuário logado após 1 segundo
    setTimeout(() => {
      const mockUser = { 
        uid: 'mock-uid-dev', 
        email: 'dev@operum.com',
        displayName: 'Desenvolvedor'
      };
      callback(mockUser);
    }, 1000);
    
    return () => console.log('👤 Mock Auth - State Listener removido');
  },
  
  currentUser: null
};

export const firestore = {
  collection: (path: string) => ({
    doc: (id: string) => ({
      collection: (subPath: string) => ({
        add: async (data: any) => {
          console.log('➕ Mock Firestore - Create:', { path, subPath, data });
          await new Promise(resolve => setTimeout(resolve, 500));
          return { id: 'mock-doc-' + Date.now() };
        },
        
        onSnapshot: (callback: (snapshot: any) => void) => {
          console.log('👂 Mock Firestore - Listener iniciado:', { path, subPath });
          
          // Simular dados de clientes após 1 segundo
          setTimeout(() => {
            const mockSnapshot = {
              forEach: (fn: any) => {
                const mockClientes = [
                  {
                    id: 'mock-cliente-1',
                    data: () => ({
                      nome: 'João Silva',
                      perfilRisco: 'conservador',
                      liquidez: 'alta',
                      objetivos: 'Aposentadoria segura',
                      createdAt: new Date()
                    })
                  },
                  {
                    id: 'mock-cliente-2',
                    data: () => ({
                      nome: 'Maria Santos',
                      perfilRisco: 'moderado',
                      liquidez: 'média',
                      objetivos: 'Compra de imóvel',
                      createdAt: new Date()
                    })
                  },
                  {
                    id: 'mock-cliente-3',
                    data: () => ({
                      nome: 'Pedro Costa',
                      perfilRisco: 'agressivo',
                      liquidez: 'baixa',
                      objetivos: 'Crescimento acelerado',
                      createdAt: new Date()
                    })
                  }
                ];
                
                mockClientes.forEach(fn);
              }
            };
            
            callback(mockSnapshot);
          }, 1000);
          
          return () => console.log('👂 Mock Firestore - Listener removido');
        }
      })
    })
  }),
  
  FieldValue: {
    serverTimestamp: () => new Date()
  }
};

// Simular inicialização
console.log('🔥 Mock Firebase inicializado para desenvolvimento web');
