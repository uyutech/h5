/**
 * Created by army8735 on 2018/3/31.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class AudioList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.visible = this.props.visible;
    this.list = [];
  }
  @bind visible
  @bind list
  @bind message
  setData(data) {
    this.list = data;
  }
  appendData(data) {
    this.list = this.list.concat(data);
  }
  genItem(item) {
    let self = this;
    let url = '/works.html?worksId=' + item.id;
    return <li>
      <a class="pic"
         href={ url }
         title={ item.title }>
        <img src={ util.autoSsl(util.img80_80_80(item.work.cover || item.cover))
          || '//zhuanquan.xin/img/blank.png' }/>
      </a>
      <div class="txt">
        <p class="name">{ item.work.title }</p>
        <p class="plus">
        {
          item.professionList.map(function(profession) {
            return profession.name;
          }).join(' ')
        }
        </p>
      </div>
    </li>;
  }
  render() {
    return <div class={ 'mod-audiolist' + (this.visible ? '' : ' fn-hide') }>
      <ul ref="list"
          onClick={ { '.pic': this.clickPic,
            '.name': this.clickName,
            '.fn': this.clickFn, } }>
        {
          (this.list || []).map(function(item) {
            return this.genItem(item);
          }.bind(this))
        }
      </ul>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') }>{ this.message }</div>
    </div>;
  }
}

export default AudioList;
