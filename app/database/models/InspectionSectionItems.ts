import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface InspectionSectionItemsColumns {
  id: ColumnDefinition;
  inspection_section_id: ColumnDefinition;
  inspection_file: ColumnDefinition;
  inspection_content: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface InspectionSectionItemsData {
  id?: number;
  inspection_section_id: number;
  inspection_file?: string;
  inspection_content?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const InspectionSectionItems = {
  tableName: 'inspection_section_items',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    inspection_section_id: { type: 'INTEGER NOT NULL' },
    inspection_file: { type: 'TEXT' },
    inspection_content: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as InspectionSectionItemsColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${InspectionSectionItems.tableName} (
        ${Object.entries(InspectionSectionItems.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (inspection_section_id) REFERENCES inspection_page_section(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('InspectionSectionItems table created');
    } catch (error) {
      console.error('Error creating inspection_section_items table:', error);
      throw error;
    }
  },

  insert: async (data: InspectionSectionItemsData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${InspectionSectionItems.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<InspectionSectionItemsData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${InspectionSectionItems.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as InspectionSectionItemsData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByInspectionSectionId: async (sectionId: number): Promise<InspectionSectionItemsData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${InspectionSectionItems.tableName} 
       WHERE inspection_section_id = ? AND is_active = true 
       ORDER BY id ASC`
    );

    try {
      const result = await statement.executeAsync([sectionId]);
      return await result.getAllAsync() as InspectionSectionItemsData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<InspectionSectionItemsData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${InspectionSectionItems.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${InspectionSectionItems.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 