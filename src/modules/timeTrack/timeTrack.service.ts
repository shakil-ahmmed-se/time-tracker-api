

import { object, string } from "joi";
import { NewtimeTrack } from "./timeTrack.interfaces";
import timeTrack from "./timeTrack.model";
import Project from "../project/project.model"
import mongoose, { Collection, ObjectId } from "mongoose";
import moment from "moment";

export const createtimeTrack = async (timeTrackBody: NewtimeTrack) => {
    const timetrack = {
        userId: timeTrackBody.userId,
        projectId: timeTrackBody.projectId,
        start_time: timeTrackBody.start_time,
        end_time: timeTrackBody.end_time,
        total_time: timeTrackBody.total_time,
        extra_task: timeTrackBody.extra_task,
        created_at: new Date(),
    }
    return timeTrack.create(timetrack);
}


export const getalltimetruck = async () => {
    const alltimeTrack = await timeTrack.find();
    return alltimeTrack;
};


export const getUserWorkHourDayAndMonth = async (userId: string) => {
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
        const todayRecords = await timeTrack.find({
            userId,
            start_time: { $gte: startOfToday, $lt: startOfTomorrow },
        });
        // Query the database for the current month records for the given userId
        const monthlyRecords = await timeTrack.find({
            userId,
            start_time: { $gte: startOfMonth, $lt: currentDate },
        });


        // Function to convert 'HH:MM:SS' string to seconds
        const timeToSeconds = (time: string) => {
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
        const distinctWorkDays = new Set<string>();


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
    } catch (error) {
        console.error("Error fetching today's time tracking data:", error);
        throw error;
    }
};

interface ProgressData {
    start_time: string;
    end_time: string;
}

export const todayprogress = async (userId: string) => {
    try {
        // Start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Start of tomorrow
        const startOfTomorrow = new Date();
        startOfTomorrow.setHours(0, 0, 0, 0);
        startOfTomorrow.setDate(startOfToday.getDate() + 1);

        // query the timeTrack  for today records
        const todayRecords = await timeTrack.find({
            userId,
            start_time: { $gte: startOfToday, $lt: startOfTomorrow },
        });

        // Query the user projects
        const userProjects = await Project.find({ assign_user: userId });

        // Map through todayRecords 
        const result = todayRecords.map((record) => {
            // Check if projectId exists before trying to access it
            const project = record.projectId
                ? userProjects.find((project) => project._id.toString() === record.projectId?.toString())
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

        const extractTimes = (records: typeof result): ProgressData[] => {
            return records.map((record) => {
                const formatTimeInGMT6 = (date: Date) => {
                    // Convert the date to GMT+6 using Intl.DateTimeFormat
                    const options: Intl.DateTimeFormatOptions = {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                        timeZone: "Asia/Dhaka",
                    };

                    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);
                    return formattedTime;
                };

                const convertTotalTimeseconds = (totaltime: string) => {
                    const [hours, minites, seconds] = totaltime.split(":").map(Number);
                    return (hours * 3600) + (minites * 60) + seconds;
                }

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

    } catch (error) {
        console.error('Error fetching today’s progress:', error);
        throw new Error('Failed to fetch today’s progress.');
    }
};




export const monthgraphdata = async (userId: string) => {
    try {
        // Start of the month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Current date
        const currentDate = new Date();

        const results = await timeTrack.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
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
    } catch (error) {
        console.error("Error fetching month graph data:", error);
        throw error;
    }
};



export const weekgraphdata=async(userId: string)=>{

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

     const results = await timeTrack.aggregate([
         {
             $match: {
                 userId: new mongoose.Types.ObjectId(userId),
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
}









