import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface ResidentialMetalsColumns {
  id: ColumnDefinition;
  estimate_id: ColumnDefinition;
  gutters: ColumnDefinition;
  downspouts: ColumnDefinition;
}

export interface ResidentialMetalsData {
  id?: number;
  estimate_id?: number;
  gutters?: number;
  downspouts?: string;
}

export const ResidentialMetals = {
  tableName: 'residential_metals',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    estimate_id: { type: 'INTEGER' },
    gutters: { type: 'INTEGER' },
    downspouts: { type: 'TEXT' }
  } as ResidentialMetalsColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${ResidentialMetals.tableName} (
        ${Object.entries(ResidentialMetals.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('ResidentialMetals table created');
    } catch (error) {
      console.error('Error creating residential_metals table:', error);
      throw error;
    }
  },

  insert: async (residentialMetalsData: ResidentialMetalsData) => {
    const keys = Object.keys(residentialMetalsData);
    const values = Object.values(residentialMetalsData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${ResidentialMetals.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<ResidentialMetalsData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ResidentialMetals.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByEstimateId: async (estimateId: number): Promise<ResidentialMetalsData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ResidentialMetals.tableName} WHERE estimate_id = ?`
    );

    try {
      const result = await statement.executeAsync([estimateId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<ResidentialMetalsData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${ResidentialMetals.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${ResidentialMetals.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 