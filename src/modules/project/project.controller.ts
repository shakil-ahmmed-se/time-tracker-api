import httpStatus from 'http-status';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import ApiError from '../errors/ApiError';
import * as ProjectService from './project.service';
import { string } from 'joi';


export const createProject = catchAsync( async (req : Request , res: Response)=>{
    console.log(req.body);
    const  project = await ProjectService.createProject(req.body);
    res.status(httpStatus.CREATED).send(project);
})

export const getProjects = catchAsync( async (req : Request , res: Response)=>{
    const projects = await ProjectService.getprojects();
    res.status(200).json({ projects });
})


export const teamprojects = catchAsync(async (req: Request, res: Response) => {
  const projects = await ProjectService.teamprojects(req.params.id);
  res.status(200).json({ projects });
});
