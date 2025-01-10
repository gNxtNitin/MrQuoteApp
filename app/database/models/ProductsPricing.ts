import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface ProductsPricingColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  name: ColumnDefinition;
  description: ColumnDefinition;
  unit: ColumnDefinition;
  material_price: ColumnDefinition;
  labor: ColumnDefinition;
  margin: ColumnDefinition;
  price: ColumnDefinition;
  tax_exempt_status: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface ProductsPricingData {
  id?: number;
  company_id?: number;
  name?: string;
  description?: string;
  unit?: string;
  material_price?: number;
  labor?: number;
  margin?: number;
  price?: number;
  tax_exempt_status?: boolean;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const ProductsPricing = {
  tableName: 'products_pricing',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    unit: { type: 'TEXT' },
    material_price: { type: 'DECIMAL(10,2)' },
    labor: { type: 'DECIMAL(10,2)' },
    margin: { type: 'DECIMAL(10,2)' },
    price: { type: 'DECIMAL(10,2)' },
    tax_exempt_status: { type: 'BOOLEAN' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as ProductsPricingColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${ProductsPricing.tableName} (
        ${Object.entries(ProductsPricing.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('ProductsPricing table created');
    } catch (error) {
      console.error('Error creating products_pricing table:', error);
      throw error;
    }
  },

  insert: async (data: ProductsPricingData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${ProductsPricing.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<ProductsPricingData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ProductsPricing.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<ProductsPricingData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ProductsPricing.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY name ASC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as ProductsPricingData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<ProductsPricingData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${ProductsPricing.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${ProductsPricing.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 