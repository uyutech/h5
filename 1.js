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
    collate: 'utf8mb4_unicode_ci'
  },
  options: {
    charset: 'utf8mb4',
  },
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
  },
});

const Author = sequelize.define('author', {
  id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  type: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    comment: '0个人，1组合，2团体，3虚拟',
  },
  name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    unique: true,
  },
  fans_name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: '',
  },
  fans_circle_name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: '',
  },
  head_url: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  settled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  sign: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  comment: '作者基本信息',
});

const AuthorOutSide = sequelize.define('author_outside', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  author_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  type: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['author_id', 'type'],
    }
  ],
  comment: '作者站外链接',
});

const AuthorNum = sequelize.define('author_num', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  author_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  type: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    comment: '0粉丝数，1评论数，2热度',
  },
  num: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['author_id', 'type'],
    }
  ],
  comment: '作者相关数字汇总',
});

const Profession = sequelize.define('profession', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(16),
    allowNull: false,
    defaultValue: '',
  },
  code: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
  },
  category_code: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
  },
  category_name: {
    type: Sequelize.STRING(16),
    allowNull: false,
    defaultValue: '',
  },
  external_code: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['code', 'category_code'],
    }
  ],
  comment: '职种信息',
});

const User = sequelize.define('user', {
  id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  reg_state: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0初始化，1披马甲改名字，2-9填名字，10作者公开或选关注，11选关注作者，99普通完成，100作者完成',
  },
  name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    unique: true,
  },
  sex: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '0未知，1男，2女，3双，4男变女，5女变男',
  },
  head_url: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  sign: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  password: {
    type: Sequelize.CHAR(32),
    allowNull: false,
    defaultValue: '',
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  comment: '用户基本信息',
});

const UserPrivate = sequelize.define('user_private', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  type: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
  },
  content: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'type'],
    }
  ],
  comment: '用户隐私信息',
});

const UserAuthorRelation = sequelize.define('user_author_relation', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  author_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'author_id'],
    },
    {
      fields: ['author_id'],
    }
  ],
  comment: '用户对应作者关系',
});

const UserAssociatePeople = sequelize.define('user_associate_people', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  target_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  type: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    comment: '0关注用户，1关注作者',
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'type', 'target_id'],
    },
    {
      fields: ['target_id', 'type'],
    }
  ],
  comment: '用户对其他用户和作者的操作关联',
});

const UserIpRecord = sequelize.define('user_ip_record', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  ip: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      fields: ['user_id'],
    }
  ],
  comment: '用户登录ip记录',
});

const WorkType = sequelize.define('work_type', {
  id: {
    type: Sequelize.SMALLINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  code: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(16),
    allowNull: false,
    defaultValue: '',
  },
  category_code: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
  },
  category_name: {
    type: Sequelize.STRING(16),
    allowNull: false,
    defaultValue: '',
  },
  external_code: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['code', 'category_code'],
    }
  ],
  comment: '小作品类型',
});

const Work = sequelize.define('work', {
  id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(32),
    allowNull: false,
    defaultValue: '',
  },
  type: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      fields: ['name',],
    }
  ],
  comment: '小作品基本信息',
});

const WorkPic = sequelize.define('work_image', {
  work_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  width: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  height: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  comment: '图片类小作品扩展信息',
});

const WorkMedia = sequelize.define('work_media', {
  work_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  width: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  height: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  time: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  rate: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  cover: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '',
  },
  lrc: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '',
  },
}, {
  comment: '媒体类小作品扩展信息',
});

const WorkText = sequelize.define('work_text', {
  work_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '',
  },
}, {
  comment: '文本类小作品扩展信息',
});

const WorksWorkRelation = sequelize.define('works_work_relation', {
  id: {
    type: Sequelize.SMALLINT.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  works_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  work_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['works_id', 'work_id'],
    },
    {
      fields: ['work_id'],
    }
  ],
  comment: '大作品小作品关系',
});

const Works = sequelize.define('works', {
  id: {
    type: Sequelize.BIGINT.UNSIGNED,
    primaryKey: true,
    unique: true,
  },
  title: Sequelize.STRING(32),
  sub_title: Sequelize.STRING(32),
  desc: Sequelize.STRING(256),
});

const Comment = sequelize.define('comment', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  author_id: {
    type: Sequelize.BIGINT.UNSIGNED,
    allowNull: false,
  },
  user_type: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  state: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  parent_id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  root_id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  create_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  update_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
}, {
  indexes: [
    {
      fields: ['user_id'],
    },
    {
      fields: ['author_id'],
    },
    {
      fields: ['parent_id'],
    },
    {
      fields: ['root_id'],
    }
  ],
  comment: '评论基本信息',
});

const CommentNum = sequelize.define('comment_num', {
  id: {
    type: Sequelize.INTEGER.UNSIGNED,
    primaryKey: true,
    unique: true,
    autoIncrement: true,
    allowNull: false,
  },
  comment_id: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
  },
  type: {
    type: Sequelize.TINYINT.UNSIGNED,
    allowNull: false,
    comment: '0直接子评论数，1全部子评论数，2点赞数，3收藏数',
  },
  num: {
    type: Sequelize.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  indexes: [
    {
      unique: true,
      fields: ['comment_id', 'type'],
    }
  ],
  comment: '评论相关数字汇总',
});

(async () => {
  try {
    let pool = await sql.connect(config);
    await sequelize.sync();

    // await author(pool);
    // await profession(pool);
    // await user(pool);
    // await user_associate_person(pool);
    // await user_ip_record(pool);
    // await works(pool);
    // await comment(pool);
  } catch (err) {
    console.log(err)
  }
})();

async function author(pool) {
  console.log('============ author start =============');
  // 查询作者
  let last = 545;
  let result = await pool.request()
    .query(`select * from Authors_Info where ID>${last}`);
  let count = result.recordset.length;
  console.log('author count', count);


  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    if(item.AuthorName === 'string') {
      continue;
    }
    // 作者数据导入
    await Author.create({
      id: item.ID,
      create_time: item.CreateTime,
      update_time: item.CreateTime,
      state: 1,
      type: item.AuthorOrgaType || 0,
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
        state: 1,
        type: 0,
        url: item.BaiduUrl,
      });
    }
    if(item.BilibiliUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
        type: 1,
        url: item.BilibiliUrl,
      });
    }
    if(item.FiveSingUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
        type: 2,
        url: item.FiveSingUrl,
      });
    }
    if(item.HuabanUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
        type: 3,
        url: item.HuabanUrl,
      });
    }
    if(item.LofterUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
        type: 4,
        url: item.LofterUrl,
      });
    }
    if(item.POCOUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
        type: 5,
        url: item.POCOUrl,
      });
    }
    if(item.WangyiUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
        type: 6,
        url: item.WangyiUrl,
      });
    }
    if(item.WeiboUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
        type: 7,
        url: item.WeiboUrl,
      });
    }
    if(item.ZcoolUrl) {
      await AuthorOutSide.create({
        author_id: item.ID,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
        state: 1,
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
  console.log('============ author end =============');
}

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
  }.hasOwnProperty('')) {
}
async function profession(pool) {
  console.log('============ profession start =============');
  // 查询职种
  let result = await pool.request()
    .query(`SELECT * FROM Enum_AuthorType`);
  console.log('profession count', result.recordset.length);
  let code = 0;
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await Profession.create({
      code: code++,
      name: item.AuthorTypeName,
      category_code: 0,
      category_name: item.AuthorTypeName,
      external_code: item.AuthorTypeID,
      state: 1,
      create_time: item.CreateTime,
      update_time: item.CreateTime,
    });
  }
  console.log('============ profession end =============');
}

async function user(pool) {
  // 查询用户
  console.log('============ user start =============');
  let last = 2018000000018521;
  let result = await pool.request()
    .query(`SELECT * from Users_Info where ID>${last};`);
  console.log('user count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await User.create({
      id: item.ID,
      state: 1,
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
        state: 1,
        create_time: item.CreateTime,
        update_time: item.CreateTime,
      });
    }
    if(item.User_Phone && item.User_Phone !== '-') {
      await UserPrivate.create({
        user_id: item.ID,
        state:1,
        type: 0,
        content: item.User_Phone,
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
  console.log('============ user_ip_record start =============');
  let last = 172175;
  let result = await pool.request()
    .query(`SELECT * from Users_RecordIP WHERE uid>0 and ID>${last};`);
  console.log('user_ip_record count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await UserIpRecord.create({
      user_id: item.uid,
      ip: item.IP,
      create_time: item.CreateTime,
    });
  }
  console.log('============ user_ip_record end =============');
}

async function work(poo) {
  // 查询作品
  console.log('============ work start =============');
  let last = 0;
  let result = await pool.request()
    .query(`SELECT * from Works_Items WHERE ID>${last};`);
  console.log('============ work start =============');
}

async function works(pool) {
  // 查询作品
  console.log('============ work start =============');
  let last = 42;
  let result = await pool.request()
    .query(`SELECT * from Enum_WorkItemType WHERE ID>${last};`);
  console.log('work type count', result.recordset.length);
  let code = 0;
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    await WorkType.create({
      code: code++,
      name: item.ItemTypeName,
      category_code: 0,
      category_name: item.ItemTypeName,
      external_code: item.ItemTypeID,
      state: true,
      create_time: item.CreateTime,
      update_time: item.CreateTime,
    });
  }

  let workHash = {};
  last = 0;
  result = await pool.request()
    .query(`SELECT * from Works_Items WHERE ID>${last};`);
  console.log('work count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
  }

  console.log('============ work end =============');return;

  let last2 = 0;
  let result2 = await pool.request()
    .query(`SELECT * from Works_Info WHERE ID>${last2};`);
  console.log('works count', result2.recordset.length);
  console.log('============ works end =============');
}

async function comment(pool) {
  // 评论
  console.log('============ comment start =============');
  let last = 143118;
  let result = await pool.request()
    .query(`SELECT * from Users_Comment where ID>${last}`);
  console.log('comment count', result.recordset.length);
  for(let i = 0, len = result.recordset.length; i < len; i++) {
    let item = result.recordset[i];
    let rootId = item.RootID || 0;
    if(rootId < 0) {
      rootId = Math.abs(rootId) + 100000000;
    }
    await Comment.create({
      id: item.ID,
      user_id: item.UID || 0,
      author_id: item.CurrentAuthorID || 0,
      user_type: item.CurrentAuthorID ? 1 : 0,
      content: item.Content,
      state: item.ISDel ? 0 : 1,
      parent_id: item.parentID || 0,
      root_id: rootId,
      create_time: item.CreateTime,
      update_time: item.CreateTime,
    });
    if(item.CommentCountRaw > 0) {
      await CommentNum.create({
        comment_id: item.ID,
        type: 1,
        num: item.CommentCountRaw,
      });
    }
  }
  console.log('============ comment end =============');
}
