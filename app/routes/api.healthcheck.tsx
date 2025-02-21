import { json } from "~/utils/response";
import type { Route } from "./+types/api.healthcheck";

export function loader(_args: Route.LoaderArgs) {
    return json({ status: 'ok', message: 'App is currently running...' });
}
