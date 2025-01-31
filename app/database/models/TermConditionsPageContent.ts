import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface TermConditionsPageContentColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  tc_page_title: ColumnDefinition;
  is_acknowledged: ColumnDefinition;
  is_summary: ColumnDefinition;
  is_pdf: ColumnDefinition;
  summary_content: ColumnDefinition;
  pdf_file_path: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface TermConditionsPageContentData {
  id?: number;
  page_id: number;
  tc_page_title?: string;
  is_acknowledged?: number;
  is_summary?: boolean;
  is_pdf?: boolean;
  summary_content?: string;
  pdf_file_path?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const TermConditionsPageContent = {
  tableName: 'term_conditions_page_content',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER NOT NULL' },
    tc_page_title: { type: 'TEXT' },
    is_acknowledged: { type: 'INTEGER' },
    is_summary: { type: 'BOOLEAN' },
    is_pdf: { type: 'BOOLEAN' },
    summary_content: { type: 'TEXT' },
    pdf_file_path: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as TermConditionsPageContentColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${TermConditionsPageContent.tableName} (
        ${Object.entries(TermConditionsPageContent.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('TermConditionsPageContent table created');
    } catch (error) {
      console.error('Error creating term_conditions_page_content table:', error);
      throw error;
    }
  },

  insert: async (data: TermConditionsPageContentData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${TermConditionsPageContent.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<TermConditionsPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TermConditionsPageContent.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as TermConditionsPageContentData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<TermConditionsPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TermConditionsPageContent.tableName} 
       WHERE page_id = ? AND is_active = true 
       ORDER BY created_date DESC
       LIMIT 1`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getFirstAsync() as TermConditionsPageContentData | null;
    } catch (error) {
      console.error('Error getting terms by page ID:', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<TermConditionsPageContentData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${TermConditionsPageContent.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
      // console.log.log(`Updated terms and conditions with ID ${id}`);
    } catch (error) {
      console.error('Error updating terms and conditions:', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${TermConditionsPageContent.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getTermsIdByPageId: async (pageId: number): Promise<number | null> => {
    const statement = await db.prepareAsync(
      `SELECT id FROM ${TermConditionsPageContent.tableName} 
       WHERE page_id = ? AND is_active = true 
       ORDER BY created_date DESC 
       LIMIT 1`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      const row = await result.getFirstAsync();
      return row ? (row as { id: number }).id : null;
    } catch (error) {
      console.error('Error getting terms ID by page ID:', error);
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 