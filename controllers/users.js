const bcrypt = require('bcryptjs');

const { JWT_SECRET = 'some-secret-key' } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

module.exports.editUserData = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: 'true', runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователя с таким _id не существует');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации полей'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      email: user.email, name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка валидации полей'));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};
