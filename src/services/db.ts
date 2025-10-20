/**
 * Firestore Database Service
 * 
 * Serviço para operações CRUD no Firestore usando Firebase nativo.
 * Estrutura: users/{uid}/clientes/{docId}
 * 
 * Regras de segurança (comentar no Firebase Console):
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     match /users/{uid}/clientes/{docId} {
 *       allow read, write: if request.auth != null && request.auth.uid == uid;
 *     }
 *   }
 * }
 */

import { firestore } from './firebase';
import { Cliente, ClienteFormData } from '../types';

/**
 * Listener em tempo real para clientes do usuário
 */
export const listenClientes = (
  uid: string,
  callback: (clientes: Cliente[]) => void
): (() => void) => {
  return firestore()
    .collection('users')
    .doc(uid)
    .collection('clientes')
    .orderBy('createdAt', 'desc')
    .onSnapshot(
      (snapshot) => {
        const clientes: Cliente[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          clientes.push({
            id: doc.id,
            nome: data.nome,
            perfilRisco: data.perfilRisco,
            liquidez: data.liquidez,
            objetivos: data.objetivos,
            createdAt: data.createdAt,
          });
        });

        callback(clientes);
      },
      (error) => {
        console.error('Erro ao escutar clientes:', error);
        throw new Error('Erro ao carregar clientes. Verifique sua conexão.');
      }
    );
};

/**
 * Criar novo cliente
 */
export const createCliente = async (
  uid: string,
  data: ClienteFormData
): Promise<void> => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('clientes')
      .add({
        ...data,
        createdAt: new Date(),
      });
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    throw new Error('Erro ao criar cliente. Tente novamente.');
  }
};

/**
 * Atualizar cliente existente
 */
export const updateCliente = async (
  uid: string,
  clienteId: string,
  data: ClienteFormData
): Promise<void> => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('clientes')
      .doc(clienteId)
      .update(data);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    throw new Error('Erro ao atualizar cliente. Tente novamente.');
  }
};

/**
 * Excluir cliente
 */
export const deleteCliente = async (
  uid: string,
  clienteId: string
): Promise<void> => {
  try {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('clientes')
      .doc(clienteId)
      .delete();
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    throw new Error('Erro ao excluir cliente. Tente novamente.');
  }
};

/**
 * Obter cliente específico
 */
export const getCliente = async (
  uid: string,
  clienteId: string
): Promise<Cliente | null> => {
  try {
    const doc = await firestore()
      .collection('users')
      .doc(uid)
      .collection('clientes')
      .doc(clienteId)
      .get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      id: doc.id,
      nome: data.nome,
      perfilRisco: data.perfilRisco,
      liquidez: data.liquidez,
      objetivos: data.objetivos,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error('Erro ao obter cliente:', error);
    throw new Error('Erro ao carregar cliente. Tente novamente.');
  }
};
