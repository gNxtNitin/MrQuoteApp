import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface WarrantyPageContentColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  warranty_page_title: ColumnDefinition;
  warranty_details: ColumnDefinition;
  warranty_start_date: ColumnDefinition;
  completion_date: ColumnDefinition;
  customer_name: ColumnDefinition;
  address: ColumnDefinition;
  thank_you_note: ColumnDefinition;
  signature: ColumnDefinition;
  signee_name: ColumnDefinition;
  signee_title: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface WarrantyPageContentData {
  id?: number;
  page_id: number;
  warranty_page_title?: string;
  warranty_details?: string;
  warranty_start_date?: string;
  completion_date?: string;
  customer_name?: string;
  address?: string;
  thank_you_note?: string;
  signature?: string;
  signee_name?: string;
  signee_title?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number | null;
  modified_date?: string | null;
}

export const WarrantyPageContent = {
  tableName: 'warranty_page_content',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER' },
    warranty_page_title: { type: 'TEXT' },
    warranty_details: { type: 'TEXT' },
    warranty_start_date: { type: 'TEXT' },
    completion_date: { type: 'TEXT' },
    customer_name: { type: 'TEXT' },
    address: { type: 'TEXT' },
    thank_you_note: { type: 'TEXT' },
    signature: { type: 'TEXT' },
    signee_name: { type: 'TEXT' },
    signee_title: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT 1' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as WarrantyPageContentColumns,

  dropTable: async () => {
    const query = `DROP TABLE IF EXISTS ${WarrantyPageContent.tableName}`;
    try {
      await db.execAsync(query);
      // console.log.log('WarrantyPageContent table dropped successfully');
    } catch (error) {
      console.error('Error dropping warranty_page_content table:', error);
      throw error;
    }
  },

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${WarrantyPageContent.tableName} (
        ${Object.entries(WarrantyPageContent.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('WarrantyPageContent table created successfully');
    } catch (error) {
      console.error('Error creating warranty_page_content table:', error);
      throw error;
    }
  },

  recreateTable: async () => {
    try {
      await WarrantyPageContent.dropTable();
      await WarrantyPageContent.createTable();
      // console.log.log('WarrantyPageContent table recreated successfully');
    } catch (error) {
      console.error('Error recreating warranty_page_content table:', error);
      throw error;
    }
  },

  insert: async (data: WarrantyPageContentData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${WarrantyPageContent.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<WarrantyPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${WarrantyPageContent.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as WarrantyPageContentData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<WarrantyPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${WarrantyPageContent.tableName} 
       WHERE page_id = ? AND is_active = true 
       ORDER BY created_date DESC 
       LIMIT 1`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getFirstAsync() as WarrantyPageContentData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<WarrantyPageContentData>) => {
    // console.log.log('data', data);
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${WarrantyPageContent.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${WarrantyPageContent.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 