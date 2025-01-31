import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';
import { MenuData } from './Menu';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface UserMenuAccessColumns {
  id: ColumnDefinition;
  role_id: ColumnDefinition;
  menu_id: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface UserMenuAccessData {
  id?: number;
  role_id?: number;
  menu_id?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const UserMenuAccess = {
  tableName: 'user_menu_access',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    role_id: { type: 'INTEGER' },
    menu_id: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as UserMenuAccessColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${UserMenuAccess.tableName} (
        ${Object.entries(UserMenuAccess.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('UserMenuAccess table created');
    } catch (error) {
      console.error('Error creating user_menu_access table:', error);
      throw error;
    }
  },

  insert: async (userMenuAccessData: UserMenuAccessData) => {
    const keys = Object.keys(userMenuAccessData);
    const values = Object.values(userMenuAccessData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${UserMenuAccess.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<UserMenuAccessData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UserMenuAccess.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByRoleId: async (roleId: number): Promise<UserMenuAccessData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UserMenuAccess.tableName} 
       WHERE role_id = ? 
       AND is_active = true`
    );

    try {
      const result = await statement.executeAsync([roleId]);
      return await result.getAllAsync() as UserMenuAccessData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getMenusByRoleId: async (roleId: number): Promise<MenuData[]> => {
    const statement = await db.prepareAsync(
      `SELECT m.* FROM menu m
       INNER JOIN ${UserMenuAccess.tableName} uma ON uma.menu_id = m.id
       WHERE uma.role_id = ? 
       AND uma.is_active = true 
       AND m.is_active = true
       ORDER BY m.order_number ASC`
    );

    try {
      const result = await statement.executeAsync([roleId]);
      return await result.getAllAsync() as MenuData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<UserMenuAccessData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${UserMenuAccess.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${UserMenuAccess.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 