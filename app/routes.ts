import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
    index('./routes/index.tsx'),
    route('/trips/:tripId', './routes/trip-details-page.tsx'),
    route('/location/:locationName', './routes/location-details-page.tsx'),
    route('/action/set-theme', './routes/actions/set-theme.ts'),

    route('*', './routes/_404.tsx'),
] satisfies RouteConfig;
