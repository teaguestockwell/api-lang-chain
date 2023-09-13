/* eslint-disable @typescript-eslint/no-explicit-any */
import { getFunctionsFromSpec } from './get-functions-from-spec';

describe('getAiParamsFromApiParams', () => {
  it('get categories', () => {
    const given = {
      paths: {
        '/Categories': {
          get: {
            summary: 'Get entities from Categories',
            parameters: [
              {
                name: '$top',
                in: 'query',
                description:
                  'Show only the first n items, see [Paging - Top](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptiontop)',
                schema: {
                  type: 'integer',
                  minimum: 0,
                },
                example: 50,
              },
              {
                name: '$skip',
                in: 'query',
                description:
                  'Skip the first n items, see [Paging - Skip](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionskip)',
                schema: {
                  type: 'integer',
                  minimum: 0,
                },
              },
              {
                name: '$filter',
                description:
                  'Filter items by property values, see [Filtering](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionfilter)',
                in: 'query',
                schema: {
                  type: 'string',
                },
              },
              {
                name: '$count',
                in: 'query',
                description:
                  'Include count of items, see [Count](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptioncount)',
                schema: {
                  type: 'boolean',
                },
              },
              {
                name: '$orderby',
                description:
                  'Order items by property values, see [Sorting](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionorderby)',
                in: 'query',
                explode: false,
                schema: {
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    type: 'string',
                    enum: [
                      'CategoryID',
                      'CategoryID desc',
                      'CategoryName',
                      'CategoryName desc',
                      'Description',
                      'Description desc',
                      'Picture',
                      'Picture desc',
                    ],
                  },
                },
              },
              {
                name: '$select',
                description:
                  'Select properties to be returned, see [Select](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionselect)',
                in: 'query',
                explode: false,
                schema: {
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    type: 'string',
                    enum: [
                      'CategoryID',
                      'CategoryName',
                      'Description',
                      'Picture',
                    ],
                  },
                },
              },
              {
                name: '$expand',
                description:
                  'Expand related entities, see [Expand](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionexpand)',
                in: 'query',
                explode: false,
                schema: {
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    type: 'string',
                    enum: ['*', 'Products'],
                  },
                },
              },
            ],
          },
          post: {
            summary: '',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    title: 'Category (for create)',
                    type: 'object',
                    properties: {
                      CategoryID: {
                        type: 'integer',
                        format: 'int32',
                      },
                      CategoryName: {
                        type: 'string',
                        maxLength: 15,
                      },
                      Description: {
                        type: 'string',
                        nullable: true,
                      },
                      Picture: {
                        type: 'string',
                        format: 'base64url',
                        nullable: true,
                      },
                    },
                    required: ['CategoryID'],
                  },
                },
              },
            },
          },
        },
        '/Categories({CategoryID})': {
          parameters: [
            {
              description: 'key: CategoryID',
              in: 'path',
              name: 'CategoryID',
              required: true,
              schema: {
                type: 'integer',
                format: 'int32',
              },
            },
          ],
          get: {
            summary: 'Get entity from Categories by key',
            tags: ['Categories'],
            parameters: [
              {
                name: '$select',
                description:
                  'Select properties to be returned, see [Select](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionselect)',
                in: 'query',
                explode: false,
                schema: {
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    type: 'string',
                    enum: [
                      'CategoryID',
                      'CategoryName',
                      'Description',
                      'Picture',
                    ],
                  },
                },
              },
              {
                name: '$expand',
                description:
                  'Expand related entities, see [Expand](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionexpand)',
                in: 'query',
                explode: false,
                schema: {
                  type: 'array',
                  uniqueItems: true,
                  items: {
                    type: 'string',
                    enum: ['*', 'Products'],
                  },
                },
              },
            ],
            responses: {
              '200': {
                description: 'Retrieved entity',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/NorthwindModel.Category',
                    },
                  },
                },
              },
              '4XX': {
                $ref: '#/components/responses/error',
              },
            },
          },
          patch: {
            summary: 'Update entity in Categories',
            tags: ['Categories'],
            requestBody: {
              description: 'New property values',
              required: true,
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NorthwindModel.Category-update',
                  },
                },
              },
            },
            responses: {
              '204': {
                description: 'Success',
              },
              '4XX': {
                $ref: '#/components/responses/error',
              },
            },
          },
          delete: {
            summary: 'Delete entity from Categories',
            tags: ['Categories'],
            responses: {
              '204': {
                description: 'Success',
              },
              '4XX': {
                $ref: '#/components/responses/error',
              },
            },
          },
        },
      },
    };
    /**
     * description is omitted from each property to save space in the context window
     * ideally $ odata parameter names are sufficiently descriptive and understood by the deployed model
     * todo: this may need adjusting based on model and api flavor
     */
    const expected: any = [
      {
        openAiDef: {
          name: '0',
          description: 'Get entities from Categories',
          parameters: {
            type: 'object',
            properties: {
              $top: {
                type: 'integer',
                minimum: 0,
              },
              $skip: {
                type: 'integer',
                minimum: 0,
              },
              $filter: {
                type: 'string',
              },
              $count: {
                type: 'boolean',
              },
              $orderby: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: [
                    'CategoryID',
                    'CategoryID desc',
                    'CategoryName',
                    'CategoryName desc',
                    'Description',
                    'Description desc',
                    'Picture',
                    'Picture desc',
                  ],
                },
              },
              $select: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: [
                    'CategoryID',
                    'CategoryName',
                    'Description',
                    'Picture',
                  ],
                },
              },
              $expand: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: ['*', 'Products'],
                },
              },
            },
          },
        },
        openApiDef: {
          summary: 'Get entities from Categories',
          parameters: [
            {
              name: '$top',
              in: 'query',
              description:
                'Show only the first n items, see [Paging - Top](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptiontop)',
              schema: {
                type: 'integer',
                minimum: 0,
              },
              example: 50,
            },
            {
              name: '$skip',
              in: 'query',
              description:
                'Skip the first n items, see [Paging - Skip](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionskip)',
              schema: {
                type: 'integer',
                minimum: 0,
              },
            },
            {
              name: '$filter',
              description:
                'Filter items by property values, see [Filtering](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionfilter)',
              in: 'query',
              schema: {
                type: 'string',
              },
            },
            {
              name: '$count',
              in: 'query',
              description:
                'Include count of items, see [Count](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptioncount)',
              schema: {
                type: 'boolean',
              },
            },
            {
              name: '$orderby',
              description:
                'Order items by property values, see [Sorting](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionorderby)',
              in: 'query',
              explode: false,
              schema: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: [
                    'CategoryID',
                    'CategoryID desc',
                    'CategoryName',
                    'CategoryName desc',
                    'Description',
                    'Description desc',
                    'Picture',
                    'Picture desc',
                  ],
                },
              },
            },
            {
              name: '$select',
              description:
                'Select properties to be returned, see [Select](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionselect)',
              in: 'query',
              explode: false,
              schema: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: [
                    'CategoryID',
                    'CategoryName',
                    'Description',
                    'Picture',
                  ],
                },
              },
            },
            {
              name: '$expand',
              description:
                'Expand related entities, see [Expand](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionexpand)',
              in: 'query',
              explode: false,
              schema: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: ['*', 'Products'],
                },
              },
            },
          ],
        },
        method: 'GET',
        path: '/Categories',
      },
      {
        openAiDef: {
          name: '1',
          description: '',
          parameters: {
            type: 'object',
            properties: {
              CategoryID: {
                type: 'integer',
                format: 'int32',
              },
              CategoryName: {
                type: 'string',
                maxLength: 15,
              },
              Description: {
                type: 'string',
                nullable: true,
              },
              Picture: {
                type: 'string',
                format: 'base64url',
                nullable: true,
              },
            },
          },
        },
        openApiDef: {
          summary: '',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  title: 'Category (for create)',
                  type: 'object',
                  properties: {
                    CategoryID: {
                      type: 'integer',
                      format: 'int32',
                    },
                    CategoryName: {
                      type: 'string',
                      maxLength: 15,
                    },
                    Description: {
                      type: 'string',
                      nullable: true,
                    },
                    Picture: {
                      type: 'string',
                      format: 'base64url',
                      nullable: true,
                    },
                  },
                  required: ['CategoryID'],
                },
              },
            },
          },
        },
        method: 'POST',
        path: '/Categories',
      },
      {
        openAiDef: {
          name: '2',
          description: 'Get entity from Categories by key',
          parameters: {
            type: 'object',
            properties: {
              CategoryID: {
                type: 'integer',
                format: 'int32',
              },
              $select: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: [
                    'CategoryID',
                    'CategoryName',
                    'Description',
                    'Picture',
                  ],
                },
              },
              $expand: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: ['*', 'Products'],
                },
              },
            },
          },
        },
        openApiDef: {
          summary: 'Get entity from Categories by key',
          tags: ['Categories'],
          parameters: [
            {
              name: '$select',
              description:
                'Select properties to be returned, see [Select](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionselect)',
              in: 'query',
              explode: false,
              schema: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: [
                    'CategoryID',
                    'CategoryName',
                    'Description',
                    'Picture',
                  ],
                },
              },
            },
            {
              name: '$expand',
              description:
                'Expand related entities, see [Expand](http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_SystemQueryOptionexpand)',
              in: 'query',
              explode: false,
              schema: {
                type: 'array',
                uniqueItems: true,
                items: {
                  type: 'string',
                  enum: ['*', 'Products'],
                },
              },
            },
          ],
          responses: {
            '200': {
              description: 'Retrieved entity',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/NorthwindModel.Category',
                  },
                },
              },
            },
            '4XX': {
              $ref: '#/components/responses/error',
            },
          },
        },
        method: 'GET',
        path: '/Categories({CategoryID})',
      },
      {
        openAiDef: {
          name: '4',
          description: 'Delete entity from Categories',
          parameters: {
            type: 'object',
            properties: {
              CategoryID: {
                type: 'integer',
                format: 'int32',
              },
            },
          },
        },
        openApiDef: {
          summary: 'Delete entity from Categories',
          tags: ['Categories'],
          responses: {
            '204': {
              description: 'Success',
            },
            '4XX': {
              $ref: '#/components/responses/error',
            },
          },
        },
        method: 'DELETE',
        path: '/Categories({CategoryID})',
      },
    ];
    const logger = jest.fn();

    const actual = getFunctionsFromSpec({ logger, spec: given as any });

    expect(actual).toEqual(expected);
  });
});
