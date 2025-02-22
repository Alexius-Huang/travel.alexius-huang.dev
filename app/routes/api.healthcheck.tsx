import { allowMethods, json } from '~/utils/response.server';
import type { Route } from './+types/api.healthcheck';

export async function loader(_: Route.LoaderArgs) {
    return json({ message: 'App is currently running...' });
}

export const action = async ({ request }: Route.ActionArgs) => {
    allowMethods(request, ['POST']);
    return json({ message: `Triggered a ${request.method} successfully...` });
};
