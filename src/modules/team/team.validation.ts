import Joi from 'joi';


const CreateTeamBody = Joi.object({
    name: Joi.string(),
    description: Joi.string(),
});

export const createTeam = {
    body: CreateTeamBody,
};

export const getteam = {
    query: Joi.object().keys({
        name: Joi.string(),
        description: Joi.string(),
    }),
};
