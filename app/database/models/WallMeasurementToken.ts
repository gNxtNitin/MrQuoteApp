import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface WallMeasurementTokenColumns {
  id: ColumnDefinition;
  estimate_id: ColumnDefinition;
  total_wall_area: ColumnDefinition;
  north_wall_area: ColumnDefinition;
  east_wall_area: ColumnDefinition;
  south_wall_area: ColumnDefinition;
  west_wall_area: ColumnDefinition;
  bin_disposal_siding: ColumnDefinition;
}

export interface WallMeasurementTokenData {
  id?: number;
  estimate_id?: number;
  total_wall_area?: number;
  north_wall_area?: string;
  east_wall_area?: string;
  south_wall_area?: string;
  west_wall_area?: string;
  bin_disposal_siding?: string;
}

export const WallMeasurementToken = {
  tableName: 'wall_measurement_token',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    estimate_id: { type: 'INTEGER' },
    total_wall_area: { type: 'INTEGER' },
    north_wall_area: { type: 'TEXT' },
    east_wall_area: { type: 'TEXT' },
    south_wall_area: { type: 'TEXT' },
    west_wall_area: { type: 'TEXT' },
    bin_disposal_siding: { type: 'TEXT' }
  } as WallMeasurementTokenColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${WallMeasurementToken.tableName} (
        ${Object.entries(WallMeasurementToken.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('WallMeasurementToken table created');
    } catch (error) {
      console.error('Error creating wall_measurement_token table:', error);
      throw error;
    }
  },

  insert: async (wallMeasurementData: WallMeasurementTokenData) => {
    const keys = Object.keys(wallMeasurementData);
    const values = Object.values(wallMeasurementData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${WallMeasurementToken.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<WallMeasurementTokenData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${WallMeasurementToken.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByEstimateId: async (estimateId: number): Promise<WallMeasurementTokenData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${WallMeasurementToken.tableName} WHERE estimate_id = ?`
    );

    try {
      const result = await statement.executeAsync([estimateId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<WallMeasurementTokenData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${WallMeasurementToken.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${WallMeasurementToken.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 