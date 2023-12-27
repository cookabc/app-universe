import promptList from '~/database/prompt.list.json';
import {Response} from "~/types/response";

export default defineEventHandler(async () => {
    return {code: 0, data: promptList, message: 'OK'} as Response;
});
