import {getRows} from "~/database";
import {Response} from "~/types/response";

export default defineEventHandler(async (event) => {
    let sql = ''
    const name = getQuery(event).name
    if (name) {
        sql = `
            SELECT id, name, created_at, updated_at
            FROM session
            WHERE name LIKE %s AND deleted_at IS NULL
            ORDER BY updated_at DESC
        `
    } else {
        sql = `
            SELECT id, name, created_at, updated_at
            FROM session
            WHERE deleted_at IS NULL
            ORDER BY updated_at DESC
        `
    }
    return {code: 0, data: await getRows(sql), message: 'OK'} as Response;
});
