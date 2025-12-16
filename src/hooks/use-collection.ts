
'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, Query, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useCollection<T>(path: string, q?: Query<DocumentData>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path.includes('undefined')) {
        setLoading(true);
        
        const collectionRef = collection(db, path);
        const finalQuery = q || query(collectionRef);

        const unsubscribe = onSnapshot(finalQuery, (snapshot) => {
            const results: T[] = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() } as T);
            });
            setData(results);
            setLoading(false);
        }, (err) => {
            console.error(err);
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    } else {
        setData([]);
        setLoading(false);
    }
  }, [path, q]);

  return { data, loading, error };
}
