import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface UserColumns {
  id: ColumnDefinition;
  user_detail_id: ColumnDefinition;
  role_id: ColumnDefinition;
  status: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_date: ColumnDefinition;
}

interface UserData {
  id?: number;
  user_detail_id?: number;
  role_id?: number;
  status?: string;
  created_date?: string;
  modified_date?: string;
}

interface SQLiteResult {
  rows: {
    _array: any[];
    length: number;
    item: (index: number) => any;
  };
}

export const User = {
  tableName: 'users',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    user_detail_id: { type: 'INTEGER' },
    role_id: { type: 'INTEGER' },
    status: { type: "TEXT DEFAULT 'active'" },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as UserColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${User.tableName} (
        ${Object.entries(User.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (user_detail_id) REFERENCES user_details(id),
        FOREIGN KEY (role_id) REFERENCES roles(id)
      );
    `;
    await db.execAsync(query);
    console.log('User table created');
  },

  insert: async (userData: UserData) => {
    const keys = Object.keys(userData);
    const values = Object.values(userData);
    const placeholders = values.map(() => '?').join(',');
    const query = `
      INSERT INTO ${User.tableName} (${keys.join(',')})
      VALUES (${placeholders});
    `;

    await db.runAsync(query, values);
    console.log('User inserted');
  },

  getById: async (id: number): Promise<UserData | null> => {
    const query = `SELECT * FROM ${User.tableName} WHERE id = ?;`;
    const result = await db.getAllAsync(query, [id]);
    return result[0] || null;
  }
} as const;