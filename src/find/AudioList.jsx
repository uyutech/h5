/**
 * Created by army8735 on 2018/1/12.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

class AudioList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.dataList = self.props.dataList;
  }
  @bind dataList
  render() {
    return <div class="mod-audiolist">
      <ol>
        {
          (this.dataList || []).map(function(item) {console.log(item);
            return <li>
              <img src={ util.autoSsl(util.img80_80_80(item.FileUrl || '/src/common/blank.png')) }/>
            </li>;
          })
        }
      </ol>
    </div>;
  }
}

export default AudioList;
