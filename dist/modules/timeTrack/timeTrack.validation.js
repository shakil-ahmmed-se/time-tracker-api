"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weekgraphdata = exports.monthgraphdata = exports.todayprogress = exports.getUserWorkHourDayAndMonth = exports.gettimeTrack = exports.createTimetrack = void 0;
const joi_1 = __importDefault(require("joi"));
const createtimeTrackBody = joi_1.default.object({
    userId: joi_1.default.string().optional().allow(null),
    projectId: joi_1.default.string().optional().allow(null, ''),
    start_time: joi_1.default.date(),
    end_time: joi_1.default.date(),
    total_time: joi_1.default.string(),
    extra_task: joi_1.default.string().optional().allow(null, ''),
    created_at: joi_1.default.string(),
});
exports.createTimetrack = {
    body: createtimeTrackBody,
};
exports.gettimeTrack = {
    query: joi_1.default.object().keys({
        userId: joi_1.default.string(),
        projectId: joi_1.default.string().allow(""),
        start_time: joi_1.default.date(),
        end_time: joi_1.default.date(),
        total_time: joi_1.default.string(),
        extra_task: joi_1.default.string().allow(""),
        created_at: joi_1.default.date(),
    })
};
exports.getUserWorkHourDayAndMonth = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string(),
    })
};
exports.todayprogress = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string(),
    })
};
exports.monthgraphdata = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string(),
    })
};
exports.weekgraphdata = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string(),
    })
};
//# sourceMappingURL=timeTrack.validation.js.map