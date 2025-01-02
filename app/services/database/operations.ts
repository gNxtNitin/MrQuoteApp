import { openDatabase } from './init';

const db = openDatabase();

type SQLResultSet = {
  insertId: number;
  rowsAffected: number;
  rows: {
    length: number;
    _array: any[];
    item: (index: number) => any;
  };
};

export const executeQuery = (
  query: string,
  params: any[] = []
): Promise<SQLResultSet> => {
  return new Promise((resolve, reject) => {
    db.withExclusiveTransactionAsync(async(txn) => {
      await txn.execAsync(
        query
        );
    });
  });
};

// Other functions remain unchanged