import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface TemplatesCategoryColumns {
  template_cat_id: ColumnDefinition;
  company_id: ColumnDefinition;
  category_name: ColumnDefinition;
  description: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
}

export interface TemplatesCategoryData {
  template_cat_id?: number;
  company_id?: number;
  category_name?: string;
  description?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
}

export const TemplatesCategory = {
  tableName: 'templates_category',
  columns: {
    template_cat_id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    category_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as TemplatesCategoryColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${TemplatesCategory.tableName} (
        ${Object.entries(TemplatesCategory.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('TemplatesCategory table created');
    } catch (error) {
      console.error('Error creating templates_category table:', error);
      throw error;
    }
  },

  insert: async (templatesCategoryData: TemplatesCategoryData) => {
    const keys = Object.keys(templatesCategoryData);
    const values = Object.values(templatesCategoryData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${TemplatesCategory.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (templateCatId: number): Promise<TemplatesCategoryData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TemplatesCategory.tableName} WHERE template_cat_id = ?`
    );

    try {
      const result = await statement.executeAsync([templateCatId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<TemplatesCategoryData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TemplatesCategory.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as TemplatesCategoryData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (templateCatId: number, data: Partial<TemplatesCategoryData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${TemplatesCategory.tableName} SET ${setClause} WHERE template_cat_id = ?`
    );

    try {
      await statement.executeAsync([...values, templateCatId]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (templateCatId: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${TemplatesCategory.tableName} WHERE template_cat_id = ?`
    );

    try {
      await statement.executeAsync([templateCatId]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 