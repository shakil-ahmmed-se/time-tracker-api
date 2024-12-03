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
exports.weekgraphdata = exports.monthgraphdata = exports.todayprogress = exports.getUserWorkHourDayAndMonth = exports.getalltimetruck = exports.createtimeTrack = void 0;
const timeTrack_model_1 = __importDefault(require("./timeTrack.model"));
const project_model_1 = __importDefault(require("../project/project.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createtimeTrack = (timeTrackBody) => __awaiter(void 0, void 0, void 0, function* () {
    const timetrack = {
        userId: timeTrackBody.userId,
        projectId: timeTrackBody.projectId,
        start_time: timeTrackBody.start_time,
        end_time: timeTrackBody.end_time,
        total_time: timeTrackBody.total_time,
        extra_task: timeTrackBody.extra_task,
        created_at: new Date(),
    };
    return timeTrack_model_1.default.create(timetrack);
});
exports.createtimeTrack = createtimeTrack;
const getalltimetruck = () => __awaiter(void 0, void 0, void 0, function* () {
    const alltimeTrack = yield timeTrack_model_1.default.find();
    return alltimeTrack;
});
exports.getalltimetruck = getalltimetruck;
const getUserWorkHourDayAndMonth = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        // Start of this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        // Start of tomorrow date
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        // Current date and time
        const currentDate = new Date();
        // Query the database for today records for the given userId
        const todayRecords = yield timeTrack_model_1.default.find({
            userId,
            start_time: { $gte: startOfToday, $lt: startOfTomorrow },
        });
        // Query the database for the current month records for the given userId
        const monthlyRecords = yield timeTrack_model_1.default.find({
            userId,
            start_time: { $gte: startOfMonth, $lt: currentDate },
        });
        // Function to convert 'HH:MM:SS' string to seconds
        const timeToSeconds = (time) => {
            const [hours, minutes, seconds] = time.split(':').map(Number);
            return hours * 3600 + minutes * 60 + seconds;
        };
        // Calculate total time for today in seconds
        let totalTimeInSecondsToday = 0;
        todayRecords.forEach(record => {
            if (record.total_time) {
                totalTimeInSecondsToday += timeToSeconds(record.total_time);
            }
        });
        // Calculate total time for the current month in seconds
        let totalTimeInSecondsMonth = 0;
        monthlyRecords.forEach(record => {
            if (record.total_time) {
                totalTimeInSecondsMonth += timeToSeconds(record.total_time);
            }
        });
        // Convert total time for today to hours, minutes, seconds
        const hoursToday = Math.floor(totalTimeInSecondsToday / 3600);
        const minutesToday = Math.floor((totalTimeInSecondsToday % 3600) / 60);
        const secondsToday = totalTimeInSecondsToday % 60;
        // Convert total time for the current month to hours, minutes, seconds
        const hoursMonth = Math.floor(totalTimeInSecondsMonth / 3600);
        const minutesMonth = Math.floor((totalTimeInSecondsMonth % 3600) / 60);
        const secondsMonth = totalTimeInSecondsMonth % 60;
        // Calculate the number of distinct days the user worked in the current month
        const distinctWorkDays = new Set();
        monthlyRecords.forEach(record => {
            if (record.start_time) {
                const dateString = new Date(record.start_time).toISOString().split('T')[0]; // YYYY-MM-DD
                distinctWorkDays.add(dateString);
            }
        });
        const TotalMonthWorkingDay = distinctWorkDays.size;
        const todytitle = "Today works Hour";
        const monthworkingtitle = "This month working day";
        const monthworkingHourstitle = "This month working hours";
        return { todytitle, monthworkingtitle, monthworkingHourstitle, hoursToday, minutesToday, secondsToday, hoursMonth, minutesMonth, secondsMonth, TotalMonthWorkingDay };
    }
    catch (error) {
        console.error("Error fetching today's time tracking data:", error);
        throw error;
    }
});
exports.getUserWorkHourDayAndMonth = getUserWorkHourDayAndMonth;
const todayprogress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        // Start of tomorrow
        const startOfTomorrow = new Date();
        startOfTomorrow.setHours(0, 0, 0, 0);
        startOfTomorrow.setDate(startOfToday.getDate() + 1);
        // query the timeTrack  for today records
        const todayRecords = yield timeTrack_model_1.default.find({
            userId,
            start_time: { $gte: startOfToday, $lt: startOfTomorrow },
        });
        // Query the user projects
        const userProjects = yield project_model_1.default.find({ assign_user: userId });
        // Map through todayRecords 
        const result = todayRecords.map((record) => {
            // Check if projectId exists before trying to access it
            const project = record.projectId
                ? userProjects.find((project) => { var _a; return project._id.toString() === ((_a = record.projectId) === null || _a === void 0 ? void 0 : _a.toString()); })
                : null;
            return {
                start_time: record.start_time,
                end_time: record.end_time,
                total_time: record.total_time,
                project_name: project ? project.name : null,
                project_color: project ? project.color : null,
                extra_task: record.projectId === null ? record.extra_task : null,
            };
        });
        const extractTimes = (records) => {
            return records.map((record) => {
                const formatTimeInGMT6 = (date) => {
                    // Convert the date to GMT+6 using Intl.DateTimeFormat
                    const options = {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Dhaka",
                    };
                    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);
                    return formattedTime;
                };
                const convertTotalTimeseconds = (totaltime) => {
                    const [hours, minites, seconds] = totaltime.split(":").map(Number);
                    return (hours * 3600) + (minites * 60) + seconds;
                };
                const startTime = record.start_time ? formatTimeInGMT6(new Date(record.start_time)) : "";
                const endTime = record.end_time ? formatTimeInGMT6(new Date(record.end_time)) : "";
                const TotalTimeSeconds = record.total_time ? convertTotalTimeseconds(record.total_time) : "";
                return {
                    start_time: startTime,
                    end_time: endTime,
                    total_time: record.total_time,
                    project_name: record.project_name,
                    project_color: record.project_color,
                    extra_task: record.extra_task,
                    TotalTimeSeconds: TotalTimeSeconds
                };
            });
        };
        const progressdata = extractTimes(result);
        return progressdata;
    }
    catch (error) {
        console.error('Error fetching today’s progress:', error);
        throw new Error('Failed to fetch today’s progress.');
    }
});
exports.todayprogress = todayprogress;
const monthgraphdata = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Start of the month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        // Current date
        const currentDate = new Date();
        const results = yield timeTrack_model_1.default.aggregate([
            {
                $match: {
                    userId: new mongoose_1.default.Types.ObjectId(userId),
                    start_time: { $gte: startOfMonth, $lte: currentDate },
                },
            },
            {
                $project: {
                    day: { $dayOfMonth: "$start_time" },
                    total_time: 1,
                },
            },
            {
                $addFields: {
                    total_seconds: {
                        $let: {
                            vars: {
                                timeParts: {
                                    $split: ["$total_time", ":"],
                                },
                            },
                            in: {
                                $add: [
                                    { $multiply: [{ $toInt: { $arrayElemAt: ["$$timeParts", 0] } }, 3600] },
                                    { $multiply: [{ $toInt: { $arrayElemAt: ["$$timeParts", 1] } }, 60] },
                                    { $toInt: { $arrayElemAt: ["$$timeParts", 2] } },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $group: {
                    _id: "$day",
                    totalSeconds: { $sum: "$total_seconds" },
                },
            },
            {
                $project: {
                    day: "$_id",
                    totalHours: { $divide: ["$totalSeconds", 3600] },
                },
            },
            {
                $sort: { day: 1 },
            },
        ]);
        // const dailyData = results.map((item) => ({
        //     day: item.day,
        //     totalHours: item.totalHours.toFixed(2),
        // }));
        // // console.log(dailyData);
        return results;
    }
    catch (error) {
        console.error("Error fetching month graph data:", error);
        throw error;
    }
});
exports.monthgraphdata = monthgraphdata;
const weekgraphdata = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Start of the week (Saturday)
    const startOfWeek = new Date();
    const currentDay = startOfWeek.getDay();
    const distanceFromSaturday = currentDay === 6 ? 0 : currentDay + 1;
    startOfWeek.setDate(startOfWeek.getDate() - distanceFromSaturday);
    startOfWeek.setHours(0, 0, 0, 0);
    // End of the week (Friday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const results = yield timeTrack_model_1.default.aggregate([
        {
            $match: {
                userId: new mongoose_1.default.Types.ObjectId(userId),
                start_time: { $gte: startOfWeek, $lte: endOfWeek },
            },
        },
        {
            $project: {
                day: { $dayOfMonth: "$start_time" },
                total_time: 1,
            },
        },
        {
            $addFields: {
                total_seconds: {
                    $let: {
                        vars: {
                            timeParts: {
                                $split: ["$total_time", ":"],
                            },
                        },
                        in: {
                            $add: [
                                { $multiply: [{ $toInt: { $arrayElemAt: ["$$timeParts", 0] } }, 3600] },
                                { $multiply: [{ $toInt: { $arrayElemAt: ["$$timeParts", 1] } }, 60] },
                                { $toInt: { $arrayElemAt: ["$$timeParts", 2] } },
                            ],
                        },
                    },
                },
            },
        },
        {
            $group: {
                _id: "$day",
                totalSeconds: { $sum: "$total_seconds" },
            },
        },
        {
            $project: {
                day: "$_id",
                totalHours: { $divide: ["$totalSeconds", 3600] },
            },
        },
        {
            $sort: { day: 1 },
        },
    ]);
    return results;
});
exports.weekgraphdata = weekgraphdata;
//# sourceMappingURL=timeTrack.service.js.map