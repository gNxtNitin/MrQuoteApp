import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface EstimateDetailColumns {
  id: ColumnDefinition;
  estimate_id: ColumnDefinition;
  estimate_number: ColumnDefinition;
  sales_person: ColumnDefinition;
  estimate_created_date: ColumnDefinition;
  estimate_revenue: ColumnDefinition;
  email: ColumnDefinition;
  phone: ColumnDefinition;
  next_call_date: ColumnDefinition;
  image_url: ColumnDefinition;
  address: ColumnDefinition;
  state: ColumnDefinition;
  zip_code: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface EstimateDetailData {
  id?: number;
  estimate_id?: number;
  estimate_number?: string;
  sales_person?: string;
  estimate_revenue?: string;
  email?: string;
  phone?: string;
  next_call_date?: string;
  image_url?: string;
  address?: string;
  state?: string;
  zip_code?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const EstimateDetail = {
  tableName: 'estimate_details',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    estimate_id: { type: 'INTEGER' },
    estimate_number: { type: 'TEXT' },
    sales_person: { type: 'TEXT' },
    estimate_revenue: { type: 'TEXT' },
    email: { type: 'TEXT' },
    phone: { type: 'TEXT' },
    next_call_date: { type: 'DATETIME' },
    image_url: { type: 'TEXT' },
    address: { type: 'TEXT' },
    state: { type: 'TEXT' },
    zip_code: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as EstimateDetailColumns,

  createTable: async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS ${EstimateDetail.tableName} (
      ${Object.entries(EstimateDetail.columns)
        .map(([key, value]) => `${key} ${value.type}`)
        .join(',\n')},
        FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;
    try {
      await db.execAsync(query);
    } catch (error) {
      console.error('Error creating estimate detail table:', error);
      throw error;
    }
  },

  insert: async (estimateDetailData: EstimateDetailData) => {
    const db = openDatabase();
    
    try {
        const keys = Object.keys(estimateDetailData);
        const values = Object.values(estimateDetailData);
        const placeholders = values.map(() => '?').join(',');

        const statement = await db.prepareAsync(
          `INSERT INTO ${EstimateDetail.tableName} (${keys.join(',')}) VALUES (${placeholders})`
        );

        try {
          await statement.executeAsync(values);
          console.log('Estimate detail inserted');
        } finally {
          await statement.finalizeAsync();
        }
    //   });
    } catch (error) {
      console.error('Error in EstimateDetail insert:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<EstimateDetailData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${EstimateDetail.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByEstimateId: async (estimateId: number): Promise<EstimateDetailData | null> => {
    EstimateDetail.logAllEstimateDetails();
    const statement = await db.prepareAsync(
      `SELECT * FROM ${EstimateDetail.tableName} 
       WHERE estimate_id = ? 
       AND is_active = true
       ORDER BY created_date DESC
       LIMIT 1`
    );

    try {
      const result = await statement.executeAsync([estimateId]);
      const detail = await result.getFirstAsync();
      if (!detail) {
        console.warn(`No detail found for estimate ${estimateId}`);
        return null;
      }
      return detail;
    } catch (error) {
      console.error(`Error fetching detail for estimate ${estimateId}:`, error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<EstimateDetailData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${EstimateDetail.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${EstimateDetail.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  logAllEstimateDetails: async () => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${EstimateDetail.tableName}`
    );

    try {
      const result = await statement.executeAsync();
      const details = await result.getAllAsync();
      console.log('All Estimate Details:', details);
    } catch (error) {
      console.error('Error fetching all estimate details:', error);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 