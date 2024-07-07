import { HTTPException } from "hono/http-exception";

export default class NotFoundError extends HTTPException {
    constructor(message: string) {
        super(404, { message })
    }
}