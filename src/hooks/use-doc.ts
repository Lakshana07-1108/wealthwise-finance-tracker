
'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useDoc<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (path && !path.includes('undefined')) {
      setLoading(true);
      const docRef = doc(db, path);
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      }, (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
        setData(null);
        setLoading(false);
    }
  }, [path]);

  return { data, loading, error };
}
