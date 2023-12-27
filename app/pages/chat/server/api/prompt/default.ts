import {getRows} from "~/database";
import {Response} from "~/types/response";

export default defineEventHandler(async () => {
    const sql = 'SELECT id, prompt, assistant FROM prompt_default WHERE deleted_at is null;'
    return {code: 0, data: await getRows(sql), message: 'OK'} as Response;
});
