"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'GT-Original-Logger API  documents',
        version: '0.0.1',
        description: 'GT-Original-Logger API  documents',
        license: {
            name: 'MIT',
        },
    },
    servers: [
        {
            url: `http://localhost:${config_1.default.port}/v1`,
            description: 'Development Server',
        },
    ],
};
exports.default = swaggerDefinition;
//# sourceMappingURL=swagger.definition.js.map