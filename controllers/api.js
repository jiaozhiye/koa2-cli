const db = require('../models/db');
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

  ctx.state.code = 1;
  ctx.state.data = res;
  ctx.state.msg = '';

  // ctx.body = {
  //   code: 1,
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

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

const getSelectData = async (ctx, next) => {
  const res = {
    records: [
      { text: '篮球', value: '1' },
      { text: '足球', value: '2' },
      { text: '乒乓球', value: '3' },
      { text: '羽毛球', value: '4', disabled: true },
      { text: '游泳', value: '5' },
      { text: '滑雪', value: '6' },
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
        text: '一级 1',
        children: [
          {
            value: '4',
            text: '二级 1-1',
            children: [
              {
                value: '9',
                text: '三级 1-1-1',
              },
              {
                value: '10',
                text: '三级 1-1-2',
              },
            ],
          },
        ],
      },
      {
        value: '2',
        text: '一级 2',
        children: [
          {
            value: '5',
            text: '二级 2-1',
          },
          {
            value: '6',
            text: '二级 2-2',
          },
        ],
      },
      {
        value: '3',
        text: '一级 3',
        children: [
          {
            value: '7',
            text: '二级 3-1',
          },
          {
            value: '8',
            text: '二级 3-2',
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
        text: '浙江省',
        value: '330000',
        children: [{ text: '杭州市', value: '330100', children: [{ text: '清河区', value: '330201' }] }],
      },
      {
        text: '江苏省',
        value: '320000',
        children: [{ text: '苏州市', value: '320101', children: [{ text: '沧浪区', value: '320502' }] }],
      },
    ],
  };

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

module.exports = {
  test1,
  getTableData,
  getSelectData,
  getTreeData,
  getRegionData,
};
