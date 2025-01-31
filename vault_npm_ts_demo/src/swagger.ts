import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Vault API Documentation',
        version: '1.0.0',
        description: 'API documentation for Vault Secret Management',
    },
    servers: [
        {
            url: 'http://localhost:6710',
            description: 'Local server'
        }
    ],
    paths: {
        '/aubi/comp/6710/spring2025/test': {
            get: {
                summary: 'Test the server',
                description: 'Returns a message confirming the server is working',
                responses: {
                    200: {
                        description: 'Successful response',
                        content: {
                            'text/plain': {
                                schema: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/aubi/comp/6710/spring2025/list-secrets': {
            get: {
                summary: 'List all secrets',
                description: 'Returns a list of all stored secrets in Vault',
                responses: {
                    200: {
                        description: 'Successful response with secret list',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/aubi/comp/6710/spring2025/fetch-specific-secret/{path}': {
            get: {
                summary: 'Fetch a specific secret',
                description: 'Fetches a specific secret from Vault based on the provided path',
                parameters: [
                    {
                        name: 'path',
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string',
                        },
                        description: 'Path of the secret to fetch',
                    },
                ],
                responses: {
                    200: {
                        description: 'Successful response with secret data',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
        '/aubi/comp/6710/spring2025/create-secret': {
            post: {
                summary: 'Create a new secret',
                description: 'Stores a new secret in Vault',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    path: {
                                        type: 'string',
                                        example: 'data3'
                                    },
                                    data: {
                                        type: 'object',
                                        properties: {
                                            username: {
                                                type: 'string',
                                                example: 'test3'
                                            },
                                            password: {
                                                type: 'string',
                                                example: '12313'
                                            }
                                        },
                                        required: ['username', 'password']
                                    },
                                },
                                required: ['path', 'data'],
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Secret created successfully',
                    },
                    400: {
                        description: 'Bad request, missing parameters',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./vault_client_express.ts'], // Ensure this points to your main file where routes are defined
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
