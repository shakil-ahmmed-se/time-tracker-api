
import mongoose, { Collection, set } from 'mongoose';
import { Newteam } from './team.interfaces';
import Team from './team.model';


export const createteam = async(teamBody : Newteam) =>{
    const team = {
        name: teamBody.name,
        description: teamBody.description,
      };
    return Team.create(team);
}


export  const getTeams = async() =>{
  const team = await Team.find();
  return team;
}