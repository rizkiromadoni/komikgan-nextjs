import { HTTPException } from "hono/http-exception";

export default class AuthenticationError extends HTTPException {
    constructor(message: string) {
        super(401, { message })
    }
}