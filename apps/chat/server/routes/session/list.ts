import sessionList from '~/database/session.list.json';
import {Response} from "~/types/response";

export default defineEventHandler(async () => {
    return {code: 0, data: sessionList, message: 'OK'} as Response;
});
