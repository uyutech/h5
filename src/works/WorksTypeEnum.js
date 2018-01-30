/**
 * Created by army8735 on 2017/10/28.
 */

'use strict';

const TYPE = {
  originMusic: 1,
  gaiBian: 2,
  fanChang: 3,
  musicAlbum: 5,
  recite: 8,
  photoAlbum: 11,
};

const NAME = {};
NAME[TYPE.originMusic] = '原创音乐';
NAME[TYPE.gaiBian] = '改编音乐';
NAME[TYPE.fanChang] = '翻唱';
NAME[TYPE.musicAlbum] = '音乐专辑';
NAME[TYPE.photoAlbum] = '相册';
NAME[TYPE.recite] = '朗诵';

export default {
  TYPE,
  NAME,
};
