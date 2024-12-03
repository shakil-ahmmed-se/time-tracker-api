import httpStatus from "http-status";
import { Request, response, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as timeTrackService from './timeTrack.service';


export const createtimeTrack = catchAsync ( async (req : Request , res: Response)=>{
    const timeTrack = await timeTrackService.createtimeTrack(req.body);
    res.send(timeTrack);
})


export const getalltimetruck = catchAsync(async(req : Request , res: Response)=>{
    const AlltimeTrack = await timeTrackService.getalltimetruck();
    res.send(AlltimeTrack)
})


export const getUserWorkHourDayAndMonth = catchAsync(async(req: Request , res: Response)=>{
    const { userId } = req.params;
    const todayRecords= await timeTrackService.getUserWorkHourDayAndMonth(userId);
    res.send(todayRecords);
})

export const todayprogress = catchAsync(async(req: Request ,res:Response)=>{
    const {userId} = req.params;
    const todaydataprogress =  await timeTrackService.todayprogress(userId);
    res.send(todaydataprogress);
})


export const monthgraphdata = catchAsync(async(req:Request,res:Response)=>{
    const {userId} = req.params;
    const monthgraohdata = await timeTrackService.monthgraphdata(userId);
    res.send(monthgraohdata);
})

export const weekgraphdata = catchAsync(async(req : Request, res:Response)=>{
    const {userId} = req.params;
    const weekgraphdata = await timeTrackService.weekgraphdata(userId);
    res.send(weekgraphdata);
})
