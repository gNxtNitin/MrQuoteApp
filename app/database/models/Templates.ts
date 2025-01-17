import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface TemplatesColumns {
  id: ColumnDefinition;
  template_cat_id: ColumnDefinition;
  company_id: ColumnDefinition;
  template_type: ColumnDefinition;
  template_name: ColumnDefinition;
  description: ColumnDefinition;
  is_shared: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
}

export interface TemplatesData {
  id?: number;
  template_cat_id?: number;
  company_id?: number;
  template_type?: 'Report' | 'Order' | 'QuickText';
  template_name?: string;
  description?: string;
  is_shared?: boolean;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
}

export const Templates = {
  tableName: 'templates',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    template_cat_id: { type: 'INTEGER' },
    company_id: { type: 'INTEGER' },
    template_type: { type: "TEXT CHECK(template_type IN ('Report', 'Order', 'QuickText'))" },
    template_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    is_shared: { type: 'BOOLEAN' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as TemplatesColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Templates.tableName} (
        ${Object.entries(Templates.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (template_cat_id) REFERENCES templates_category(template_cat_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('Templates table created');
    } catch (error) {
      console.error('Error creating templates table:', error);
      throw error;
    }
  },

  insert: async (templatesData: TemplatesData) => {
    const keys = Object.keys(templatesData);
    const values = Object.values(templatesData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Templates.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<TemplatesData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Templates.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<TemplatesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Templates.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as TemplatesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCategoryId: async (templateCatId: number): Promise<TemplatesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Templates.tableName} 
       WHERE template_cat_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([templateCatId]);
      return await result.getAllAsync() as TemplatesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<TemplatesData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Templates.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Templates.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 