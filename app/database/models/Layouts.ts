import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface LayoutsColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  layout_name: ColumnDefinition;
  layout_type: ColumnDefinition;
  description: ColumnDefinition;
  is_shared: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface LayoutsData {
  id?: number;
  company_id?: number;
  layout_name?: string;
  layout_type?: 'Report' | 'Order';
  description?: string;
  is_shared?: boolean;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Layouts = {
  tableName: 'layouts',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    layout_name: { type: 'TEXT' },
    layout_type: { type: "TEXT CHECK(layout_type IN ('Report', 'Order'))" },
    description: { type: 'TEXT' },
    is_shared: { type: 'BOOLEAN' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as LayoutsColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Layouts.tableName} (
        ${Object.entries(Layouts.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('Layouts table created');
    } catch (error) {
      console.error('Error creating layouts table:', error);
      throw error;
    }
  },

  insert: async (layoutsData: LayoutsData) => {
    const keys = Object.keys(layoutsData);
    const values = Object.values(layoutsData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Layouts.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
      console.log('Layouts inserted');
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<LayoutsData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Layouts.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<LayoutsData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Layouts.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as LayoutsData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<LayoutsData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Layouts.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Layouts.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 