const jsonData = [
  {
    title: '1 stock',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ["res.body['stockData']['stock']", "'goog'"],
      },
      {
        method: 'isNotNull',
        args: ["res.body['stockData']['price']"],
      },
      {
        method: 'isNotNull',
        args: ["res.body['stockData']['likes']"],
      },
    ],
  },
  {
    title: '1 stock with like',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ["res.body['stockData']['stock']", "'aapl'"],
      },
      {
        method: 'equal',
        args: ["res.body['stockData']['likes']", '1'],
      },
    ],
  },
  {
    title: '1 stock with like again (ensure likes arent double counted)',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ['res.text', "'Error: Only 1 Like per IP Allowed'"],
      },
    ],
  },
  {
    title: '2 stocks',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'isArray',
        args: ['stockData'],
      },
    ],
  },
  {
    title: '2 stocks with like',
    context: 'Functional Tests',
    state: 'passed',
    assertions: [
      {
        method: 'equal',
        args: ["stockData[0]['stock']", "'spot'"],
      },
      {
        method: 'equal',
        args: ["stockData[0]['likes']", '1'],
      },
      {
        method: 'equal',
        args: ["stockData[0]['rel_likes']", '0'],
      },
      {
        method: 'equal',
        args: ["stockData[1]['stock']", "'amzn'"],
      },
      {
        method: 'equal',
        args: ["stockData[1]['likes']", '1'],
      },
      {
        method: 'equal',
        args: ["stockData[1]['rel_likes']", '0'],
      },
    ],
  },
];

exports.TestForProd = jsonData;
