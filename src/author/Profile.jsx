/**
 * Created by army8735 on 2017/8/8.
 */

import AuthorType from '../component/author/AuthorType.jsx';

class Profile extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind authorName
  @bind type = []
  @bind sign
  @bind headUrl
  @bind fansNumber
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
            this.type.map(function(item) {
              return <span class={ `cp_author_type${item.AuthorTypeID}` } title={ AuthorType.TypeHash[item.AuthorTypeID] }></span>;
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
