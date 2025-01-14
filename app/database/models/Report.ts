import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface ReportColumns {
  id: ColumnDefinition;
  estimate_id: ColumnDefinition;
  layout_id: ColumnDefinition;
  report_name: ColumnDefinition;
  description: ColumnDefinition;
  report_status: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface ReportData {
  id?: number;
  estimate_id?: number;
  layout_id?: number;
  report_name?: string;
  description?: string;
  report_status?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Report = {
  tableName: 'report',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    estimate_id: { type: 'INTEGER' },
    layout_id: { type: 'INTEGER' },
    report_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    report_status: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT TRUE' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as ReportColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Report.tableName} (
        ${Object.entries(Report.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (layout_id) REFERENCES layouts(id),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('Report table created');
    } catch (error) {
      console.error('Error creating report table:', error);
      throw error;
    }
  },

  insert: async (reportData: ReportData) => {
    const keys = Object.keys(reportData);
    const values = Object.values(reportData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Report.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
      console.log('Report inserted');
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<ReportData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Report.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByEstimateId: async (estimateId: number): Promise<ReportData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Report.tableName} 
       WHERE estimate_id = ? 
       AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([estimateId]);
      return await result.getAllAsync() as ReportData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<ReportData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Report.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Report.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 