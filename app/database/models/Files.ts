import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface FilesColumns {
  id: ColumnDefinition;
  folder_id: ColumnDefinition;
  company_id: ColumnDefinition;
  file_name: ColumnDefinition;
  file_type: ColumnDefinition;
  file_size: ColumnDefinition;
  file_path: ColumnDefinition;
  owner_id: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface FilesData {
  id?: number;
  folder_id?: number;
  company_id?: number;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  file_path: string;
  owner_id?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Files = {
  tableName: 'files',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    folder_id: { type: 'INTEGER' },
    company_id: { type: 'INTEGER' },
    file_name: { type: 'TEXT' },
    file_type: { type: 'TEXT' },
    file_size: { type: 'BIGINT' },
    file_path: { type: 'TEXT NOT NULL' },
    owner_id: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as FilesColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Files.tableName} (
        ${Object.entries(Files.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('Files table created');
    } catch (error) {
      console.error('Error creating files table:', error);
      throw error;
    }
  },

  insert: async (filesData: FilesData) => {
    const keys = Object.keys(filesData);
    const values = Object.values(filesData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Files.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<FilesData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Files.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as FilesData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByFolderId: async (folderId: number): Promise<FilesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Files.tableName} 
       WHERE folder_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([folderId]);
      return await result.getAllAsync() as FilesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<FilesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Files.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as FilesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<FilesData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Files.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Files.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 