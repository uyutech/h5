/**
 * Created by army8735 on 2017/12/3.
 */


'use strict';

import Nav from './Nav.jsx';
import Post from './Post.jsx';
import Follow from './Follow.jsx';

class Circling extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self._visible = self.props.visible;
    self.index = 0;
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
    // $util.scrollY(scrollY);
  }
  @bind index
  init() {
    let self = this;
    self.ref.post.init();
  }
  refresh() {
    if(this.index === 0) {
      this.ref.post.refresh();
    }
    else if(this.index === 1) {
      this.ref.follow.refresh();
    }
  }
  change(i) {
    this.index = i;
  }
  render() {
    return <div class={ 'circling' + (this.visible ? '' : ' fn-hide') }>
      <Nav ref="nav"
           on-change={ this.change }/>
      <Post ref="post"
            @visible={ this.index === 0 }/>
      <Follow ref="follow"
              @visible={ this.index === 1 }/>
    </div>;
  }
}

export default Circling;
