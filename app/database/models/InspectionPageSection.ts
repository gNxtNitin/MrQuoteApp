import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface InspectionPageSectionColumns {
  id: ColumnDefinition;
  inspection_page_id: ColumnDefinition;
  section_style_id: ColumnDefinition;
  section_title: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface InspectionPageSectionData {
  id?: number;
  inspection_page_id: number;
  section_style_id: number;
  section_title?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const InspectionPageSection = {
  tableName: 'inspection_page_section',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    inspection_page_id: { type: 'INTEGER NOT NULL' },
    section_style_id: { type: 'INTEGER NOT NULL' },
    section_title: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as InspectionPageSectionColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${InspectionPageSection.tableName} (
        ${Object.entries(InspectionPageSection.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (inspection_page_id) REFERENCES inspection_page_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (section_style_id) REFERENCES section_style(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('InspectionPageSection table created');
    } catch (error) {
      console.error('Error creating inspection_page_section table:', error);
      throw error;
    }
  },

  insert: async (data: InspectionPageSectionData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${InspectionPageSection.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<InspectionPageSectionData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${InspectionPageSection.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as InspectionPageSectionData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByInspectionPageId: async (inspectionPageId: number): Promise<InspectionPageSectionData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${InspectionPageSection.tableName} 
       WHERE inspection_page_id = ? AND is_active = true 
       ORDER BY id ASC`
    );

    try {
      const result = await statement.executeAsync([inspectionPageId]);
      return await result.getAllAsync() as InspectionPageSectionData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<InspectionPageSectionData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${InspectionPageSection.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${InspectionPageSection.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 