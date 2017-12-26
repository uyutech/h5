/**
 * Created by army8735 on 2017/8/13.
 */

let code2Data = {
  '901': {
    name: '出品',
    display: '出品',
    css: 'ce',
  },
  '902': {
    name: '策划',
    display: '策划',
    css: 'ce',
  },
  '111': {
    name: '演唱',
    display: '演唱',
    css: 'ge',
  },
  '112': {
    name: '和声',
    display: '和声',
  },
  '113': {
    name: '伴唱',
    display: '伴唱',
  },
  '114': {
    name: '戏腔',
    display: '戏腔',
  },
  '115': {
    name: '合唱',
    display: '合唱',
    css: 'ge',
  },
  '121': {
    name: '作曲',
    display: '作曲',
    css: 'qu',
  },
  '122': {
    name: '编曲',
    display: '编曲',
    css: 'qu',
  },
  '131': {
    name: '混音',
    display: '混音',
    css: 'hun',
  },
  '132': {
    name: '母带',
    display: '母带',
    css: 'hun',
  },
  '133': {
    name: '录音',
    display: '录音',
  },
  '134': {
    name: '修音',
    display: '修音',
    css: 'hun',
  },
  '141': {
    name: '演奏',
    display: '演奏', //优先显示乐器名。
    css: 'yue',
  },
  '151': {
    name: '配音',
    display: '配音',
  },
  '211': {
    name: '视频',
    display: '视频',
    css: 'ying',
  },
  '212': {
    name: '压制',
    display: '压制',
    css: 'ying',
  },
  '213': {
    name: '拍摄',
    display: '拍摄',
    css: 'ying',
  },
  '311': {
    name: '立绘',
    display: '立绘',
    css: 'tu',
  },
  '312': {
    name: 'CG',
    display: 'CG',
    css: 'tu',
  },
  '313': {
    name: '场景',
    display: '场景',
    css: 'tu',
  },
  '314': {
    name: '线稿',
    display: '线稿',
    css: 'tu',
  },
  '315': {
    name: '上色',
    display: '上色',
    css: 'tu',
  },
  '316': {
    name: '手绘',
    display: '手绘',
    css: 'tu',
  },
  '317': {
    name: '插画',
    display: '插画',
    css: 'tu',
  },
  '331': {
    name: '设计',
    display: '设计',
    css: 'she',
  },
  '332': {
    name: '海报',
    display: '海报',
    css: 'she',
  },
  '333': {
    name: 'Logo设计',
    display: 'Logo设计',
    css: 'she',
  },
  '341': {
    name: '漫画',
    display: '漫画',
    css: 'tu',
  },
  '351': {
    name: '书法',
    display: '书法',
    css: 'ji',
  },
  '391': {
    name: '沙画',
    display: '沙画',
    css: 'ji',
  },
  '411': {
    name: '作词',
    display: '作词',
    css: 'wen',
  },
  '421': {
    name: '文案',
    display: '文案',
    css: 'wen',
  },
  '422': {
    name: '剧本',
    display: '剧本',
    css: 'wen',
  },
  '423': {
    name: '小说',
    display: '小说',
    css: 'wen',
  },
};

let label2Code = {};
Object.keys(code2Data).forEach(function(k) {
  let v = code2Data[k];
  label2Code[v.css] = label2Code[v.css] || [];
  label2Code[v.css].push(k);
});

export default {
  code2Data,
  label2Code,
};
