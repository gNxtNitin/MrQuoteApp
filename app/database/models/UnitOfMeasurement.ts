import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface UnitOfMeasurementColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  unit_name: ColumnDefinition;
  description: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface UnitOfMeasurementData {
  id?: number;
  company_id?: number;
  unit_name?: string;
  description?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const UnitOfMeasurement = {
  tableName: 'unit_of_measurement',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    unit_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as UnitOfMeasurementColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${UnitOfMeasurement.tableName} (
        ${Object.entries(UnitOfMeasurement.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('UnitOfMeasurement table created');
    } catch (error) {
      console.error('Error creating unit_of_measurement table:', error);
      throw error;
    }
  },

  insert: async (data: UnitOfMeasurementData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${UnitOfMeasurement.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<UnitOfMeasurementData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UnitOfMeasurement.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<UnitOfMeasurementData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UnitOfMeasurement.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY unit_name ASC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as UnitOfMeasurementData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<UnitOfMeasurementData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${UnitOfMeasurement.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${UnitOfMeasurement.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 