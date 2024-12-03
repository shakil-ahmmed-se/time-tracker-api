import mongoose, { Collection, set } from 'mongoose';
import { NewProject } from './project.interfaces';
import Project from './project.model';



export const createProject = async(projectBody : NewProject) =>{
    const project = {
        name: projectBody.name,
        description: projectBody.description,
        color: projectBody.color,
        client_id: projectBody.client_id,
        assign_user:projectBody.assign_user,
        assign_teams: projectBody.assign_teams,
        status: "paused",
        start_Project: new Date(),
        end_project: null,
      };
    return Project.create(project);
}


export const getprojects = async () => {
    const projects = await Project.find({ status: { $ne: 'end' } });
    return projects;
};

export const teamprojects = async (id: string) => {
    const projects = await Project.find({ assign_teams: id, end_project: null });
    return projects;
};

