import { HTTPException } from "hono/http-exception";

export default class AuthorizationError extends HTTPException {
    constructor(message: string) {
        super(403, { message })
    }
}