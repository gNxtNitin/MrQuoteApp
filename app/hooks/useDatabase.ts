import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { openDatabase, initDatabase, Database } from '../services/database/init';

interface DatabaseHook {
    db: Database | null;
    dbLoading: boolean;
    error: Error | null;
}

export function useDatabase(): DatabaseHook {
    const [db, setDb] = useState<Database | null>(null);
    const [dbLoading, setDbLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function initDB() {
            try {
                const database = await initDatabase();
                setDb(database);
            } catch (err) {
                const error = err instanceof Error ? err : new Error('Failed to initialize database');
                console.error('Database initialization error:', error);
                setError(error);
            } finally {
                setDbLoading(false);
            }
        }

        initDB();
    }, []);

    return { db, dbLoading, error };
}
