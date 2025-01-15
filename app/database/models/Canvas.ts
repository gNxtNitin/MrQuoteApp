import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface CanvasColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  paths: ColumnDefinition;
  current_path: ColumnDefinition;
  description: ColumnDefinition;
  canvas_image_path: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
  is_active: ColumnDefinition;
}

export interface CanvasData {
  id?: number;
  page_id: number;
  paths: string;  // JSON string of PathWithLabel[]
  current_path?: string;
  description?: string;
  canvas_image_path?: string;
  created_by: number;
  created_date: string;
  modified_by?: number;
  modified_date?: string;
  is_active?: boolean;
}

export const Canvas = {
  tableName: 'canvas',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER NOT NULL' },
    paths: { type: 'TEXT NOT NULL' },
    current_path: { type: 'TEXT' },
    description: { type: 'TEXT' },
    canvas_image_path: { type: 'TEXT' },
    created_by: { type: 'INTEGER NOT NULL' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    is_active: { type: 'BOOLEAN DEFAULT true' }
  } as CanvasColumns,

  createTable: async () => {
    const columnDefinitions = Object.entries(Canvas.columns)
      .map(([key, value]) => `${key} ${value.type}`)
      .join(',\n');

    const query = `
      CREATE TABLE IF NOT EXISTS ${Canvas.tableName} (
        ${columnDefinitions},
        FOREIGN KEY (page_id) REFERENCES pages (id)
      );
    `;

    try {
      await db.execAsync(query);
    } catch (error) {
      console.error('Error creating canvas table:', error);
      throw error;
    }
  },

  insert: async (canvasData: CanvasData) => {
    const keys = Object.keys(canvasData);
    const values = Object.values(canvasData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Canvas.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<CanvasData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Canvas.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<CanvasData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Canvas.tableName} WHERE page_id = ? AND is_active = 1 ORDER BY created_date DESC LIMIT 1`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      const canvasData = await result.getFirstAsync();
      return canvasData as CanvasData | null;
    } finally {
      await statement.finalizeAsync();
    }
},

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `UPDATE ${Canvas.tableName} SET is_active = 0 WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const;