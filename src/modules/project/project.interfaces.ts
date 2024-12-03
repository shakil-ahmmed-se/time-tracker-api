import mongoose,{Model,Document} from "mongoose";

export interface  Iproject{
    name?: string;
    description?: string;
    color?: string;
    client_id?: string;
    assign_user: mongoose.Types.ObjectId[];
    assign_teams: mongoose.Types.ObjectId[];
    status?:string;
    start_Project?:Date;
    end_project?:Date;
}


export type NewProject = Iproject;