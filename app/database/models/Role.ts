import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface RoleColumns {
  id: ColumnDefinition;
  role_name: ColumnDefinition;
  description: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

interface RoleData {
  id?: number;
  role_name?: string;
  description?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Role = {
  tableName: 'roles',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    role_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as RoleColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Role.tableName} (
        ${Object.entries(Role.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')}
      );
    `;
    await db.execAsync(query);
  },

  insert: async (roleData: RoleData) => {
    const keys = Object.keys(roleData);
    const values = Object.values(roleData);
    const placeholders = values.map(() => '?').join(',');

    const query = `
      INSERT INTO ${Role.tableName} (${keys.join(',')})
      VALUES (${placeholders});
    `;
    await db.runAsync(query, values);
  },

  getById: async (id: number): Promise<RoleData | null> => {
    const query = `SELECT * FROM ${Role.tableName} WHERE id = ?;`;
    const result = await db.getAllAsync(query, [id]);
    return result[0] || null;
  }
} as const; 