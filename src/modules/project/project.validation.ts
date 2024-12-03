import Joi from 'joi';

const CreateProjectBody = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    color: Joi.string(),
    client_id: Joi.string(),
    assign_user:Joi.array().items(Joi.string()).optional().allow(null),
    assign_teams: Joi.array().items(Joi.string()).optional().allow(null),
    status: Joi.string(),
    start_Project: Joi.date(),
    end_project: Joi.date().optional().allow(null, ''),
});



export const createProject = {
    body: CreateProjectBody,
};


export const getproject = {
    query: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
        color: Joi.string(),
        client_id: Joi.string(),
        assign_user:Joi.array().items(Joi.string()).optional().allow(null),
        assign_teams: Joi.array().items(Joi.string()).optional().allow(null),
        status: Joi.string(),
        start_Project: Joi.date(),
        end_project: Joi.date(),
    }),
};


export const teamProjects ={
    params: Joi.object().keys({
        id: Joi.string(),
      }),
}