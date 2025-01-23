import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface CustomEmailInvoiceQuickTextColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  template_id: ColumnDefinition;
  content: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface CustomEmailInvoiceQuickTextData {
  id?: number;
  company_id?: number;
  template_id?: number;
  content?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const CustomEmailInvoiceQuickText = {
  tableName: 'custom_email_invoice_quick_text',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    template_id: { type: 'INTEGER' },
    content: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as CustomEmailInvoiceQuickTextColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${CustomEmailInvoiceQuickText.tableName} (
        ${Object.entries(CustomEmailInvoiceQuickText.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('CustomEmailInvoiceQuickText table created');
    } catch (error) {
      console.error('Error creating custom_email_invoice_quick_text table:', error);
      throw error;
    }
  },

  insert: async (data: CustomEmailInvoiceQuickTextData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${CustomEmailInvoiceQuickText.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<CustomEmailInvoiceQuickTextData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${CustomEmailInvoiceQuickText.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<CustomEmailInvoiceQuickTextData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${CustomEmailInvoiceQuickText.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as CustomEmailInvoiceQuickTextData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<CustomEmailInvoiceQuickTextData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${CustomEmailInvoiceQuickText.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${CustomEmailInvoiceQuickText.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 