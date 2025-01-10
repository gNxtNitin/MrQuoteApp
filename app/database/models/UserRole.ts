import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface UserRoleColumns {
  id: ColumnDefinition;
  role_id: ColumnDefinition;
  user_id: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface UserRoleData {
  id?: number;
  role_id?: number;
  user_id?: number;
  created_date?: string;
  modified_date?: string;
}

export const UserRole = {
  tableName: 'user_roles',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    role_id: { type: 'INTEGER' },
    user_id: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as UserRoleColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${UserRole.tableName} (
        ${Object.entries(UserRole.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('UserRole table created');
    } catch (error) {
      console.error('Error creating user_roles table:', error);
      throw error;
    }
  },

  insert: async (userRoleData: UserRoleData) => {
    const keys = Object.keys(userRoleData);
    const values = Object.values(userRoleData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${UserRole.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<UserRoleData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UserRole.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByUserId: async (userId: number): Promise<UserRoleData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UserRole.tableName} WHERE user_id = ?`
    );

    try {
      const result = await statement.executeAsync([userId]);
      return await result.getAllAsync() as UserRoleData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<UserRoleData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${UserRole.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${UserRole.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 