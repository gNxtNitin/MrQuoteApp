import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface ReportPagesColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  report_id: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface ReportPagesData {
  id?: number;
  page_id?: number;
  report_id?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const ReportPages = {
  tableName: 'report_pages',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER' },
    report_id: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN DEFAULT TRUE' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as ReportPagesColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${ReportPages.tableName} (
        ${Object.entries(ReportPages.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (report_id) REFERENCES report(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('ReportPages table created');
    } catch (error) {
      console.error('Error creating report_pages table:', error);
      throw error;
    }
  },

  insert: async (reportPagesData: ReportPagesData) => {
    const keys = Object.keys(reportPagesData);
    const values = Object.values(reportPagesData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${ReportPages.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<ReportPagesData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ReportPages.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByReportId: async (reportId: number): Promise<ReportPagesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ReportPages.tableName} 
       WHERE report_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([reportId]);
      return await result.getAllAsync() as ReportPagesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<ReportPagesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${ReportPages.tableName} 
       WHERE page_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getAllAsync() as ReportPagesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<ReportPagesData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${ReportPages.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${ReportPages.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 