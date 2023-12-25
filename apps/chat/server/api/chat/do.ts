import {updateRow, updateRowWithReturnId} from "~/database";
import {Response} from "~/types/response";

export default defineEventHandler(async (event) => {
    const body = await readBody(event) as {
        sessionId: number;
        prompt: string,
        from_id: number
    };
    // create session if not exist
    let sessionId = body.sessionId;
    if (!sessionId) {
        const sessionName = body.prompt.slice(0, 10);
        const sessionSql = `INSERT INTO session (name) VALUES ('${sessionName}') RETURNING id`;
        sessionId = await updateRowWithReturnId(sessionSql);
    }
    // create message
    const response = 'Fake Answer'
    const sql = `
        INSERT INTO message (session_id, prompt, response, is_ok, from_id)
        VALUES ('${sessionId}', '${body.prompt}', '${response}', 0, ${body.from_id || null});
    `
    await updateRow(sql);
    return {code: 0, data: response, message: 'OK'} as Response;
});
