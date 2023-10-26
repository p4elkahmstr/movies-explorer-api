const { celebrate, Joi } = require('celebrate');

const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

const createMovieValidator = celebrate({
    body: Joi.object().keys({
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required().regex(urlRegex),
        trailerLink: Joi.string().required().regex(urlRegex),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),
        thumbnail: Joi.string().required().regex(urlRegex),
        movieId: Joi.number().required(),
    }),
})

const signInValidator = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().alphanum(),
    }),
})

const signUpValidator = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    }),
})

const deleteMovieValidator = celebrate({
    params: Joi.object().keys({
        movieId: Joi.string().length(24).alphanum().hex(),
    }),
})

const editUserValidator = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30),
        email: Joi.string().email(),
    }),
})

module.exports = {
    createMovieValidator,
    signInValidator,
    signUpValidator,
    deleteMovieValidator,
    editUserValidator
}