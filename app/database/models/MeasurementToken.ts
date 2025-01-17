import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface MeasurementTokenColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  token_name: ColumnDefinition;
  unit_of_measurement_id: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface MeasurementTokenData {
  id?: number;
  company_id?: number;
  token_name?: string;
  unit_of_measurement_id?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const MeasurementToken = {
  tableName: 'measurement_token',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    token_name: { type: 'TEXT' },
    unit_of_measurement_id: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as MeasurementTokenColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${MeasurementToken.tableName} (
        ${Object.entries(MeasurementToken.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (unit_of_measurement_id) REFERENCES unit_of_measurement(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('MeasurementToken table created');
    } catch (error) {
      console.error('Error creating measurement_token table:', error);
      throw error;
    }
  },

  insert: async (data: MeasurementTokenData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${MeasurementToken.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<MeasurementTokenData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${MeasurementToken.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<MeasurementTokenData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${MeasurementToken.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY token_name ASC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as MeasurementTokenData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByUnitOfMeasurement: async (unitOfMeasurementId: number): Promise<MeasurementTokenData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${MeasurementToken.tableName} 
       WHERE unit_of_measurement_id = ? AND is_active = true 
       ORDER BY token_name ASC`
    );

    try {
      const result = await statement.executeAsync([unitOfMeasurementId]);
      return await result.getAllAsync() as MeasurementTokenData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<MeasurementTokenData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${MeasurementToken.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${MeasurementToken.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 