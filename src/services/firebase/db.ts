import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './index';
import { retryOperation } from '../network/retryFetch';

export interface Client {
  id?: string;
  nome: string;
  cpf: string;
  perfilRisco: 'conservador' | 'moderado' | 'agressivo';
  objetivos: string[];
  liquidezMensal: number;
  createdAt: Date;
  updatedAt: Date;
  ownerUid: string;
}

export interface Wallet {
  id?: string;
  clientId: string;
  nomeCarteira: string;
  ativos: Array<{
    ticker: string;
    percentual: number;
  }>;
  explicacao: string;
  createdAt: Date;
  updatedAt: Date;
  ownerUid: string;
}

// Clientes
export const createClient = async (data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // Verificar se CPF já existe para este usuário
    const cpfExists = await checkCpfExists(data.cpf, data.ownerUid);
    if (cpfExists) {
      throw new Error('CPF já cadastrado para este usuário.');
    }

    const clientData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await retryOperation(() => addDoc(collection(db, 'clients'), clientData));
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Erro ao criar cliente. Tente novamente.');
  }
};

export const getClients = async (
  ownerUid: string,
  limitCount: number = 20,
  lastDoc?: DocumentSnapshot
): Promise<{ clients: Client[]; lastDoc: DocumentSnapshot | null }> => {
  try {
    let q = query(
      collection(db, 'clients'),
      where('ownerUid', '==', ownerUid),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await retryOperation(() => getDocs(q));
    const clients: Client[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      clients.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Client);
    });

    return {
      clients,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  } catch (error: any) {
    throw new Error('Erro ao buscar clientes. Tente novamente.');
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const docRef = doc(db, 'clients', id);
    const docSnap = await retryOperation(() => getDoc(docRef));

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Client;
    }
    return null;
  } catch (error: any) {
    throw new Error('Erro ao buscar cliente. Tente novamente.');
  }
};

export const updateClient = async (id: string, data: Partial<Omit<Client, 'id' | 'createdAt' | 'ownerUid'>>): Promise<void> => {
  try {
    const docRef = doc(db, 'clients', id);
    await retryOperation(() => updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    }));
  } catch (error: any) {
    throw new Error('Erro ao atualizar cliente. Tente novamente.');
  }
};

export const deleteClient = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'clients', id);
    await retryOperation(() => deleteDoc(docRef));
  } catch (error: any) {
    throw new Error('Erro ao excluir cliente. Tente novamente.');
  }
};

export const checkCpfExists = async (cpf: string, ownerUid: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'clients'),
      where('cpf', '==', cpf),
      where('ownerUid', '==', ownerUid)
    );
    const snapshot = await retryOperation(() => getDocs(q));
    return !snapshot.empty;
  } catch (error: any) {
    throw new Error('Erro ao verificar CPF. Tente novamente.');
  }
};

// Carteiras
export const createWallet = async (data: Omit<Wallet, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const walletData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await retryOperation(() => addDoc(collection(db, 'wallets'), walletData));
    return docRef.id;
  } catch (error: any) {
    throw new Error('Erro ao criar carteira. Tente novamente.');
  }
};

export const getWalletsByClient = async (clientId: string): Promise<Wallet[]> => {
  try {
    const q = query(
      collection(db, 'wallets'),
      where('clientId', '==', clientId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await retryOperation(() => getDocs(q));
    const wallets: Wallet[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      wallets.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Wallet);
    });

    return wallets;
  } catch (error: any) {
    throw new Error('Erro ao buscar carteiras. Tente novamente.');
  }
};

export const getWalletById = async (id: string): Promise<Wallet | null> => {
  try {
    const docRef = doc(db, 'wallets', id);
    const docSnap = await retryOperation(() => getDoc(docRef));

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Wallet;
    }
    return null;
  } catch (error: any) {
    throw new Error('Erro ao buscar carteira. Tente novamente.');
  }
};

export const updateWallet = async (id: string, data: Partial<Omit<Wallet, 'id' | 'createdAt' | 'ownerUid'>>): Promise<void> => {
  try {
    const docRef = doc(db, 'wallets', id);
    await retryOperation(() => updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    }));
  } catch (error: any) {
    throw new Error('Erro ao atualizar carteira. Tente novamente.');
  }
};

export const deleteWallet = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'wallets', id);
    await retryOperation(() => deleteDoc(docRef));
  } catch (error: any) {
    throw new Error('Erro ao excluir carteira. Tente novamente.');
  }
};
