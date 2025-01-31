import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface RoofMeasurementTokenColumns {
  id: ColumnDefinition;
  estimate_id: ColumnDefinition;
  total_roof_area: ColumnDefinition;
  total_eaves: ColumnDefinition;
  total_rakes: ColumnDefinition;
  total_valleys: ColumnDefinition;
  total_ridges_hips: ColumnDefinition;
  total_hips: ColumnDefinition;
  total_ridges: ColumnDefinition;
  suggested_waste_percentage: ColumnDefinition;
  quick_squares: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface RoofMeasurementTokenData {
  id?: number;
  estimate_id?: number;
  total_roof_area?: number;
  total_eaves?: string;
  total_rakes?: string;
  total_valleys?: string;
  total_ridges_hips?: string;
  total_hips?: string;
  total_ridges?: string;
  suggested_waste_percentage?: string;
  quick_squares?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const RoofMeasurementToken = {
  tableName: 'roof_measurement_token',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    estimate_id: { type: 'INTEGER' },
    total_roof_area: { type: 'INTEGER' },
    total_eaves: { type: 'TEXT' },
    total_rakes: { type: 'TEXT' },
    total_valleys: { type: 'TEXT' },
    total_ridges_hips: { type: 'TEXT' },
    total_hips: { type: 'TEXT' },
    total_ridges: { type: 'TEXT' },
    suggested_waste_percentage: { type: 'TEXT' },
    quick_squares: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as RoofMeasurementTokenColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${RoofMeasurementToken.tableName} (
        ${Object.entries(RoofMeasurementToken.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('RoofMeasurementToken table created');
    } catch (error) {
      console.error('Error creating roof_measurement_token table:', error);
      throw error;
    }
  },

  insert: async (roofMeasurementData: RoofMeasurementTokenData) => {
    const keys = Object.keys(roofMeasurementData);
    const values = Object.values(roofMeasurementData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${RoofMeasurementToken.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
      // console.log.log('RoofMeasurementToken inserted');
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<RoofMeasurementTokenData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${RoofMeasurementToken.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByEstimateId: async (estimateId: number): Promise<RoofMeasurementTokenData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${RoofMeasurementToken.tableName} 
       WHERE estimate_id = ? 
       AND is_active = true 
       ORDER BY created_date DESC 
       LIMIT 1`
    );

    try {
      const result = await statement.executeAsync([estimateId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<RoofMeasurementTokenData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${RoofMeasurementToken.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${RoofMeasurementToken.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 