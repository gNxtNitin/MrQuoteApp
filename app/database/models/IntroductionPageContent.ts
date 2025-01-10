import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface IntroductionPageContentColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  introduction_content: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface IntroductionPageContentData {
  id?: number;
  page_id?: number;
  introduction_content?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const IntroductionPageContent = {
  tableName: 'introduction_page_content',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER' },
    introduction_content: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as IntroductionPageContentColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${IntroductionPageContent.tableName} (
        ${Object.entries(IntroductionPageContent.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('IntroductionPageContent table created');
    } catch (error) {
      console.error('Error creating introduction_page_content table:', error);
      throw error;
    }
  },

  insert: async (introductionPageContentData: IntroductionPageContentData) => {
    const keys = Object.keys(introductionPageContentData);
    const values = Object.values(introductionPageContentData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${IntroductionPageContent.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<IntroductionPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${IntroductionPageContent.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<IntroductionPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${IntroductionPageContent.tableName} 
       WHERE page_id = ? AND is_active = true`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<IntroductionPageContentData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${IntroductionPageContent.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${IntroductionPageContent.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 