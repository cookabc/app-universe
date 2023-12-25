import sqlite3 from 'sqlite3';

export const DB = new sqlite3.Database('app.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the APP database.');
});


export const getRows = function (sql: string) {
    return new Promise(function (resolve, reject) {
        DB.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

export const getRow = function (sql: string) {
    return new Promise(function (resolve, reject) {
        DB.get(sql, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

export const updateRow = function (sql: string) {
    return new Promise<void>(function (resolve, reject) {
        DB.run(sql, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


export const updateRowWithReturnId = function (sql: string) {
    return new Promise<number>((resolve, reject) => {
        DB.run(sql, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}
