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
    charset: 'utf8',
  },
  options: {
    charset: 'utf8',
  },
});

const Author = sequelize.define('author', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    unique: true,
  },
  state: Sequelize.BOOLEAN,
  type: Sequelize.TINYINT,
  name: Sequelize.STRING(32),
  fans_name: Sequelize.STRING(32),
  fans_circle_name: Sequelize.STRING(32),
  head_url: Sequelize.STRING(255),
  settled: Sequelize.BOOLEAN,
  sign: Sequelize.STRING(255),
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
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
  state: Sequelize.BOOLEAN,
  type: {
    type: Sequelize.TINYINT,
    unique: 'authorOutSideUnique',
  },
  url: Sequelize.STRING,
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
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

const Profession = sequelize.define('profession', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  name: Sequelize.STRING(16),
  code: {
    type: Sequelize.SMALLINT,
    unique: 'professionUnique',
  },
  category_code: {
    type: Sequelize.SMALLINT,
    unique: 'professionUnique',
  },
  category_name: Sequelize.STRING(16),
  state: Sequelize.BOOLEAN,
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

const User = sequelize.define('user', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    unique: true,
  },
  state: Sequelize.BOOLEAN,
  reg_state: Sequelize.TINYINT,
  name: Sequelize.STRING(16),
  sex: Sequelize.TINYINT,
  head_url: Sequelize.STRING(255),
  sign: Sequelize.STRING(255),
  password: Sequelize.CHAR(32),
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

const UserAuthorRelation = sequelize.define('user_author_relation', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  user_id: Sequelize.BIGINT,
  author_id: Sequelize.BIGINT,
  state: Sequelize.BOOLEAN,
  create_time: Sequelize.DATE,
  update_time: Sequelize.DATE,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

const UserAssociatePeople = sequelize.define('user_associate_people', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  user_id: Sequelize.BIGINT,
  target_id: Sequelize.BIGINT,
  type: Sequelize.TINYINT,
  create_time: Sequelize.DATE,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

const UserIpRecord = sequelize.define('user_ip_record', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
  },
  user_id: Sequelize.BIGINT,
  ip: Sequelize.STRING,
  create_time: Sequelize.DATE,
}, {
  timestamps: false,
  underscored: true,
  freezeTableName: true,
});

const Works = sequelize.define('works', {
  id: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    unique: true,
  },
  title: Sequelize.STRING(32),
  sub_title: Sequelize.STRING(32),
  desc: Sequelize.STRING(256),
});

(async () => {
  try {
    let pool = await sql.connect(config);
    await sequelize.sync();

    console.log(Sequelize.TINYINT);
    // await author(pool);
    // await profession(pool);
    // await user(pool);
    // await user_associate_person(pool);
    // await user_ip_record(pool);
    // await works(pool);
  } catch (err) {
    console.log(err)
  }
})();

async function author(pool) {
  console.log('============ author start =============');
  // 查询作者
  let result = await pool.request()
    .query(`select count(*) as count from Authors_Info`);
  let count = result.recordset[0].count || 0;
  console.log('author count', count);

  for(let i = 0; i < count; i += 100) {
    result = await pool.request()
      .query(`select * from Authors_Info`);
      // .query(`select top 100 * from (select ROW_NUMBER() over(order by ID asc) as rowNumber, * from Authors_Info) A where rowNumber > ${i}`);
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

async function profession(pool) {
  console.log('============ profession start =============');
  // 查询职种
  let result = await pool.request()
    .query(`SELECT DISTINCT EAT.ID,EAT.AuthorTypeID,EAT.AuthorTypeName,CWIA.Remark,EAT.CreateTime FROM Enum_AuthorType EAT LEFT JOIN Concern_Works_Items_Author CWIA ON EAT.ID = CWIA.Enum_AuthorTypeID;`);
  console.log('profession count', result.recordset.length);
  let i = 0;
  for(let j = 0, len = result.recordset.length; j < len; j++) {
    let item = result.recordset[j];
    if({
        '李元良': true,
        '慕容婵姬': true,
        '慕容翰': true,
        '秦钰': true,
        '秦峥': true,
        '山舞夕': true,
        '卫玠': true,
        '徐淮': true,
        '叶修': true,
        '山舞夕': true,
      }.hasOwnProperty(item.Remark)) {
      return;
    }
    await Profession.create({
      code: i++,
      name: item.Remark || item.AuthorTypeName,
      category_code: item.AuthorTypeID,
      category_name: item.AuthorTypeName,
      state: 0,
      create_time: item.CreateTime,
      update_time: item.CreateTime,
    });
  }
  console.log('============ profession end =============');
}

async function user(pool) {
  // 查询用户
  console.log('============ user start =============');
  let result = await pool.request()
    .query(`SELECT * from Users_Info;`);
  console.log('user count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await User.create({
      id: item.ID,
      state: 0,
      sign: item.Sign || '',
      head_url: item.User_Head_Url || '',
      name: item.User_NickName || '',
      passport: item.User_Pwd,
      create_time: item.CreateTime,
      update_time: item.CreateTime,
      reg_state: item.User_Reg_Stat,
      sex: item.User_Sex,
    });
    if(item.CurrentAuthorID) {
      await UserAuthorRelation.create({
        user_id: item.ID,
        author_id: item.CurrentAuthorID,
        state: 0,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
      });
    }
  }
  console.log('============ user end =============');
}

async function user_associate_person(pool) {
  // 查询用户和人的关系
  console.log('============ user_associate_person start =============');
  let result = await pool.request()
    .query(`SELECT * from Users_Follow_Author;`);
  console.log('user_associate_person1 count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await UserAssociatePeople.create({
      user_id: item.UID,
      target_id: item.AuthorID,
      type: 0,
      create_time: item.CreateTime,
    });
  }
  console.log('============ user_associate_person continue =============');
  result = await pool.request()
    .query(`SELECT * from Users_Follow_User;`);
  console.log('user_associate_person2 count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await UserAssociatePeople.create({
      user_id: item.UID,
      target_id: item.ToUID,
      type: 1,
      create_time: item.CreateTime,
    });
  }
  console.log('============ user_associate_person end =============');
}

async function user_ip_record(pool) {
  // 用户ip
  console.log('============ user_ip start =============');
  let result = await pool.request()
    .query(`SELECT * from Users_RecordIP WHERE uid>0;`);
  console.log('user_ip count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await UserIpRecord.create({
      user_id: item.uid,
      ip: item.IP,
      create_time: item.CreateTime,
    });
  }
  console.log('============ user_ip end =============');
}

async function works(pool) {
  // 查询作品
  console.log('============ works start =============');
}
