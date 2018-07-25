/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import Nav from './Nav.jsx';
import Post from './Post.jsx';
import Follow from './Follow.jsx';
import Newest from './Newest.jsx';

class Circling extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.index = 2;
    self.on(migi.Event.DOM, function() {
      self.init();
      migi.eventBus.on('IMAGE_VIEW', function() {
        $net.statsAction(3);
      });
    });
  }
  get visible() {
    return this._visible;
  }
  @bind
  set visible(v) {
    this._visible = v;
  }
  @bind index
  init() {
    let self = this;
    self.ref.newest.init();
    // self.ref.post.init();
  }
  refresh() {
    if(this.index === 0) {
      this.ref.post.refresh();
    }
    else if(this.index === 1) {
      this.ref.follow.refresh();
    }
    else if(this.index === 2) {
      this.ref.newest.refresh();
    }
  }
  change(i) {
    this.index = i;
    migi.eventBus.emit('PLAY_INLINE');
  }
  render() {
    return <div class={ 'circling' + (this.visible ? '' : ' fn-hide') }>
      <Nav ref="nav"
           on-change={ this.change }/>
      <Post ref="post"
            @visible={ this.index === 0 }/>
      <Follow ref="follow"
              @visible={ this.index === 1 }/>
      <Newest ref="newest"
              @visible={ this.index === 2 }/>
    </div>;
  }
}

export default Circling;
