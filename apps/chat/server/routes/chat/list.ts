import messageList from "~/database/message.list.json";
import {Response} from "~/types/response";

export default defineEventHandler(async (event) => {
    const sessionId = getQuery(event).sessionId
    const data = messageList.filter((item: any) => item.session_id === sessionId) || []
    return {code: 0, data: data, message: 'OK'} as Response;
});
