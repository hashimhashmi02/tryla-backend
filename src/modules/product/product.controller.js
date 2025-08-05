const service = require('./product.service');

exports.getFilters = () => service.getFilters();
exports.list       = query      => service.list(query);
exports.getOne     = id         => service.getOne(id);
exports.create     = data       => service.create(data);
exports.update     = (id, data) => service.update(id, data);
exports.remove     = id         => service.remove(id);
exports.search     = q          => service.search(q);
