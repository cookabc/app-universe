import {Response} from "~/types/response";

export default defineEventHandler(async () => {
    return {code: 0, data: "Fake Answer", message: 'OK'} as Response;
});
