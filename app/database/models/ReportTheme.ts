import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface ReportThemeColumns {
  id: ColumnDefinition;
  theme_name: ColumnDefinition;
  description: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface ReportThemeData {
  id?: number;
  theme_name?: string;
  description?: string;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const ReportTheme = {
  tableName: 'report_themes',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    theme_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as ReportThemeColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${ReportTheme.tableName} (
        ${Object.entries(ReportTheme.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('ReportTheme table created');
    } catch (error) {
      console.error('Error creating report_themes table:', error);
      throw error;
    }
  },

  insert: async (reportThemeData: ReportThemeData) => {
    const keys = Object.keys(reportThemeData);
    const values = Object.values(reportThemeData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${ReportTheme.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
      // console.log.log('ReportTheme inserted');
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<ReportThemeData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ReportTheme.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getAll: async (): Promise<ReportThemeData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ReportTheme.tableName} ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync();
      return await result.getAllAsync() as ReportThemeData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<ReportThemeData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${ReportTheme.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${ReportTheme.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 