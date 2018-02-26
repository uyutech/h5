/**
 * Created by army8735 on 2018/2/26.
 */

'use strict';

import Playlist from '../component/playlist/Playlist.jsx';
import Fn from '../find/Fn.jsx';

class Work extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
  }
  @bind visible
  @bind type
  @bind typeId
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
  setData(type, itemList) {
    let self = this;
    self.type = type;
    if(type.length) {
      let first = type[0];
      self.typeId = first.GroupID;
      self.ref.fn.list = first.itemsTypeList;
      switch(self.typeId) {
        case 1:
          self.ref.playlist.setData(itemList.data);
          break;
      }
    }
  }
  render() {
    return <div class={ 'work' + (this.visible ? '' : ' fn-hide') }>
      <ul class={ 'type' + (this.type && this.type.length > 1 ? '' : ' fn-hide') }>
        {
          (this.typeId, this.type || []).map(function(item) {
            return <li class={ item.GroupID === this.typeId ? 'cur' : '' }>{ item.GroupName }</li>;
          }.bind(this))
        }
      </ul>
      <Fn ref="fn"/>
      <Playlist ref="playlist"/>
    </div>;
  }
}

export default Work;
