/**
 * Created by army8735 on 2017/11/13.
 */

'use strict';

import net from '../../common/net';
import util from '../../common/util';

class HotPost extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.message = self.props.message;
    if(self.props.dataList && self.props.dataList.length) {
      let html = '';
      self.props.dataList.forEach(function(item) {
        html += self.genItem(item);
      });
      self.html = html;
      self.on(migi.Event.DOM, function() {
        let $list = $(this.ref.list.element);
        $list.on('click', '.wrap .con .snap', function() {
          $(this).closest('li').addClass('expand');
        });
        $list.on('click', '.wrap .con .shrink', function() {
          let $li = $(this).closest('li');
          $li.removeClass('expand');
          $li[0].scrollIntoView(true);
        });
        $list.on('click', '.imgs', function() {
          $(this).closest('li').addClass('expand');
        });
        $list.on('click', '.imgs2 img', function() {
          let $this = $(this);
          let index = $this.attr('rel');
          let urls = [];
          $this.parent().find('img').each(function(i, img) {
            urls.push($(img).attr('src'));
          });
          migi.eventBus.emit('choosePic', urls, index);
        });
        $list.on('click', '.favor', function() {
          if(!$.cookie('isLogin')) {
            migi.eventBus.emit('NEED_LOGIN');
            return;
          }
          let $li = $(this);
          if($li.hasClass('loading')) {
            return;
          }
          $li.addClass('loading');
          let postID = $li.attr('rel');
          let url = '/h5/post/favor';
          if($li.hasClass('has')) {
            url = '/h5/post/unFavor';
          }
          net.postJSON(url, { postID }, function(res) {
            if(res.success) {
              let data = res.data;
              if(data.State === 'favorWork') {
                $li.addClass('has');
              }
              else {
                $li.removeClass('has');
              }
              $li.find('span').text(data.FavorCount || '收藏');
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
            $li.removeClass('loading');
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
            $li.removeClass('loading');
          });
        });
        $list.on('click', '.share', function() {
          let postID = $(this).attr('rel');
          migi.eventBus.emit('SHARE', '/post/' + postID);
        });
        $list.on('click', '.like', function() {
          let $li = $(this);
          if($li.hasClass('loading')) {
            return;
          }
          $li.addClass('loading');
          let postID = $li.attr('rel');
          net.postJSON('/h5/post/like', { postID }, function(res) {
            if(res.success) {
              let data = res.data;
              if(data.ISLike) {
                $li.addClass('has');
              }
              else {
                $li.removeClass('has');
              }
              $li.find('span').text(data.LikeCount || '点赞');
            }
            else {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            }
            $li.removeClass('loading');
          }, function(res) {
            jsBridge.toast(res.message || util.ERROR_MESSAGE);
            $li.removeClass('loading');
          });
        });
        $list.on('click', '.comment', function() {
          let $this = $(this);
          let id = $this.attr('rel');
          let count = $this.attr('count');
          let url = count === '0' ? `/subcomment.html?type=1&id=${id}` : `/post.html?postID=${id}`;
          let title = count === '0' ? '回复画圈' : '画圈正文';
          jsBridge.pushWindow(url, {
            title,
          });
        });
        $list.on('click', '.del', function() {
          if(window.confirm('确认删除吗？')) {
            let postID = $(this).attr('rel');
            let $li = $(this).closest('.wrap').closest('li');
            net.postJSON('/h5/post/del', { postID }, function(res) {
              if(res.success) {
                $li.remove();
              }
              else {
                jsBridge.toast(res.message || util.ERROR_MESSAGE);
              }
            }, function(res) {
              jsBridge.toast(res.message || util.ERROR_MESSAGE);
            });
          }
        });
        $list.on('click', 'a', function(e) {
          e.preventDefault();
          let $this = $(this);
          let type = $this.attr('type');
          let title = $this.attr('title');
          let url = $this.attr('href');
          jsBridge.pushWindow(url, {
            title,
          });
        });
      });
    }
  }
  @bind message
  encode(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/#(\S.*?)#/g, `<strong>#$1#</strong>`)
      .replace(/(http(?:s)?:\/\/[\w-]+\.[\w]+\S*)/gi, '<a href="$1" target="_blank">$1</a>');
  }
  genItem(item) {
    let len = item.Content.length;
    let id = item.ID;
    let maxLen = 144;
    let imgLen = item.Image_Post.length;
    let html = len > maxLen ? (item.Content.slice(0, maxLen) + '...') : item.Content;
    html = this.encode(html);
    if(len > maxLen) {
      html += '<span class="placeholder"></span><span class="more">查看全文</span>';
      let full = this.encode(item.Content) + '<span class="placeholder"></span><span class="shrink">收起全文</span>';
      html = '<p class="snap">' + html + '</p><p class="full">' + full + '</p>';
    }
    let url = '/post.html?postID=' + id;
    if(item.IsAuthor) {
      let authorUrl = '/author.html?authorID=' + item.AuthorID;
      return <li class="author">
        <div class="profile fn-clear">
          <a class="pic" href={ authorUrl } type="2" title={ item.SendUserNickName }>
            <img src={ util.autoSsl(util.img208_208_80(item.SendUserHead_Url
              || '/src/common/blank.png')) }/>
          </a>
          <div class="txt">
            <a href={ authorUrl } class="name" type="2" title={ item.SendUserNickName }>{ item.SendUserNickName }</a>
            <a class="time" href={ url } type="1" title="画圈正文">{ util.formatDate(item.Createtime) }</a>
          </div>
          <div class="circle">
            <ul>
              {
                (item.Taglist || []).map(function(item) {
                  return <li><a href={ '/circle.html?circleID=' + item.TagID }>{ item.TagName }圈</a></li>;
                })
              }
            </ul>
          </div>
        </div>
        <div class="wrap">
          {
            item.Title
              ? <a href={ url } class="t" type="1" title="画圈正文">{ item.Title }</a>
              : ''
          }
          <div class="con" dangerouslySetInnerHTML={ html }/>
          {
            item.Image_Post && imgLen
              ? <ul class={ 'imgs fn-clear' + (item.Image_Post.length > 4 ? '' : (' n' + item.Image_Post.length)) }>
                {
                  item.Image_Post.length > 9
                    ? item.Image_Post.slice(0, 9).map(function(item, i) {
                      let cn = '';
                      if(item.Width !== 0 && item.Height !== 0 && item.Width < 86 && item.Height < 86) {
                        cn = 'no-scale';
                      }
                      if(i === 8) {
                        return <li class={ 'all ' + cn }
                                   style={ 'background-image:url(' + util.autoSsl(util.img208_208_80(item.FileUrl)) + ')' }>
                          <img src={ util.autoSsl(util.img208_208_80(item.FileUrl)) }/>
                          <a href={ url } type="1" title="画圈正文">查看全部</a>
                        </li>;
                      }
                      return <li class={ cn }
                                 style={ 'background-image:url(' + util.autoSsl(util.img208_208_80(item.FileUrl)) + ')' }>
                        <img src={ util.autoSsl(util.img208_208_80(item.FileUrl)) }/>
                      </li>;
                    })
                    : item.Image_Post.map(function(item) {
                      let cn = '';
                      if(item.Width !== 0 && item.Height !== 0 && item.Width < 86 && item.Height < 86) {
                        cn = 'no-scale';
                      }
                      return <li class={ cn }
                                 style={ 'background-image:url(' + util.autoSsl(util.img208_208_80(item.FileUrl)) + ')' }>
                        <img src={ util.autoSsl(util.img208_208_80(item.FileUrl)) }/>
                      </li>;
                    })
                }
              </ul>
              : ''
          }
          {
            item.Image_Post && imgLen
              ? <div class="imgs2">
                {
                  item.Image_Post.map(function(item, i) {
                    return <img src={ util.autoSsl(util.img1200__80(item.FileUrl)) } rel={ i }/>;
                  })
                }
              </div>
              : ''
          }
          <b class="arrow"/>
        </div>
        <ul class="btn">
          <li class="share" rel={ id }><b/><span>分享</span></li>
          <li class={ 'favor' + (item.ISFavor ? ' has' : '') } rel={ id }>
            <b/><span>{ item.FavorCount || '收藏' }</span>
          </li>
          <li class={ 'like' + (item.ISLike ? ' has' : '') } rel={ id }>
            <b/><span>{ item.LikeCount || '点赞' }</span>
          </li>
          <li class="comment" rel={ id } count={ item.CommentCount }>
            <b/><span>{ item.CommentCount || '评论' }</span>
          </li>
          { item.IsOwn ? <li class="del" rel={ id }><b/></li> : '' }
        </ul>
      </li>;
    }
    let userUrl = '/user.html?userID=' + item.SendUserID;
    return <li>
      <div class="profile fn-clear">
        <a class="pic" href={ userUrl } type="3" title={ item.SendUserNickName }>
          <img src={ util.autoSsl(util.img208_208_80(item.SendUserHead_Url
            || '/src/common/head.png')) }/>
        </a>
        <div class="txt">
          <a class="name" href={ userUrl } type="3" title={ item.SendUserNickName }>{ item.SendUserNickName }</a>
          <a class="time" href={ url } type="1" title="画圈正文">{ util.formatDate(item.Createtime) }</a>
        </div>
        <div class="circle">
          <ul>
            {
              (item.Taglist || []).map(function(item) {
                return <li><a href={ '/circle.html?circleID=' + item.TagID }>{ item.TagName }圈</a></li>;
              })
            }
          </ul>
        </div>
      </div>
      <div class="wrap">
        {
          item.Title
            ? <a href={ url } class="t" type="1" title="画圈正文">{ item.Title }</a>
            : ''
        }
        <div class="con" dangerouslySetInnerHTML={ html }/>
        {
          item.Image_Post && imgLen
            ? <ul class={ 'imgs fn-clear' + (item.Image_Post.length > 4 ? '' : (' n' + item.Image_Post.length)) }>
              {
                item.Image_Post.length > 9
                  ? item.Image_Post.slice(0, 9).map(function(item, i) {
                    let cn = '';
                    if(item.Width !== 0 && item.Height !== 0 && item.Width < 86 && item.Height < 86) {
                      cn = 'no-scale';
                    }
                    if(i === 8) {
                      return <li class={ 'all ' + cn }
                                 style={ 'background-image:url(' + util.autoSsl(util.img208_208_80(item.FileUrl)) + ')' }>
                        <img src={ util.autoSsl(util.img208_208_80(item.FileUrl)) }/>
                        <a href={ url } type="1" title="画圈正文">查看全部</a>
                      </li>;
                    }
                    return <li class={ cn }
                               style={ 'background-image:url(' + util.autoSsl(util.img208_208_80(item.FileUrl)) + ')' }>
                      <img src={ util.autoSsl(util.img208_208_80(item.FileUrl)) }/>
                    </li>;
                  })
                  : item.Image_Post.map(function(item) {
                    let cn = '';
                    if(item.Width !== 0 && item.Height !== 0 && item.Width < 86 && item.Height < 86) {
                      cn = 'no-scale';
                    }
                    return <li class={ cn }
                               style={ 'background-image:url(' + util.autoSsl(util.img208_208_80(item.FileUrl)) + ')' }>
                      <img src={ util.autoSsl(util.img208_208_80(item.FileUrl)) }/>
                    </li>;
                  })
              }
            </ul>
            : ''
        }
        {
          item.Image_Post && imgLen
            ? <div class="imgs2">
              {
                item.Image_Post.map(function(item, i) {
                  return <img src={ util.autoSsl(util.img1200__80(item.FileUrl)) } rel={ i }/>;
                })
              }
            </div>
            : ''
        }
        <b class="arrow"/>
      </div>
      <ul class="btn">
        <li class="share" rel={ id }><b/><span>分享</span></li>
        <li class={ 'favor' + (item.ISFavor ? ' has' : '') } rel={ id }>
          <b/><span>{ item.FavorCount || '收藏' }</span></li>
        <li class={ 'like' + (item.ISLike ? ' has' : '') } rel={ id }><b/><span>{ item.LikeCount || '点赞' }</span>
        </li>
        <li class="comment" rel={ id } count={ item.CommentCount }>
          <b/><span>{ item.CommentCount || '评论' }</span>
        </li>
        { item.IsOwn ? <li class="del" rel={ id }><b/></li> : '' }
      </ul>
    </li>;
  }
  setData(data) {
    let self = this;
    let html = '';
    (data || []).forEach(function(item) {
      html += self.genItem(item);
    });
    $(self.ref.list.element).html(html);
  }
  appendData(data) {
    let self = this;
    let html = '';
    (data || []).forEach(function(item) {
      html += self.genItem(item);
    });
    $(self.ref.list.element).append(html);
  }
  render() {
    return <div class="cp-hotpost">
      <ol class="list" ref="list" dangerouslySetInnerHTML={ this.html }/>
      <div class={ 'cp-message' + (this.message ? '' : ' fn-hide') } >{ this.message }</div>
    </div>;
  }
}

export default HotPost;