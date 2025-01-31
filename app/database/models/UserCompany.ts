import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface UserCompanyColumns {
  user_id: ColumnDefinition;
  company_id: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface UserCompanyData {
  user_id: number;
  company_id: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number | null;
  modified_date?: string | null;
}

export const UserCompany = {
  tableName: 'user_company',

  columns: {
    user_id: { type: 'INTEGER' },
    company_id: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as UserCompanyColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${UserCompany.tableName} (
        ${Object.entries(UserCompany.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (company_id) REFERENCES companies(id)
      );
    `;
    await db.execAsync(query);
    // console.log.log('UserCompany table created');
  },

  insert: async (data: UserCompanyData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');
    // console.log.log('UserCompany inserting...');

    const query = `
      INSERT INTO ${UserCompany.tableName} (${keys.join(',')})
      VALUES (${placeholders});
    `;
    await db.runAsync(query, values);
    // console.log.log('UserCompany inserted');
  },

  getById: async (userId: number, companyId: number): Promise<UserCompanyData | null> => {
    const query = `SELECT * FROM ${UserCompany.tableName} WHERE user_id = ? AND company_id = ?;`;
    const result = await db.getAllAsync(query, [userId, companyId]);
    return result[0] as UserCompanyData | null;
  },

  update: async (userId: number, companyId: number, data: Partial<UserCompanyData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${UserCompany.tableName} 
       SET ${setClause} 
       WHERE user_id = ? AND company_id = ?`
    );

    try {
      await statement.executeAsync([...values, userId, companyId]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (userId: number, companyId: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${UserCompany.tableName} WHERE user_id = ? AND company_id = ?`
    );

    try {
      await statement.executeAsync([userId, companyId]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getUserCompanies: async (userId: number): Promise<UserCompanyData[]> => {
    const query = `SELECT * FROM ${UserCompany.tableName} WHERE user_id = ? AND is_active = 1;`;
    const result = await db.getAllAsync(query, [userId]);
    return result as UserCompanyData[];
  }
} as const;
