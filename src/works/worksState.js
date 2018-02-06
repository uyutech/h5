/**
 * Created by army8735 on 2017/11/4.
 */

'use strict';

export default {
  getStateStr: function(type, state) {
    switch(type) {
      case 1:
      case 5:
        switch(state) {
          case 2:
          case 3:
            return '填坑中';
        }
        return '';
      case 11:
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
