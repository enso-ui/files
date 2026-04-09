import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter.fromGlob(import.meta.glob('./administration/*.js', { eager: true }));

export default {
    path: '/administration',
    children: routes,
};
