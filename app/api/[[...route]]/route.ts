import users from '@/server/api/users'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

const routes = app.route("/users", users)

app.onError((error, c) => {
    if (error instanceof HTTPException) {
        return c.json({
            message: error.message
        }, error.status)
    }

    return c.json({ message: "Internal Server Error" }, 500)
})

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof routes