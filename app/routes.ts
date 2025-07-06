import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
    index('./routes/index.tsx'),
    route('/trips/:tripId', './routes/trips.$tripId.tsx'),
    route('/action/set-theme', './routes/actions/set-theme.ts'),
] satisfies RouteConfig;
