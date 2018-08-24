/**
 * Created by army8735 on 2017/12/3.
 */

'use strict';

import Post from './Post.jsx';
import Article from './Article.jsx';

let myInfo;

class SubPost extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.index = 0;
    self.on(migi.Event.DOM, function() {
      jsBridge.getPreference('my', function(my) {
        if(my) {
          myInfo = my;
        }
      });
      jsBridge.on('resume', function(e) {
        if(e.data) {
          if(e.data.settle) {
            jsBridge.getPreference('my', function(cache) {
              if(cache) {
                cache.user = e.data.data.user;
                cache.author = e.data.data.author;
                myInfo = cache;
                jsBridge.setPreference('my', cache);
              }
            });
          }
        }
      });
    });
  }
  @bind index
  init(data) {
    this.ref.post.init(data);
  }
  click(e, vd, tvd) {
    if(this.index === tvd.props.rel) {
      return;
    }
    if(tvd.props.rel === 1 && myInfo) {
      let user = myInfo.user;
      let author = myInfo.author;
      if(!user || user.regState < 100 || !author || !author[0]) {
        jsBridge.pushWindow('/settle.html', {
          title: '申请作者',
        });
        return;
      }
    }
    this.index = tvd.props.rel;
    if(this.index === 0) {
      jsBridge.setOptionMenu('发布');
    }
    else {
      jsBridge.setOptionMenu('');
    }
  }
  render() {
    return <div class="sub-post">
      <ul class="tab"
          onClick={ { li: this.click } }>
        <li class={ this.index === 0 ? 'cur' : '' }
            rel={ 0 }>画圈</li>
        <li class={ this.index === 1 ? 'cur' : '' }
            rel={ 1 }>约稿</li>
      </ul>
      <Post ref="post"
            @visible={ this.index === 0 }/>
      <Article ref="article"
               @visible={ this.index === 1 }/>
    </div>;
  }
}

export default SubPost;
