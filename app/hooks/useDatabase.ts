import { useEffect, useState } from 'react';
import { openDatabase, initDatabase } from '../services/database/init';
import * as SQLite from 'expo-sqlite';

export const useDatabase = () => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await initDatabase() as SQLite.SQLiteDatabase;
        setDb(database);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      } finally {
        setDbLoading(false);
      }
    };

    initDB();
  }, []);

  return { db, dbLoading, error };
};
