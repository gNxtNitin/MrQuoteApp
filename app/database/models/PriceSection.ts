import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface PriceSectionColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  item: ColumnDefinition;
  quantity: ColumnDefinition;
  price: ColumnDefinition;
  line_total: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface PriceSectionData {
  id?: number;
  company_id: number;
  item?: string;
  quantity?: number;
  price?: number;
  line_total?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const PriceSection = {
  tableName: 'price_section',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER NOT NULL' },
    item: { type: 'TEXT' },
    quantity: { type: 'INTEGER' },
    price: { type: 'DECIMAL(10,2)' },
    line_total: { type: 'DECIMAL(10,2)' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as PriceSectionColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${PriceSection.tableName} (
        ${Object.entries(PriceSection.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('PriceSection table created');
    } catch (error) {
      console.error('Error creating price_section table:', error);
      throw error;
    }
  },

  insert: async (data: PriceSectionData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${PriceSection.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<PriceSectionData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${PriceSection.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as PriceSectionData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<PriceSectionData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${PriceSection.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY id ASC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as PriceSectionData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<PriceSectionData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${PriceSection.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${PriceSection.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 