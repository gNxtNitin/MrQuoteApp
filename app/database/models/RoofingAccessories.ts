import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface RoofingAccessoriesColumns {
  id: ColumnDefinition;
  estimate_id: ColumnDefinition;
  vents_standard: ColumnDefinition;
  vents_turbine: ColumnDefinition;
  vents_phoenix: ColumnDefinition;
  exhaust_cap: ColumnDefinition;
  pipe_jacks: ColumnDefinition;
  bin_disposal_roofing: ColumnDefinition;
  skylights: ColumnDefinition;
  skylight_flashing_kits: ColumnDefinition;
  chimney_flashing_kits_average: ColumnDefinition;
  chimney_flashing_kits_large: ColumnDefinition;
  minimum_charge: ColumnDefinition;
  labor_hours: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface RoofingAccessoriesData {
  id?: number;
  estimate_id?: number;
  vents_standard?: string;
  vents_turbine?: string;
  vents_phoenix?: string;
  exhaust_cap?: string;
  pipe_jacks?: string;
  bin_disposal_roofing?: string;
  skylights?: string;
  skylight_flashing_kits?: string;
  chimney_flashing_kits_average?: string;
  chimney_flashing_kits_large?: string;
  minimum_charge?: number | null;
  labor_hours?: string;
  modified_by?: number;
  modified_date?: string;
}

export const RoofingAccessories = {
  tableName: 'roofing_accessories',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    estimate_id: { type: 'INTEGER' },
    vents_standard: { type: 'TEXT' },
    vents_turbine: { type: 'TEXT' },
    vents_phoenix: { type: 'TEXT' },
    exhaust_cap: { type: 'TEXT' },
    pipe_jacks: { type: 'TEXT' },
    bin_disposal_roofing: { type: 'TEXT' },
    skylights: { type: 'TEXT' },
    skylight_flashing_kits: { type: 'TEXT' },
    chimney_flashing_kits_average: { type: 'TEXT' },
    chimney_flashing_kits_large: { type: 'TEXT' },
    minimum_charge: { type: 'INTEGER NULL' },
    labor_hours: { type: 'DATETIME' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as RoofingAccessoriesColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${RoofingAccessories.tableName} (
        ${Object.entries(RoofingAccessories.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('RoofingAccessories table created');
    } catch (error) {
      console.error('Error creating roofing_accessories table:', error);
      throw error;
    }
  },

  insert: async (roofingAccessoriesData: RoofingAccessoriesData) => {
    const keys = Object.keys(roofingAccessoriesData);
    const values = Object.values(roofingAccessoriesData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${RoofingAccessories.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<RoofingAccessoriesData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${RoofingAccessories.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByEstimateId: async (estimateId: number): Promise<RoofingAccessoriesData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${RoofingAccessories.tableName} 
       WHERE estimate_id = ? 
       ORDER BY modified_date DESC 
       LIMIT 1`
    );

    try {
      const result = await statement.executeAsync([estimateId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<RoofingAccessoriesData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${RoofingAccessories.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${RoofingAccessories.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 