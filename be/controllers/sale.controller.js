const service = require('../services/sale.service');

const createSale = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('상품의 사진은 필수입니다.');
      error.status = 400;
      throw error;
    }

    const { title, description, price } = req.body;
    const email = req.email;
    const photo = req.file.filename;

    const sale = await service.createSale({
      title,
      description,
      price: parseInt(price),
      email,
      photo,
    });

    res
      .status(200)
      .json({ success: true, data: sale, message: '판매 등록 성공' });
  } catch (error) {
    next(error);
  }
};

const getSales = async (req, res, next) => {
  try {
    const { page, size, email, query } = req.query;
    const { data, count } = await service.getSales({
      page: parseInt(page) || 1,
      size: parseInt(size) || 10,
      email,
      query,
    });
    res.json({ success: true, data, count, message: '조회 성공' });
  } catch (error) {
    next(error);
  }
};

const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await service.getSalesById(id);
    res.json({ success: true, data, message: '조회 성공' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSale, getSales, getSaleById };
