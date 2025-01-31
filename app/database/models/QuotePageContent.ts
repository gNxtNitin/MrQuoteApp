import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface QuotePageContentColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  quote_page_title: ColumnDefinition;
  quote_subtotal: ColumnDefinition;
  total: ColumnDefinition;
  notes: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface QuotePageContentData {
  id?: number;
  page_id: number;
  quote_page_title: string;
  quote_subtotal: number;
  total: number;
  notes: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number | null;
  modified_date?: string | null;
}

export const QuotePageContent = {
  tableName: 'quote_page_content',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER NOT NULL' },
    quote_page_title: { type: 'TEXT NOT NULL' },
    quote_subtotal: { type: 'DECIMAL(10,2)' },
    total: { type: 'DECIMAL(10,2)' },
    notes: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as QuotePageContentColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${QuotePageContent.tableName} (
        ${Object.entries(QuotePageContent.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('QuotePageContent table created');
    } catch (error) {
      console.error('Error creating quote_page_content table:', error);
      throw error;
    }
  },

  insert: async (data: QuotePageContentData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${QuotePageContent.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<QuotePageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${QuotePageContent.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as QuotePageContentData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<QuotePageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${QuotePageContent.tableName} 
       WHERE page_id = ? AND is_active = true`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getFirstAsync() as QuotePageContentData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<QuotePageContentData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${QuotePageContent.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${QuotePageContent.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 