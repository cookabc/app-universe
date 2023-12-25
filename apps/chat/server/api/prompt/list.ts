import {getRows} from '~/database';
import {Response} from "~/types/response";

export default defineEventHandler(async (event) => {
    let sql = `
        SELECT p.id,
            pc.name    as category,
            pc."order" as category_order,
            p.title,
            p.summary,
            p.prompt,
            p."order"  as prompt_order,
            p.hot
        FROM prompt p
        JOIN prompt_category pc ON p.category_id = pc.id
        WHERE p.deleted_at is null
    `
    const name = getQuery(event).name
    if (name) {
        sql += ` AND (p.title like '%${name}%' or p.summary like '%${name}%' or p.prompt like '%${name}%')`
    }
    return {code: 0, data: await getRows(sql), message: 'OK'} as Response;
});
