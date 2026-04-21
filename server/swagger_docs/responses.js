const responses = {
  // 401 unauthorized
  UnauthorizedError: {
    description: 'Unauthorized',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Unauthorized',
            },
          },
        },
      },
    },
  },
  // 400 invalid
  BadRequestError: {
    description: 'Bad Request',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Bad Request',
            },
          },
        },
      },
    },
  },
  // 404 notFound
  NotFoundError: {
    description: 'Not Found',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Not Found',
            },
          },
        },
      },
    },
  },
  // 500 internal
  InternalServerError: {
    description: 'Internal Server Error',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Internal Server Error',
            },
          },
        },
      },
    },
  },
  // 403 forbidden
  ForbiddenError: {
    description: 'Forbidden',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Forbidden',
            },
          },
        },
      },
    },
  },
};
module.exports = {responses};
