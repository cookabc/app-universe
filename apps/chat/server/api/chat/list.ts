import {getRows} from "~/database";
import {Response} from "~/types/response";

export default defineEventHandler(async (event) => {
    const sessionId = getQuery(event).sessionId
    const sql = `
        SELECT prompt, response
        FROM message
        WHERE session_id = ${sessionId}
          AND deleted_at IS NULL
        ORDER BY created_at
    `
    return {code: 0, data: await getRows(sql), message: 'OK'} as Response;
});
