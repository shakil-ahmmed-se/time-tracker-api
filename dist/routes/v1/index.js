"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./auth.route"));
const swagger_route_1 = __importDefault(require("./swagger.route"));
const user_route_1 = __importDefault(require("./user.route"));
const team_route_1 = __importDefault(require("./team.route"));
const timeTrack_route_1 = __importDefault(require("./timeTrack.route"));
const contact_route_1 = __importDefault(require("./contact.route"));
const project_route_1 = __importDefault(require("./project.route"));
const config_1 = __importDefault(require("../../config/config"));
const router = express_1.default.Router();
const defaultIRoute = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
    {
        path: '/project',
        route: project_route_1.default,
    },
    {
        path: '/team',
        route: team_route_1.default,
    },
    {
        path: '/time',
        route: timeTrack_route_1.default,
    },
    {
        path: '/contact',
        route: contact_route_1.default,
    },
];
const devIRoute = [
    // IRoute available only in development mode
    {
        path: '/docs',
        route: swagger_route_1.default,
    },
];
defaultIRoute.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config_1.default.env === 'development') {
    devIRoute.forEach((route) => {
        router.use(route.path, route.route);
    });
}
exports.default = router;
//# sourceMappingURL=index.js.map