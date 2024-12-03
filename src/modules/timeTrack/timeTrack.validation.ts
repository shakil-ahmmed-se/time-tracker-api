import Joi from 'joi';

const createtimeTrackBody = Joi.object({
    userId: Joi.string().optional().allow(null),
    projectId: Joi.string().optional().allow(null, ''),
    start_time: Joi.date(),
    end_time: Joi.date(),
    total_time: Joi.string(),
    extra_task: Joi.string().optional().allow(null, ''),
    created_at: Joi.string(),
})


export const createTimetrack = {
    body: createtimeTrackBody,
}


export const gettimeTrack = {
    query: Joi.object().keys({
        userId: Joi.string(),
        projectId: Joi.string().allow(""),
        start_time: Joi.date(),
        end_time: Joi.date(),
        total_time: Joi.string(),
        extra_task: Joi.string().allow(""),
        created_at: Joi.date(),
    })
}


export const getUserWorkHourDayAndMonth={
    params: Joi.object().keys({
        userId: Joi.string(),
    })
}

export const todayprogress={
    params: Joi.object().keys({
        userId: Joi.string(),
    })
}
export const monthgraphdata={
    params: Joi.object().keys({
        userId: Joi.string(),
    })
}


export const weekgraphdata = {
    params: Joi.object().keys({
        userId: Joi.string(),
    })
}