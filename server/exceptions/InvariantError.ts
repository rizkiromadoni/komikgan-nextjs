import { HTTPException } from "hono/http-exception";

export default class InvariantError extends HTTPException {
    constructor(message: string) {
        super(400, { message })
    }
}