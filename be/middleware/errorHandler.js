const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.name}: ${err.message}`);
  console.error(err.stack);

  // Sequelize 에러
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: {
        code: 'DUPLICATE_ENTRY',
        message: '이미 존재하는 데이터입니다.',
        field: err.errors?.[0]?.path,
      },
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: '입력값이 유효하지 않습니다.',
        details: err.errors?.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      },
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'FOREIGN_KEY_ERROR',
        message: '참조하는 데이터가 존재하지 않습니다.',
      },
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: '데이터베이스 오류가 발생했습니다.',
      },
    });
  }

  // JWT 에러
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '유효하지 않은 토큰입니다.',
      },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'TOKEN_EXPIRED',
        message: '토큰이 만료되었습니다.',
      },
    });
  }

  // Multer 파일 업로드 에러
  if (err.name === 'MulterError') {
    const multerMessages = {
      LIMIT_FILE_SIZE: '파일 크기가 너무 큽니다.',
      LIMIT_FILE_COUNT: '파일 개수가 너무 많습니다.',
      LIMIT_UNEXPECTED_FILE: '예상치 못한 파일 필드입니다.',
    };
    return res.status(400).json({
      success: false,
      error: {
        code: err.code,
        message: multerMessages[err.code] || '파일 업로드 오류가 발생했습니다.',
      },
    });
  }

  // 커스텀 에러 (status가 있는 경우)
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      error: {
        code: err.code || 'ERROR',
        message: err.message,
      },
    });
  }

  // 기타 서버 에러
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: '서버 오류가 발생했습니다.',
    },
  });
};

module.exports = errorHandler;
