"use strict";
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");
/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.banner.create(data, { files });
    } else {
      entity = await strapi.services.banner.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.restaurant });
  },
  async update(ctx) {
    let entity;
    if (ctx.is("multipart")) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.banner.update(ctx.params, data, {
        files,
      });
    } else {
      entity = await strapi.services.banner.update(
        ctx.params,
        ctx.request.body
      );
    }
    strapi.emitToAllUsers(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.banner });
  },
};
