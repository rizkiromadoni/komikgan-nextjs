import { Hono } from 'hono'
import { authHandler, initAuthConfig, verifyAuth, type AuthConfig } from "@hono/auth-js"
import { handle } from 'hono/vercel'
import { HTTPException } from 'hono/http-exception'
import users from '@/server/api/users'
import { authConfig } from '@/auth'
import series from '@/server/api/series'
import genres from '@/server/api/genres'

const app = new Hono().basePath('/api')
app.use("*", initAuthConfig(() => authConfig as AuthConfig))
app.use("/auth/*", authHandler())

const routes = app.route("/users", users).route("/series", series).route("/genres", genres)

app.onError((error, c) => {
    console.log(error)
    if (error instanceof HTTPException) {
        return c.json({
            message: error.message
        }, error.status)
    }

    return c.json({ message: "Internal Server Error" }, 500)
})

export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export type AppType = typeof routes