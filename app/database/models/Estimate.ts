import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface EstimateColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  user_id: ColumnDefinition;
  estimate_name: ColumnDefinition;
  description: ColumnDefinition;
  estimate_status: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface EstimateData {
  id?: number;
  company_id?: number;
  user_id?: number;
  estimate_name?: string;
  description?: string;
  estimate_status?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Estimate = {
  tableName: 'estimate',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    user_id: { type: 'INTEGER' },
    estimate_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    estimate_status: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as EstimateColumns,

  createTable: async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS ${Estimate.tableName} (
      ${Object.entries(Estimate.columns)
        .map(([key, value]) => `${key} ${value.type}`)
        .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;
    try {
      await db.execAsync(query);
    } catch (error) {
      console.error('Error creating estimate table:', error);
      throw error;
    }
  },

//   createTable: async () => {
//     const query = `
//       CREATE TABLE IF NOT EXISTS ${Estimate.tableName} (
//         id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
//         company_id INTEGER,
//         estimate_name TEXT,
//         description TEXT,
//         estimate_status TEXT,
//         is_active BOOLEAN,
//         created_by INTEGER,
//         created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//         modified_by INTEGER,
//         modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//         FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
//         FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
//         FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
//       );
//     `;

//     try {
//       await db.execAsync(query);
//     } catch (error) {
//       console.error('Error creating estimate table:', error);
//       throw error;
//     }
//   },

  insert: async (estimateData: EstimateData) => {
    const keys = Object.keys(estimateData);
    const values = Object.values(estimateData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Estimate.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<EstimateData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<EstimateData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} 
       WHERE company_id = ? 
       AND is_active = true
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as EstimateData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByUserAndCompany: async (userId: number, companyId: number): Promise<EstimateData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} 
       WHERE company_id = ? 
       AND user_id = ?
       AND is_active = true
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId, userId]);
      return await result.getAllAsync() as EstimateData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<EstimateData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Estimate.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Estimate.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getLastInsertedId: async (): Promise<{ id: number }> => {
    const statement = await db.prepareAsync(
      'SELECT last_insert_rowid() as id FROM estimate'
    );
    try {
      const result = await statement.executeAsync();
      return await result.getFirstAsync() as { id: number };
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByUserAndCompanyId: async (userId: number, companyId: number): Promise<EstimateData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} 
       WHERE company_id = ? 
       AND user_id = ?
       AND is_active = true
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId, userId]);
      return await result.getAllAsync() as EstimateData[];
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 