/**
 * Created by army8735 on 2017/12/5.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

let take = 30;
let skip = take;
let skip2 = take;
let skip3 = take;
let skip4 = take;
let loading;
let loading2;
let loading3;
let loading4;
let loadEnd;
let loadEnd2;
let loadEnd3;
let loadEnd4;

class Relation extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind tag
  setData(data) {
    let self = this;
    self.follows = data.follows;
    self.userFriends = data.userFriends;
    self.userFollows = data.userFollows;
    self.userFollowers = data.userFollowers;

    loadEnd = self.userFriends.Size <= take;
    loadEnd2 = self.userFollows.Size <= take;
    loadEnd3 = self.userFollowers.Size <= take;
    loadEnd4 = self.follows.Size <= take;
    if(!self.userFriends.Size) {
      self.message = '暂无数据';
    }
    else if(self.userFriends.Size <= take && self.userFriends.Size > 12) {
      self.message = '已经到底了';
    }
    if(!self.userFollows.Size) {
      self.message2 = '暂无数据';
    }
    else if(self.userFollows.Size <= take && self.userFollows.Size > 12) {
      self.message2 = '已经到底了';
    }
    if(!self.userFollowers.Size) {
      self.message3 = '暂无数据';
    }
    else if(self.userFollowers.Size <= take && self.userFollowers.Size > 12) {
      self.message3 = '已经到底了';
    }
    if(!self.follows.Size) {
      self.message4 = '暂无数据';
    }
    else if(self.follows.Size <= take && self.follows.Size > 12) {
      self.message4 = '已经到底了';
    }
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      if(!loadEnd || !loadEnd2 || !loadEnd3 || !loadEnd4) {
        $window.on('scroll', function() {
          self.checkMore($window);
        });
        self.checkMore($window);
      }
    });

    self.hasData = true;

    let $root = $(self.element);
    $root.on('click', 'a', function(e) {
      e.preventDefault();
      let $this = $(this);
      let url = $this.attr('href');
      let title = $this.attr('title');
      if(!url) {
        throw new Error('relation url is null');
      }
      jsBridge.pushWindow(url, {
        title,
      });
    });
  }
  checkMore($window) {
    let self = this;
    if(self.tag === 'follow') {
      if(loading2 || loadEnd2) {
        return;
      }
      let WIN_HEIGHT = $window.height();
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.load2();
      }
    }
    else if(self.tag === 'follower') {
      if(loading3 || loadEnd3) {
        return;
      }
      let WIN_HEIGHT = $window.height();
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.load3();
      }
    }
    else if(self.tag === 'author') {
      if(loading4 || loadEnd4) {
        return;
      }
      let WIN_HEIGHT = $window.height();
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.load4();
      }
    }
    else {
      if(loading || loadEnd) {
        return;
      }
      let WIN_HEIGHT = $window.height();
      let HEIGHT = $(document.body).height();
      let bool;
      bool = $window.scrollTop() + WIN_HEIGHT + 30 > HEIGHT;
      if(bool) {
        self.load();
      }
    }
  }
  load() {
    let self = this;
    if(loading || loadEnd) {
      return;
    }
    loading = true;
    self.message = '正在加载...';
    net.postJSON('/h5/my/friendList', { skip, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip += take;
        let s = '';
        data.data.forEach(function(item) {
          s += self.genItem(item);
        });
        $(self.ref.userFriends.element).append(s);
        if(skip >= data.Size) {
          loadEnd = true;
          self.message = '已经到底了';
        }
        else {
          self.message = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading = false;
    });
  }
  load2() {
    let self = this;
    if(loading2 || loadEnd2) {
      return;
    }
    loading2 = true;
    self.ref.message2.element.innerHTML = '正在加载...';
    net.postJSON('/h5/my/followList', { skip: skip2, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip2 += take;
        let s = '';
        data.data.forEach(function(item) {
          s += self.genItem(item);
        });
        $(self.ref.userFollows.element).append(s);
        if(skip2 >= data.Size) {
          loadEnd2 = true;
          self.ref.message2.element.innerHTML = '已经到底了';
        }
        else {
          self.ref.message2.element.innerHTML = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading2 = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading2 = false;
    });
  }
  load3() {
    let self = this;
    if(loading3 || loadEnd3) {
      return;
    }
    loading3 = true;
    self.ref.message3.element.innerHTML = '正在加载...';
    net.postJSON('/h5/my/followerList', { skip: skip3, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip3 += take;
        let s = '';
        data.data.forEach(function(item) {
          s += self.genItem(item);
        });
        $(self.ref.userFollowers.element).append(s);
        if(skip3 >= data.Size) {
          loadEnd3 = true;
          self.ref.message3.element.innerHTML = '已经到底了';
        }
        else {
          self.ref.message3.element.innerHTML = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading3 = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading3 = false;
    });
  }
  load4() {
    let self = this;
    if(loading4 || loadEnd4) {
      return;
    }
    loading4 = true;
    self.ref.message4.element.innerHTML = '正在加载...';
    net.postJSON('/h5/my/followerAuthor', { skip: skip4, take }, function(res) {
      if(res.success) {
        let data = res.data;
        skip4 += take;
        let s = '';
        data.data.forEach(function(item) {
          s += self.genAuthor(item);
        });
        $(self.ref.author.element).append(s);
        if(skip4 >= data.Size) {
          loadEnd4 = true;
          self.ref.message4.element.innerHTML = '已经到底了';
        }
        else {
          self.ref.message4.element.innerHTML = '';
        }
      }
      else {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
      }
      loading4 = false;
    }, function(res) {
      jsBridge.toast(res.message || util.ERROR_MESSAGE);
      loading4 = false;
    });
  }
  genItem(item) {
    return <li>
      <a href={ `/user.html?userID=${item.UserID}` } class="pic" title={ item.UserNickName }>
        <img src={ util.autoSsl(util.img120_120_80(item.User_HeadUrl
          || '/src/common/head.png')) }/>
      </a>
      <a href={ `/user.html?userID=${item.UserID}` } class="txt" title={ item.AuthorName }>
        <span class="name">{ item.UserNickName }</span>
      </a>
    </li>;
  }
  genAuthor(item) {
    return <li>
      <a href={ `/author.html?authorId=${item.AuthorID}` } class="pic" title={ item.AuthorName }>
        <img src={ util.autoSsl(util.img120_120_80(item.Head_url
          || '/src/common/head.png')) }/>
      </a>
      <a href={ `/author.html?authorId=${item.AuthorID}` } class="txt" title={ item.AuthorName }>
        <span class="name">{ item.AuthorName }</span>
      </a>
    </li>;
  }
  clickType(e, vd, tvd) {
    e.preventDefault();
    let $a = $(tvd.element);
    if(!$a.hasClass('cur')) {
      $(vd.element).find('.cur').removeClass('cur');
      $a.addClass('cur');
      this.tag = tvd.props.rel;
    }
  }
  render() {
    return <div class={ 'relation ' + (this.tag || '') }>
      {
        this.hasData
          ? <div>
              <ul class="type" onClick={ { span: this.clickType } }>
                <li><span class="friend cur" href="?tag=friend" rel="friends">圈友</span></li>
                <li><span class="follow" href="?tag=follow" rel="follow">我关注的</span></li>
                <li><span class="follower" href="?tag=follower" rel="follower">关注我的</span></li>
                <li><span class="author" href="?tag=author" rel="author">关注作者</span></li>
              </ul>
              <div class="friend">
                {
                  this.userFriends.Size
                    ? <ul class="fn-clear" ref="userFriends">
                      {
                        this.userFriends.data.map(function(item) {
                          return this.genItem(item);
                        }.bind(this))
                      }
                    </ul>
                    : ''
                }
                <div class="cp-message" ref="message">{ this.message }</div>
              </div>
              <div class="follow">
                {
                  this.userFollows.Size
                    ? <ul class="fn-clear" ref="userFollows">
                      {
                        this.userFollows.data.map(function(item) {
                          return this.genItem(item);
                        }.bind(this))
                      }
                    </ul>
                    : ''
                }
                <div class="cp-message" ref="message2">{ this.message2 }</div>
              </div>
              <div class="follower">
                {
                  this.userFollowers.Size
                    ? <ul class="fn-clear" ref="userFollowers">
                      {
                        this.userFollowers.data.map(function(item) {
                          return this.genItem(item);
                        }.bind(this))
                      }
                    </ul>
                    : ''
                }
                <div class="cp-message" ref="message3">{ this.message3 }</div>
              </div>
              <div class="author">
                {
                  this.follows.Size
                    ? <ul class="fn-clear" ref="author">
                      {
                        this.follows.data.map(function(item) {
                          return this.genAuthor(item);
                        }.bind(this))
                      }
                    </ul>
                    : ''
                }
                <div class="cp-message" ref="message4">{ this.message4 }</div>
              </div>
            </div>
          : <div>
              <div class="fn-placeholder-tags"/>
              <div class="fn-placeholder-roundlets"/>
            </div>
      }
    </div>;
  }
}

export default Relation;
