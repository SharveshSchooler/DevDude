import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc,
  serverTimestamp,
  Timestamp,
  QueryConstraint
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string|null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- User Profile ---

export async function saveUserProfile(userId: string, profile: any) {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, path), {
      ...profile,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getUserProfile(userId: string) {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, path));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getAllUserProfiles() {
  const path = 'users';
  try {
    const q = query(collection(db, path));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// --- Project Files ---

export async function saveFile(userId: string, fileId: string, fileData: any) {
  const path = `users/${userId}/files/${fileId}`;
  try {
    await setDoc(doc(db, path), {
      ...fileData,
      userId,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToFiles(userId: string, callback: (files: any[]) => void) {
  const path = `users/${userId}/files`;
  const q = query(collection(db, path));
  
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function deleteFile(userId: string, fileId: string) {
  const path = `users/${userId}/files/${fileId}`;
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- Analyses ---

export async function saveAnalysis(userId: string, analysisData: any) {
  const analysisId = `${Date.now()}`;
  const path = `users/${userId}/analyses/${analysisId}`;
  try {
    await setDoc(doc(db, path), {
      ...analysisData,
      userId,
      createdAt: serverTimestamp()
    });
    return analysisId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
