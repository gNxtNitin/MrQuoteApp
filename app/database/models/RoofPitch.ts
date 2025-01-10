import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface RoofPitchColumns {
  id: ColumnDefinition;
  estimate_id: ColumnDefinition;
  eight_by_twelve: ColumnDefinition;
  seven_by_twelve: ColumnDefinition;
  nine_by_twelve: ColumnDefinition;
  ten_by_twelve: ColumnDefinition;
  eleven_by_twelve: ColumnDefinition;
  twelve_by_twelve: ColumnDefinition;
}

export interface RoofPitchData {
  id?: number;
  estimate_id?: number;
  eight_by_twelve?: string;
  seven_by_twelve?: string;
  nine_by_twelve?: string;
  ten_by_twelve?: string;
  eleven_by_twelve?: string;
  twelve_by_twelve?: string;
}

export const RoofPitch = {
  tableName: 'roof_pitch',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    estimate_id: { type: 'INTEGER' },
    eight_by_twelve: { type: 'TEXT' },
    seven_by_twelve: { type: 'TEXT' },
    nine_by_twelve: { type: 'TEXT' },
    ten_by_twelve: { type: 'TEXT' },
    eleven_by_twelve: { type: 'TEXT' },
    twelve_by_twelve: { type: 'TEXT' }
  } as RoofPitchColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${RoofPitch.tableName} (
        ${Object.entries(RoofPitch.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('RoofPitch table created');
    } catch (error) {
      console.error('Error creating roof_pitch table:', error);
      throw error;
    }
  },

  insert: async (roofPitchData: RoofPitchData) => {
    const keys = Object.keys(roofPitchData);
    const values = Object.values(roofPitchData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${RoofPitch.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<RoofPitchData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${RoofPitch.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByEstimateId: async (estimateId: number): Promise<RoofPitchData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${RoofPitch.tableName} WHERE estimate_id = ?`
    );

    try {
      const result = await statement.executeAsync([estimateId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<RoofPitchData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${RoofPitch.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${RoofPitch.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 