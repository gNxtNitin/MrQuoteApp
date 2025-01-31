import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface PriceSectionDetailColumns {
  id: ColumnDefinition;
  price_section_id: ColumnDefinition;
  name: ColumnDefinition;
  description: ColumnDefinition;
  unit: ColumnDefinition;
  material: ColumnDefinition;
  line_total: ColumnDefinition;
  labor: ColumnDefinition;
  margin: ColumnDefinition;
  price: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface PriceSectionDetailData {
  id?: number;
  price_section_id: number;
  name?: string;
  description?: string;
  unit?: string;
  material?: number;
  line_total?: number;
  labor?: number;
  margin?: number;
  price?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const PriceSectionDetail = {
  tableName: 'price_section_detail',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    price_section_id: { type: 'INTEGER NOT NULL' },
    name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    unit: { type: 'TEXT' },
    material: { type: 'DECIMAL(10,2)' },
    line_total: { type: 'DECIMAL(10,2)' },
    labor: { type: 'DECIMAL(10,2)' },
    margin: { type: 'DECIMAL(10,2)' },
    price: { type: 'DECIMAL(10,2)' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as PriceSectionDetailColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${PriceSectionDetail.tableName} (
        ${Object.entries(PriceSectionDetail.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (price_section_id) REFERENCES price_section(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('PriceSectionDetail table created');
    } catch (error) {
      console.error('Error creating price_section_detail table:', error);
      throw error;
    }
  },

  insert: async (data: PriceSectionDetailData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${PriceSectionDetail.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<PriceSectionDetailData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${PriceSectionDetail.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as PriceSectionDetailData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPriceSectionId: async (priceSectionId: number): Promise<PriceSectionDetailData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${PriceSectionDetail.tableName} 
       WHERE price_section_id = ? AND is_active = true 
       ORDER BY id ASC`
    );

    try {
      const result = await statement.executeAsync([priceSectionId]);
      return await result.getAllAsync() as PriceSectionDetailData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<PriceSectionDetailData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${PriceSectionDetail.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${PriceSectionDetail.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 