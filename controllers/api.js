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
  // console.log(ctx.headers.query)

  // let res = await db.query('select * from article', [])

  const res = await db.transaction(async (conn) => {
    let res1 = await db.tranQuery(conn, 'insert into content values (?, ?)', ['2', 'aaa']);
    let res2 = await db.tranQuery(conn, 'insert into content values (?, ?)', ['5', 'aaa']);
    return res1 && res2;
  });

  ctx.state.code = 1;
  ctx.state.msg = '成功';
  ctx.state.data = res;
  // ctx.body = {code: 1, data: 'test1'}
};

const getTableData = async (ctx, next) => {
  // 模拟分页
  const { currentPage, pageSize } = ctx.query;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;

  const res = {
    records: tableData.items.slice(start, end),
    total: 500,
  };

  // ctx.state.code = 200;
  // ctx.state.data = res;
  // ctx.state.msg = '';

  ctx.body = {
    code: 200,
    data: res,
    msg: '',
  };
};

module.exports = {
  test1,
  getTableData,
};
