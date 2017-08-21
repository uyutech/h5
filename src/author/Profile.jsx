/**
 * Created by army8735 on 2017/8/8.
 */

import authorTemplate from '../component/author/authorTemplate';

class Profile extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind authorName
  @bind sign
  @bind authorType = []
  @bind headUrl
  @bind fansNumber
  @bind isLike
  @bind loading = true
  set type(v) {
    v = v || [];
    let hash = {};
    v.forEach(function(item) {
      let css = authorTemplate(item.AuthorTypeID).css;
      hash[css] = true;
    });
    this.authorType = Object.keys(hash);
  }
  click(e) {
    e.preventDefault();
    let self = this;
    self.loading = true;
    if(self.isLike) {
      util.postJSON('api/author/RemoveAuthorToUser', { Author: self.props.authorId }, function(res) {
        if(res.success) {
          self.isLike = false;
          self.fansNumber = res.data.followCount;
          jsBridge.toast('取关成功');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
    else {
      util.postJSON('api/author/SaveAuthorToUser', { Author: self.props.authorId }, function(res) {
        if(res.success) {
          self.isLike = true;
          self.fansNumber = res.data.followCount;
          jsBridge.toast('关注成功');
        }
        else {
          jsBridge.toast(res.message || util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        jsBridge.toast(res.message || util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
  }
  render() {
    return <div class="profile">
      <div class="pic">
        <img src={ this.headUrl || 'src/common/blank.png' }/>
        <b class="v"/>
      </div>
      <div class="txt">
        <div class="n">
          <h3>{ this.authorName || '&nbsp;' }</h3>
          {
            this.authorType.map(function(item) {
              return <span class={ `cp_author_type_${item}` }></span>;
            })
          }
        </div>
        <p class="intro">{ this.sign || '&nbsp;' }</p>
        <div class="o">
          <div class="fans">
            <strong>{ this.fansNumber || '0' }</strong>
            <span>粉丝</span>
          </div>
          <div class="hot">
            <div class="line">
              <b class="progress"/>
              <b class="point"/>
            </div>
            <span>热度</span>
          </div>
          <a href="javascript:alert('预约已结束')" class={ (this.isLike ? 'support' : 'follow') + (this.loading ? ' loading' : '') }>{ this.isLike ? '应援' : '关注' }</a>
        </div>
      </div>
    </div>;
  }
}

export default Profile;
