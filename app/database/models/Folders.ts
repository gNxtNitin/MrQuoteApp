import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface FoldersColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  folder_name: ColumnDefinition;
  parent_folder_id: ColumnDefinition;
  owner_id: ColumnDefinition;
  is_shared: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface FoldersData {
  id?: number;
  company_id?: number;
  folder_name?: string;
  parent_folder_id?: number;
  owner_id?: number;
  is_shared?: boolean;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Folders = {
  tableName: 'folders',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    folder_name: { type: 'TEXT' },
    parent_folder_id: { type: 'INTEGER' },
    owner_id: { type: 'INTEGER' },
    is_shared: { type: 'BOOLEAN' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as FoldersColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Folders.tableName} (
        ${Object.entries(Folders.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (parent_folder_id) REFERENCES folders(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('Folders table created');
    } catch (error) {
      console.error('Error creating folders table:', error);
      throw error;
    }
  },

  insert: async (foldersData: FoldersData) => {
    const keys = Object.keys(foldersData);
    const values = Object.values(foldersData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Folders.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<FoldersData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Folders.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<FoldersData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Folders.tableName} 
       WHERE company_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as FoldersData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByParentId: async (parentFolderId: number | null): Promise<FoldersData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Folders.tableName} 
       WHERE parent_folder_id ${parentFolderId === null ? 'IS NULL' : '= ?'} 
       AND is_active = true 
       ORDER BY folder_name ASC`
    );

    try {
      const result = await statement.executeAsync(parentFolderId !== null ? [parentFolderId] : []);
      return await result.getAllAsync() as FoldersData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<FoldersData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Folders.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Folders.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 