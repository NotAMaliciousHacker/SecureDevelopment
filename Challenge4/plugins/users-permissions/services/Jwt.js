'use strict';

/**
 * Jwt.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require('lodash');
const jwt = require('jsonwebtoken');

const defaultJwtOptions = { expiresIn: '24h' };

module.exports = {

  getToken: async function (ctx) {
    const params = _.assign({}, ctx.request.body, ctx.request.query);

    let token = '';

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(' ');

      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];
        if (/^Bearer$/i.test(scheme)) {
          token = credentials;
        }
      } else {
        throw new Error('Invalid authorization header format. Format is Authorization: Bearer [token]');
      }
    } else if (params.token) {
      token = params.token;
    } else {
      throw new Error('No authorization header was found');
    }

    // Make sure the jwt was not blacklisted before verifying it...
    const knexQueryBuilder = strapi.connections.default.select('id').from('jwts')
    .where('jwt', '=', token);
    const resp = await knexQueryBuilder.then();
    try {
       const id = resp[0].id;
       return this.verify(token);
    } catch(error) {
       console.log('A non-existing or blacklisted token was requested to be verified: ', token);
       return false;
    }
  },

  issue: (payload, jwtOptions = {}) => {
    console.log(payload);
    _.defaults(jwtOptions, defaultJwtOptions);
    var id = payload['id'];
    console.log(id);
    var token =  jwt.sign(
      _.clone(payload.toJSON ? payload.toJSON() : payload),
      process.env.JWT_SECRET || _.get(strapi.plugins['users-permissions'], 'config.jwtSecret') || 'oursecret',
      jwtOptions,
    );
   console.log(token);
   // store the jwt for black/whitelists 
   strapi.connections.default('jwts')
       .insert
       ({id: id,
        jwt: token},
       ).catch(function (error) {
       console.error(error);
       });
   return token;
  },

  verify: (token) => {
    return new Promise(function (resolve, reject) {
      jwt.verify(
        token,
        process.env.JWT_SECRET || _.get(strapi.plugins['users-permissions'], 'config.jwtSecret') || 'oursecret',
        {},
        function (err, tokenPayload = {}) {
          if (err) {
            return reject(new Error('Invalid token.'));
          }
          resolve(tokenPayload);
        }
      );
    });
  }
};
