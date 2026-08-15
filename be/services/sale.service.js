const { Sale } = require('../models');
const { Op } = require('sequelize');
const createSale = async ({ title, description, price, email, photo }) => {
  const sale = Sale.create({ title, description, price, email, photo });
  return sale;
};

const getSales = async ({ page = 1, size = 10, email, query }) => {
  const where = {};
  if (email) {
    where.email = email;
  }

  if (query) {
    where.title = { [Op.like]: `%${query}%` };
  }

  const offset = (page - 1) * size;
  const { rows, count } = await Sale.findAndCountAll({
    where,
    order: [['createdAt', 'desc']],
    limit: size,
    offset,
  });

  return { data: rows, count };
};

const getSalesById = async (id) => {
  const data = await Sale.findOne({ where: { id } });
  return data;
};

module.exports = { createSale, getSales, getSalesById };
