import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface TaxSettingColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  tax_name: ColumnDefinition;
  description: ColumnDefinition;
  tax_rate: ColumnDefinition;
  is_required: ColumnDefinition;
  order_number: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface TaxSettingData {
  id?: number;
  company_id?: number;
  tax_name?: string;
  description?: string;
  tax_rate?: number;
  is_required?: boolean;
  order_number?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const TaxSetting = {
  tableName: 'tax_setting',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    tax_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    tax_rate: { type: 'DECIMAL(10,2)' },
    is_required: { type: 'BOOLEAN' },
    order_number: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as TaxSettingColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${TaxSetting.tableName} (
        ${Object.entries(TaxSetting.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('TaxSetting table created');
    } catch (error) {
      console.error('Error creating tax_setting table:', error);
      throw error;
    }
  },

  insert: async (data: TaxSettingData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${TaxSetting.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<TaxSettingData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TaxSetting.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<TaxSettingData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TaxSetting.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY order_number ASC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as TaxSettingData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<TaxSettingData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${TaxSetting.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${TaxSetting.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 