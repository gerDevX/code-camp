const jsonData = [
  {
    title:
      'Create an issue with every field: POST request to /api/issues/{project}',
    context: ' -> Functional Tests -> POST requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.status', '200'],
      },
      {
        method: 'equal',
        args: ['res.body.issue_title', "'Test issue'"],
      },
      {
        method: 'equal',
        args: ['res.body.issue_text', "'This is a test'"],
      },
      {
        method: 'equal',
        args: ['res.body.created_by', "'sammy'"],
      },
      {
        method: 'equal',
        args: ['res.body.assigned_to', "'sammy'"],
      },
      {
        method: 'equal',
        args: ['res.body.status_text', "'none'"],
      },
      {
        method: 'equal',
        args: ['res.body.open', 'true'],
      },
      {
        method: 'isOk',
        args: ['res.body._id'],
      },
      {
        method: 'isOk',
        args: ['res.body.created_on'],
      },
      {
        method: 'isOk',
        args: ['res.body.updated_on'],
      },
    ],
  },
  {
    title:
      'Create an issue with only required fields: POST request to /api/issues/{project}',
    context: ' -> Functional Tests -> POST requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.status', '200'],
      },
      {
        method: 'equal',
        args: ['res.body.issue_title', "'Test issue'"],
      },
      {
        method: 'equal',
        args: ['res.body.issue_text', "'This is a test'"],
      },
      {
        method: 'equal',
        args: ['res.body.created_by', "'sammy'"],
      },
      {
        method: 'equal',
        args: ['res.body.assigned_to', "''"],
      },
      {
        method: 'equal',
        args: ['res.body.status_text', "''"],
      },
      {
        method: 'exists',
        args: ['res.body._id'],
      },
    ],
  },
  {
    title:
      'Create an issue with missing required fields: POST request to /api/issues/{project}',
    context: ' -> Functional Tests -> POST requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.error', "'required field(s) missing'"],
      },
    ],
  },
  {
    title: 'View issues on a project: GET request to /api/issues/{project}',
    context: ' -> Functional Tests -> GET requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.status', '200'],
      },
      {
        method: 'exists',
        args: ['res.body[0]'],
      },
      {
        method: 'exists',
        args: ['res.body[0].issue_title'],
      },
    ],
  },
  {
    title:
      'View issues on a project with one filter: GET request to /api/issues/{project}',
    context: ' -> Functional Tests -> GET requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body[0].open', 'false'],
      },
    ],
  },
  {
    title:
      'View issues on a project with multiple filters: GET request to /api/issues/{project}',
    context: ' -> Functional Tests -> GET requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body[0].open', 'false'],
      },
    ],
  },
  {
    title: 'Update one field on an issue: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests -> PUT requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.result', "'successfully updated'"],
      },
      {
        method: 'equal',
        args: ['res.body._id', 'testId'],
      },
    ],
  },
  {
    title:
      'Update multiple fields on an issue: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests -> PUT requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.result', "'successfully updated'"],
      },
      {
        method: 'equal',
        args: ['res.body._id', 'testId'],
      },
    ],
  },
  {
    title:
      'Update an issue with missing _id: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests -> PUT requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.error', "'missing _id'"],
      },
    ],
  },
  {
    title:
      'Update an issue with no fields to update: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests -> PUT requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.error', "'no update field(s) sent'"],
      },
      {
        method: 'equal',
        args: ['res.body._id', 'testId'],
      },
    ],
  },
  {
    title:
      'Update an issue with an invalid _id: PUT request to /api/issues/{project}',
    context: ' -> Functional Tests -> PUT requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.error', "'could not update'"],
      },
      {
        method: 'equal',
        args: ['res.body._id', "'invalid'"],
      },
    ],
  },
  {
    title: 'Delete an issue: DELETE request to /api/issues/{project}',
    context: ' -> Functional Tests -> DELETE requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.result', "'successfully deleted'"],
      },
      {
        method: 'equal',
        args: ['res.body._id', 'testId'],
      },
    ],
  },
  {
    title:
      'Delete an issue with an invalid _id: DELETE request to /api/issues/{project}',
    context: ' -> Functional Tests -> DELETE requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.error', "'could not delete'"],
      },
      {
        method: 'equal',
        args: ['res.body._id', "'INVALID STILL'"],
      },
    ],
  },
  {
    title:
      'Delete an issue with missing _id: DELETE request to /api/issues/{project}',
    context: ' -> Functional Tests -> DELETE requests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body.error', "'missing _id'"],
      },
    ],
  },
];

exports.TestForProd = jsonData;
