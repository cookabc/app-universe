import {updateRow} from "~/database";
import {Response} from "~/types/response";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as { id: string; name: string };
    const sql = `
        UPDATE session
        SET name = '${body.name}'
        WHERE id = ${body.id} AND deleted_at IS NULL
    `
    await updateRow(sql);
    return {code: 0, data: {}, message: 'OK'} as Response;
});
