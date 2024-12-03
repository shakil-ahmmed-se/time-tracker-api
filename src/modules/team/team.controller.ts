import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { TeamService } from '.';



export const createteam = catchAsync( async (req : Request , res: Response)=>{
    const  project = await TeamService.createteam(req.body);
    res.status(httpStatus.CREATED).send(project);
})


export const getTeams = catchAsync( async(req :Request, res: Response)=>{
    const teams = await TeamService.getTeams();
    res.status(200).json(teams);
})