const path = require('path');
const db = require('../models/db');
const utils = require('../utils');
const Mock = require('mockjs');

const tableData = Mock.mock({
  'items|500': [
    {
      'id|+1': 1,
      date: '@datetime',
      person: {
        name: '@cname',
        'sex|1': ['0', '1'],
        'age|18-60': 18,
      },
      'price|1-100': 50,
      'num|1-100': 50,
      'state|1-3': 1,
      'choice|0-1': 1,
      hobby: () => {
        const data = [];
        for (let i = 0; i < 3; i++) {
          data[i] = Mock.Random.natural(1, 4);
        }
        return [...new Set(data)];
      },
      address: '@county(true)',
    },
  ],
});

const test1 = async (ctx, next) => {
  // console.log(ctx.query)

  // let res = await db.query('select * from article', [])

  const res = await db.transaction(async (conn) => {
    let res1 = await db.tranQuery(conn, 'insert into content values (?, ?)', ['2', 'aaa']);
    let res2 = await db.tranQuery(conn, 'insert into content values (?, ?)', ['5', 'aaa']);
    return res1 && res2;
  });

  ctx.state.code = 200;
  ctx.state.data = res;
  ctx.state.msg = '';

  // ctx.body = {
  //   code: 200,
  //   data: res,
  //   msg: '',
  // };
};

const getTableData = async (ctx, next) => {
  const { currentPage, pageSize } = ctx.query;
  const start = (Number(currentPage) - 1) * Number(pageSize);
  const end = start + Number(pageSize);

  const res = {
    records: tableData.items.slice(start, end),
    total: 500,
  };

  await utils.sleep(1000);

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

const getTableKeys = async (ctx, next) => {
  const res = tableData.items.map((x) => x.id);

  ctx.body = {
    code: 200,
    data: {
      recordKeys: res,
    },
    msg: '',
  };
};

const getSummationData = async (ctx, next) => {
  const res = {
    summation: {
      num: 1000,
      total: 123456,
    },
  };

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

const getSelectData = async (ctx, next) => {
  const res = {
    records: [
      { text: '??????', value: '1' },
      { text: '??????', value: '2' },
      { text: '?????????', value: '3' },
      { text: '?????????', value: '4', disabled: true },
      { text: '??????', value: '5' },
      { text: '??????', value: '6' },
    ],
  };

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

const getTreeData = async (ctx, next) => {
  const res = {
    records: [
      {
        value: '1',
        text: '?????? 1',
        children: [
          {
            value: '4',
            text: '?????? 1-1',
            children: [
              {
                value: '9',
                text: '?????? 1-1-1',
              },
              {
                value: '10',
                text: '?????? 1-1-2',
              },
            ],
          },
        ],
      },
      {
        value: '2',
        text: '?????? 2',
        children: [
          {
            value: '5',
            text: '?????? 2-1',
          },
          {
            value: '6',
            text: '?????? 2-2',
          },
        ],
      },
      {
        value: '3',
        text: '?????? 3',
        children: [
          {
            value: '7',
            text: '?????? 3-1',
          },
          {
            value: '8',
            text: '?????? 3-2',
          },
        ],
      },
    ],
  };

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

const getRegionData = async (ctx, next) => {
  const res = {
    records: [
      {
        text: '?????????',
        value: '330000',
        children: [{ text: '?????????', value: '330100', children: [{ text: '?????????', value: '330201' }] }],
      },
      {
        text: '?????????',
        value: '320000',
        children: [{ text: '?????????', value: '320101', children: [{ text: '?????????', value: '320502' }] }],
      },
    ],
  };

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

const upload = async (ctx, next) => {
  const { file } = ctx.request.files;
  const basename = path.basename(file.path);

  // ????????????
  ctx.body = {
    code: 200,
    data: `${ctx.origin}/${basename}`,
    msg: '',
  };
};

module.exports = {
  test1,
  getTableData,
  getTableKeys,
  getSummationData,
  getSelectData,
  getTreeData,
  getRegionData,
  upload,
};
