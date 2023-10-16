const jsonData = [
  {
    title: 'Create a New Thread 1',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.status', '200'],
      },
    ],
  },
  {
    title: 'Create a New Thread 2',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.status', '200'],
      },
    ],
  },
  {
    title: 'Create a New Thread',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.status', '200'],
      },
    ],
  },
  {
    title: 'Post a reply on a Thread',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.status', '200'],
      },
    ],
  },
  {
    title: 'Get Threads from a Board',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'isArray',
        args: ['res.body'],
      },
      {
        method: 'isUndefined',
        args: ['firstThread.delete_password'],
      },
      {
        method: 'isAtMost',
        args: ['firstThread.replies.length', '3'],
      },
    ],
  },
  {
    title: 'Get Replies on a Thread',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['thread._id', 'testThreadId'],
      },
      {
        method: 'isUndefined',
        args: ['thread.delete_password'],
      },
      {
        method: 'isArray',
        args: ['thread.replies'],
      },
    ],
  },
  {
    title: 'Report a Thread',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body', "'success'"],
      },
    ],
  },
  {
    title: 'Report a Reply on a Thread',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body', "'success'"],
      },
    ],
  },
  {
    title: 'Delete a Reply on a Thread',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body', "'success'"],
      },
    ],
  },
  {
    title: 'Delete a Thread',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.body', "'success'"],
      },
    ],
  },
];

exports.TestForProd = jsonData;
