'use strict';

/**
 * Backup.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');
const { exec } = require('child_process');
const Joi = require('joi');

// Strapi utilities.
const utils = require('strapi-hook-bookshelf/lib/utils/');

module.exports = {

  /**
   * Promise to fetch all backups.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('backup', params);
    // Select field to populate.
    const populate = Backup.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Backup.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value) && where.symbol !== 'IN') {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value])
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      qb.offset(filters.start);
      qb.limit(filters.limit);
    }).fetchAll({
      withRelated: populate
    });
  },

  /**
   * Promise to fetch a/an backup.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Backup.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    return Backup.forge(_.pick(params, 'id')).fetch({
      withRelated: populate
    });
  },

  /**
   * Promise to count a/an backup.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('backup', params);

    return Backup.query(function(qb) {
      _.forEach(filters.where, (where, key) => {
        if (_.isArray(where.value)) {
          for (const value in where.value) {
            qb[value ? 'where' : 'orWhere'](key, where.symbol, where.value[value]);
          }
        } else {
          qb.where(key, where.symbol, where.value);
        }
      });
    }).count();
  },

  /**
   * Promise to add a/an backup.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Backup.associations.map(ast => ast.alias));
    const data = _.omit(values, Backup.associations.map(ast => ast.alias));
    const schema = Joi.object().keys({
      name: Joi.string().regex(/.+[_][0-9]{2}[_][0-9]{2}[_][0-9]{4}$/).required(),
      pwd: Joi.string().regex(/^[a-zA-Z0-9-_=+/]{8,64}$/).required()
    });
    const result = Joi.validate({ name: values.name, pwd: values.pwd }, schema);
    if (result.error === null) {
       // Create entry with no-relational data.
       let buff = new Buffer(values.pwd, 'base64');  
       let b64dPwd = buff.toString('ascii');
       var dbname = values.name.split('_')[0];
       var scm = ` /usr/bin/mysqldump -p${b64dPwd} ${dbname} > public/uploads/${values.name}.sql`; 
       console.log(scm);
       let res = exec(scm, (error, stdout, stderr) => {
       if (error) {
           console.error(`exec error: ${error}`);
           return false;
       } else {
           console.log(`stdout: ${stdout}`);
           console.log(`stderr: ${stderr}`);
	   return true;
       }
       });
       if(res) {
          // Keep track of the db bk succesful request in the db itself
          const entry = await Backup.forge(data).save();
          return Backup.updateRelations({ id: entry.id , values: relations });
       } else {
	  return false;
       }
    } else {
       return false;
    }
  },

  /**
   * Promise to remove a/an backup.
   *
   * @return {Promise}
   */

  remove: async (params) => {
    let fobj = await strapi.services.backup.fetch(params);
    params.values = {};
    console.log(fobj.attributes.name);
    try {
       var fs = require('fs');
       var filePath = 'public/uploads/'+fobj.attributes.name+'.sql'; 
       fs.unlinkSync(filePath);
    } catch(error) {
       console.log(error);
    }
    Backup.associations.map(association => {
      switch (association.nature) {
        case 'oneWay':
        case 'oneToOne':
        case 'manyToOne':
        case 'oneToManyMorph':
          params.values[association.alias] = null;
          break;
        case 'oneToMany':
        case 'manyToMany':
        case 'manyToManyMorph':
          params.values[association.alias] = [];
          break;
        default:
      }
    });

    await Backup.updateRelations(params);

    return Backup.forge(params).destroy();
  },

  /**
   * Promise to search a/an backup.
   *
   * @return {Promise}
   */

  search: async (params) => {
    // Convert `params` object to filters compatible with Bookshelf.
    const filters = strapi.utils.models.convertParams('backup', params);
    // Select field to populate.
    const populate = Backup.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias);

    const associations = Backup.associations.map(x => x.alias);
    const searchText = Object.keys(Backup._attributes)
      .filter(attribute => attribute !== Backup.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['string', 'text'].includes(Backup._attributes[attribute].type));

    const searchNoText = Object.keys(Backup._attributes)
      .filter(attribute => attribute !== Backup.primaryKey && !associations.includes(attribute))
      .filter(attribute => !['string', 'text', 'boolean', 'integer', 'decimal', 'float'].includes(Backup._attributes[attribute].type));

    const searchInt = Object.keys(Backup._attributes)
      .filter(attribute => attribute !== Backup.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['integer', 'decimal', 'float'].includes(Backup._attributes[attribute].type));

    const searchBool = Object.keys(Backup._attributes)
      .filter(attribute => attribute !== Backup.primaryKey && !associations.includes(attribute))
      .filter(attribute => ['boolean'].includes(Backup._attributes[attribute].type));

    const query = (params._q || '').replace(/[^a-zA-Z0-9.-\s]+/g, '');

    return Backup.query(qb => {
      // Search in columns which are not text value.
      searchNoText.forEach(attribute => {
        qb.orWhereRaw(`LOWER(${attribute}) LIKE '%${_.toLower(query)}%'`);
      });

      if (!_.isNaN(_.toNumber(query))) {
        searchInt.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query)}`);
        });
      }

      if (query === 'true' || query === 'false') {
        searchBool.forEach(attribute => {
          qb.orWhereRaw(`${attribute} = ${_.toNumber(query === 'true')}`);
        });
      }

      // Search in columns with text using index.
      switch (Backup.client) {
        case 'pg': {
          const searchQuery = searchText.map(attribute =>
            _.toLower(attribute) === attribute
              ? `to_tsvector(${attribute})`
              : `to_tsvector('${attribute}')`
          );

          qb.orWhereRaw(`${searchQuery.join(' || ')} @@ to_tsquery(?)`, query);
          break;
        }
        default:
          qb.orWhereRaw(`MATCH(${searchText.join(',')}) AGAINST(? IN BOOLEAN MODE)`, `*${query}*`);
          break;
      }

      if (filters.sort) {
        qb.orderBy(filters.sort.key, filters.sort.order);
      }

      if (filters.skip) {
        qb.offset(_.toNumber(filters.skip));
      }

      if (filters.limit) {
        qb.limit(_.toNumber(filters.limit));
      }
    }).fetchAll({
      width: populate
    });
  },
};
