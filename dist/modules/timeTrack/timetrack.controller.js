"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.weekgraphdata = exports.monthgraphdata = exports.todayprogress = exports.getUserWorkHourDayAndMonth = exports.getalltimetruck = exports.createtimeTrack = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const timeTrackService = __importStar(require("./timeTrack.service"));
exports.createtimeTrack = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const timeTrack = yield timeTrackService.createtimeTrack(req.body);
    res.send(timeTrack);
}));
exports.getalltimetruck = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const AlltimeTrack = yield timeTrackService.getalltimetruck();
    res.send(AlltimeTrack);
}));
exports.getUserWorkHourDayAndMonth = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const todayRecords = yield timeTrackService.getUserWorkHourDayAndMonth(userId);
    res.send(todayRecords);
}));
exports.todayprogress = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const todaydataprogress = yield timeTrackService.todayprogress(userId);
    res.send(todaydataprogress);
}));
exports.monthgraphdata = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const monthgraohdata = yield timeTrackService.monthgraphdata(userId);
    res.send(monthgraohdata);
}));
exports.weekgraphdata = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const weekgraphdata = yield timeTrackService.weekgraphdata(userId);
    res.send(weekgraphdata);
}));
//# sourceMappingURL=timetrack.controller.js.map