import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface CompanyColumns {
  id: ColumnDefinition;
  parent_company_id: ColumnDefinition;
  company_name: ColumnDefinition;
  company_phone_number: ColumnDefinition;
  company_email: ColumnDefinition;
  business_number: ColumnDefinition;
  web_address: ColumnDefinition;
  company_logo: ColumnDefinition;
  area_title: ColumnDefinition;
  area_name_1: ColumnDefinition;
  area_name_2: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface CompanyData {
  id?: number;
  parent_company_id?: number;
  company_name?: string;
  company_phone_number?: string;
  company_email?: string;
  business_number?: string;
  web_address?: string;
  company_logo?: string;
  area_title?: string;
  area_name_1?: string;
  area_name_2?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const Company = {
  tableName: 'companies',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    parent_company_id: { type: 'INTEGER' },
    company_name: { type: 'TEXT' },
    company_phone_number: { type: 'TEXT' },
    company_email: { type: 'TEXT' },
    business_number: { type: 'TEXT' },
    web_address: { type: 'TEXT' },
    company_logo: { type: 'TEXT' },
    area_title: { type: 'TEXT' },
    area_name_1: { type: 'TEXT' },
    area_name_2: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as CompanyColumns,

  createTable: async () => {
    const columnDefinitions = Object.entries(Company.columns)
      .map(([key, value]) => `${key} ${value.type}`)
      .join(',\n');

    const query = `
      CREATE TABLE IF NOT EXISTS ${Company.tableName} (
        ${columnDefinitions}
      );
    `;

    try {
      await db.execAsync(query);
    } catch (error) {
      console.error('Error creating company table:', error);
      throw error;
    }
  },

  insert: async (companyData: CompanyData) => {
    const keys = Object.keys(companyData);
    const values = Object.values(companyData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Company.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<CompanyData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Company.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  // // Add more methods as needed
  // update: async (id: number, data: Partial<CompanyData>) => {
  //   const keys = Object.keys(data);
  //   const values = Object.values(data);
  //   const setClause = keys.map(key => `${key} = ?`).join(', ');

  //   const statement = await db.prepareAsync(
  //     `UPDATE ${Company.tableName} SET ${setClause} WHERE id = ?`
  //   );

  //   try {
  //     await statement.executeAsync([...values, id]);
  //   } finally {
  //     await statement.finalizeAsync();
  //   }
  // },

  // delete: async (id: number) => {
  //   const statement = await db.prepareAsync(
  //     `DELETE FROM ${Company.tableName} WHERE id = ?`
  //   );

  //   try {
  //     await statement.executeAsync([id]);
  //   } finally {
  //     await statement.finalizeAsync();
  //   }
  // },

  // Add more methods as needed
  update: async (id: number, data: Partial<CompanyData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Company.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Company.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 
