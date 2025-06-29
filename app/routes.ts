import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
    index('./routes/index.tsx'),
    route('/action/set-theme', './routes/actions/set-theme.ts'),
] satisfies RouteConfig;
