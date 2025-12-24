const Joi = require('joi');

/**
 * Custom ValidationError class
 */
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validasi upload file SQL
 */
function validateUpload(file) {
  if (!file) {
    throw new ValidationError('No file uploaded');
  }

  if (!file.originalname.toLowerCase().endsWith('.sql')) {
    throw new ValidationError('File must be SQL format (.sql)');
  }

  if (file.size === 0) {
    throw new ValidationError('File cannot be empty');
  }

  if (file.size > 10 * 1024 * 1024) { // 10 MB
    throw new ValidationError('File size must be less than 10 MB');
  }

  return true;
}

/**
 * Validasi database structure yang di-extract
 */
function validateDatabaseStructure(database) {
  const schema = Joi.object({
    tables: Joi.array()
      .min(1)
      .required()
      .messages({
        'array.min': 'Database must contain at least 1 table'
      }),
    relationships: Joi.array().required(),
    externalEntities: Joi.array().required(),
    processes: Joi.array().required()
  });

  const { error, value } = schema.validate(database);
  if (error) {
    throw new ValidationError(`Invalid database structure: ${error.message}`);
  }

  return value;
}

/**
 * Validasi table structure
 */
function validateTable(table) {
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    displayName: Joi.string().required(),
    columns: Joi.array().min(1).required(),
    type: Joi.string().valid('dataStore').required(),
    description: Joi.string().optional()
  });

  const { error, value } = schema.validate(table);
  if (error) {
    throw new ValidationError(`Invalid table structure: ${error.message}`);
  }

  return value;
}

/**
 * Validasi column structure
 */
function validateColumn(column) {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    size: Joi.string().optional(),
    isPrimaryKey: Joi.boolean().required(),
    isNullable: Joi.boolean().required(),
    isAutoIncrement: Joi.boolean().required(),
    isForeignKey: Joi.boolean().required(),
    foreignKeyRef: Joi.string().optional()
  });

  const { error, value } = schema.validate(column);
  if (error) {
    throw new ValidationError(`Invalid column structure: ${error.message}`);
  }

  return value;
}

/**
 * Validasi DFD data
 */
function validateDFDData(dfdData) {
  const schema = Joi.object({
    level: Joi.number().min(0).max(3).required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    elements: Joi.array()
      .min(1)
      .required()
      .items(
        Joi.object({
          id: Joi.string().required(),
          type: Joi.string().valid('process', 'dataStore', 'externalEntity').required(),
          name: Joi.string().optional(),
          displayName: Joi.string().required(),
          description: Joi.string().optional()
        })
      ),
    flows: Joi.array()
      .required()
      .items(
        Joi.object({
          id: Joi.string().required(),
          from: Joi.string().required(),
          to: Joi.string().required(),
          label: Joi.string().required(),
          dataElements: Joi.array().required()
        })
      ),
    relationships: Joi.array().optional()
  });

  const { error, value } = schema.validate(dfdData);
  if (error) {
    throw new ValidationError(`Invalid DFD data: ${error.message}`);
  }

  return value;
}

/**
 * Middleware error handler
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: err.message,
      type: 'ValidationError'
    });
  }

  if (err.message && err.message.includes('Only SQL files are allowed')) {
    return res.status(400).json({
      success: false,
      message: err.message,
      type: 'FileError'
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

module.exports = {
  ValidationError,
  validateUpload,
  validateDatabaseStructure,
  validateTable,
  validateColumn,
  validateDFDData,
  errorHandler
};
