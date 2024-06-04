'use strict';

/**
 * Backup.js controller
 *
 * @description: A set of functions called "actions" for managing `Backup`.
 */

module.exports = {

  /**
   * Retrieve backup records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.backup.search(ctx.query);
    } else {
      return strapi.services.backup.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a backup record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    return strapi.services.backup.fetch(ctx.params);
  },

  /**
   * Count backup records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.backup.count(ctx.query);
  },

  /**
   * Create a/an backup record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.backup.add(ctx.request.body);
  },

  /**
   * Destroy a/an backup record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.backup.remove(ctx.params);
  },

  /**
   * Add relation to a/an backup record.
   *
   * @return {Object}
   */

  createRelation: async (ctx, next) => {
    return strapi.services.backup.addRelation(ctx.params, ctx.request.body);
  },

  /**
   * Update relation to a/an backup record.
   *
   * @return {Object}
   */

  updateRelation: async (ctx, next) => {
    return strapi.services.backup.editRelation(ctx.params, ctx.request.body);
  },

  /**
   * Destroy relation to a/an backup record.
   *
   * @return {Object}
   */

  destroyRelation: async (ctx, next) => {
    return strapi.services.backup.removeRelation(ctx.params, ctx.request.body);
  },
};
