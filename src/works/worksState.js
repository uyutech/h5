/**
 * Created by army8735 on 2017/11/4.
 */

'use strict';

import WorksTypeEnum from './WorksTypeEnum';

export default {
  getStateStr: function(type, state) {
    switch(type) {
      case WorksTypeEnum.TYPE.originMusic:
      case WorksTypeEnum.TYPE.musicAlbum:
        switch(state) {
          case 2:
          case 3:
            return '填坑中';
        }
        return '';
      case WorksTypeEnum.TYPE.photoAlbum:
        switch(state) {
          case 2:
          case 3:
            return '连载中';
        }
        return '';
    }
    return '';
  },
};
