import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface QuotePageSectionColumns {
  id: ColumnDefinition;
  quote_page_id: ColumnDefinition;
  section_title: ColumnDefinition;
  section_total: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface QuotePageSectionData {
  id?: number;
  quote_page_id: number;
  section_title?: string;
  section_total?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const QuotePageSection = {
  tableName: 'quote_page_section',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    quote_page_id: { type: 'INTEGER NOT NULL' },
    section_title: { type: 'TEXT' },
    section_total: { type: 'DECIMAL(10,2)' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as QuotePageSectionColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${QuotePageSection.tableName} (
        ${Object.entries(QuotePageSection.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (quote_page_id) REFERENCES quote_page_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('QuotePageSection table created');
    } catch (error) {
      console.error('Error creating quote_page_section table:', error);
      throw error;
    }
  },

  insert: async (data: QuotePageSectionData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${QuotePageSection.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<QuotePageSectionData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${QuotePageSection.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as QuotePageSectionData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByQuotePageId: async (quotePageId: number): Promise<QuotePageSectionData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${QuotePageSection.tableName} 
       WHERE quote_page_id = ? AND is_active = true 
       ORDER BY id ASC`
    );

    try {
      const result = await statement.executeAsync([quotePageId]);
      return await result.getAllAsync() as QuotePageSectionData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<QuotePageSectionData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${QuotePageSection.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${QuotePageSection.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 