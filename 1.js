const sql = require('mssql');
const Sequelize = require('sequelize');

const config = {
  user: 'sa',
  password: 'sa123#@',
  server: '192.168.0.3',
  database: 'CirclingDB',
};

const sequelize = new Sequelize('circling', 'root', '87351984@', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    charset: 'utf8mb4',
  },
  options: {
    charset: 'utf8mb4',
  },
});

const Author = sequelize.define('author', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    unique: true,
  },
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
  state: Sequelize.BOOLEAN,
  type: Sequelize.TINYINT,
  name: Sequelize.STRING(32),
  fans_name: Sequelize.STRING(32),
  fans_circle_name: Sequelize.STRING(32),
  head_url: Sequelize.STRING,
  settled: Sequelize.BOOLEAN,
  sign: Sequelize.STRING,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

const AuthorOutSide = sequelize.define('author_outside', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  author_id: {
    type: Sequelize.BIGINT,
    unique: 'authorOutSideUnique',
  },
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
  state: Sequelize.BOOLEAN,
  type: {
    type: Sequelize.TINYINT,
    unique: 'authorOutSideUnique',
  },
  url: Sequelize.STRING,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

const AuthorNum = sequelize.define('author_num', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  author_id: {
    type: Sequelize.BIGINT,
    unique: 'authorNumUnique',
  },
  type: {
    type: Sequelize.TINYINT,
    unique: 'authorNumUnique',
  },
  num: Sequelize.INTEGER,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

(async () => {
  try {
    let pool = await sql.connect(config);
    await sequelize.sync();

    // await author(pool);

    await works(pool);
  } catch (err) {
    console.log(err)
  }
})();

async function author(pool) {
  // 查询作者
  let result = await pool.request()
    .query(`select count(*) as count from Authors_Info`);
  let count = result.recordset[0].count || 0;
  console.log('============ author start =============');
  console.log('author count', count);

  for(let i = 0; i < count; i += 100) {
    result = await pool.request()
      .query(`select top 100 * from (select ROW_NUMBER() over(order by ID asc) as rowNumber, * from Authors_Info) A where rowNumber > ${i}`);
    console.log('read author', i, i + 100, result.recordset.length);
    for(let j = 0, len = result.recordset.length; j < len; j++) {
      let item = result.recordset[j];
      // 作者数据导入
      await Author.create({
        id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 0,
        type: 0,
        name: item.AuthorName,
        fans_name: item.FansName || '',
        fans_circle_name: item.FansCirclingName || '',
        head_url: item.Head_url || '',
        settled: item.ISSettled || true,
        sign: item.Sign || '',
      });
      // 站外链接数据导入
      if(item.BaiduUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 0,
          url: item.BaiduUrl,
        });
      }
      if(item.BilibiliUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 1,
          url: item.BilibiliUrl,
        });
      }
      if(item.FiveSingUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 2,
          url: item.FiveSingUrl,
        });
      }
      if(item.HuabanUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 3,
          url: item.HuabanUrl,
        });
      }
      if(item.LofterUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 4,
          url: item.LofterUrl,
        });
      }
      if(item.POCOUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 5,
          url: item.POCOUrl,
        });
      }
      if(item.WangyiUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 6,
          url: item.WangyiUrl,
        });
      }
      if(item.WeiboUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 7,
          url: item.WeiboUrl,
        });
      }
      if(item.ZcoolUrl) {
        await AuthorOutSide.create({
          author_id: item.ID,
          create_time: item.CreateTime,
          update_time: item.CreateTime,
          state: 0,
          type: 8,
          url: item.ZcoolUrl,
        });
      }
      // 作者粉丝数、评论数导入
      await AuthorNum.create({
        author_id: item.ID,
        type: 0,
        num: item.FansNumber,
      });
      await AuthorNum.create({
        author_id: item.ID,
        type: 1,
        num: item.CommentCountRaw,
      });
    }
  }
  console.log('============ author end =============');
}

async function works(pool) {
  // 查询作品
  console.log('============ works start =============');
}
