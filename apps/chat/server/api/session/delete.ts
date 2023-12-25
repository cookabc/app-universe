import {updateRow} from "~/database";
import {Response} from "~/types/response";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as { id: string };
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");
    const sql = `
        UPDATE session
        SET deleted_at = '${formattedDate}'
        WHERE id = ${body.id}
    `
    await updateRow(sql);
    return {code: 0, data: {}, message: 'OK'} as Response;
});
