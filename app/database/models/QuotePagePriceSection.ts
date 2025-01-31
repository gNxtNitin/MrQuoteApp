import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface QuotePagePriceSectionColumns {
  id: ColumnDefinition;
  quote_section_id: ColumnDefinition;
  price_section_id: ColumnDefinition;
  section_total: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface QuotePagePriceSectionData {
  id?: number;
  quote_section_id: number;
  price_section_id: number;
  section_total: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number | null;
  modified_date?: string | null;
}

export const QuotePagePriceSection = {
  tableName: 'quote_page_price_section',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    quote_section_id: { type: 'INTEGER NOT NULL' },
    price_section_id: { type: 'INTEGER NOT NULL' },
    section_total: { type: 'DECIMAL(10,2)' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as QuotePagePriceSectionColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${QuotePagePriceSection.tableName} (
        ${Object.entries(QuotePagePriceSection.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (quote_section_id) REFERENCES quote_page_section(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (price_section_id) REFERENCES products_pricing(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('QuotePagePriceSection table created');
    } catch (error) {
      console.error('Error creating quote_page_price_section table:', error);
      throw error;
    }
  },

  insert: async (data: QuotePagePriceSectionData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${QuotePagePriceSection.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<QuotePagePriceSectionData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${QuotePagePriceSection.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as QuotePagePriceSectionData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByQuoteSectionId: async (quoteSectionId: number): Promise<QuotePagePriceSectionData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${QuotePagePriceSection.tableName} 
       WHERE quote_section_id = ? AND is_active = true 
       ORDER BY id ASC`
    );

    try {
      const result = await statement.executeAsync([quoteSectionId]);
      return await result.getAllAsync() as QuotePagePriceSectionData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<QuotePagePriceSectionData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${QuotePagePriceSection.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${QuotePagePriceSection.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 