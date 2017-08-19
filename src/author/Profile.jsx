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
  set type(v) {
    v = v || [];
    let hash = {};
    v.forEach(function(item) {
      let css = authorTemplate(item.AuthorTypeID).css;
      hash[css] = true;
    });
    this.authorType = Object.keys(hash);
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
          <a href="#" class="follow">应援</a>
        </div>
      </div>
    </div>;
  }
}

export default Profile;
