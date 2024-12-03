"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeams = exports.createteam = void 0;
const team_model_1 = __importDefault(require("./team.model"));
const createteam = (teamBody) => __awaiter(void 0, void 0, void 0, function* () {
    const team = {
        name: teamBody.name,
        description: teamBody.description,
    };
    return team_model_1.default.create(team);
});
exports.createteam = createteam;
const getTeams = () => __awaiter(void 0, void 0, void 0, function* () {
    const team = yield team_model_1.default.find();
    return team;
});
exports.getTeams = getTeams;
//# sourceMappingURL=team.service.js.map