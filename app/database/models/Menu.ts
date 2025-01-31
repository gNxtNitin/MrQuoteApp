import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface MenuColumns {
  id: ColumnDefinition;
  parent_id: ColumnDefinition;
  menu_name: ColumnDefinition;
  area: ColumnDefinition;
  controller_name: ColumnDefinition;
  action_name: ColumnDefinition;
  url: ColumnDefinition;
  order_number: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface MenuData {
  id?: number;
  parent_id?: number;
  menu_name?: string;
  area?: string;
  controller_name?: string;
  action_name?: string;
  url?: string;
  order_number?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Menu = {
  tableName: 'menu',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    parent_id: { type: 'INTEGER' },
    menu_name: { type: 'TEXT' },
    area: { type: 'TEXT' },
    controller_name: { type: 'TEXT' },
    action_name: { type: 'TEXT' },
    url: { type: 'TEXT' },
    order_number: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as MenuColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Menu.tableName} (
        ${Object.entries(Menu.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (parent_id) REFERENCES menu(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('Menu table created');
    } catch (error) {
      console.error('Error creating menu table:', error);
      throw error;
    }
  },

  insert: async (menuData: MenuData) => {
    const keys = Object.keys(menuData);
    const values = Object.values(menuData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Menu.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
      // console.log.log('Menu inserted');
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<MenuData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Menu.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getAll: async (): Promise<MenuData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Menu.tableName} 
       WHERE is_active = true 
       ORDER BY order_number ASC`
    );

    try {
      const result = await statement.executeAsync();
      return await result.getAllAsync() as MenuData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByParentId: async (parentId: number | null): Promise<MenuData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Menu.tableName} 
       WHERE parent_id ${parentId === null ? 'IS NULL' : '= ?'}
       AND is_active = true 
       ORDER BY order_number ASC`
    );

    try {
      const result = await statement.executeAsync(parentId !== null ? [parentId] : []);
      return await result.getAllAsync() as MenuData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<MenuData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Menu.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Menu.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 