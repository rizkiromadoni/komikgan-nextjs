import { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000/")
const api = client.api

export default api