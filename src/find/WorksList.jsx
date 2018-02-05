/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

class WorksList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.index = 0;
  }
  @bind index
  click() {
    let data = this.props.data;
    let length = (data.worklist || []).length;
    if(this.index >= length - 6) {
      this.index = 0;
    }
    else {
      this.index += 6;
    }
  }
  clickWorks(e, vd, tvd) {
    e.preventDefault();
    util.openWorks({
      url: tvd.props.href,
      title: tvd.props.title,
    }, tvd.props.option);
  }
  render() {
    let data = this.props.data;
    return <div class="mod-workslist" onClick={ { a: this.clickWorks } }>
      <h3 style={ data.coverpic ? `background-image:url(${data.coverpic})` : '' }>
        { data.Describe }
        { (data.worklist || []).length > 6 ? <span onClick={ this.click }>换一换</span> : '' }
      </h3>
      <ul ref="list">
        {
          (data.worklist || []).slice(this.index, this.index + 6).map(function(item) {
            let GroupAuthorTypeHash = item.GroupAuthorTypeHash || {};
            let AuthorTypeHashlist = GroupAuthorTypeHash.AuthorTypeHashlist || [];
            let author = AuthorTypeHashlist[0] || {};
            let url = util.getWorksUrl(item.WorksID, item.WorkType);
            let option = util.getWorksUrlOption(item.WorkType);
            return <li>
              <a href={ url }
                 title={ item.Title }
                 option={ option }
                 class="pic">
                <img src={ util.autoSsl(util.img170_170_80(item.cover_Pic)) }/>
                <span>{ item.CommentCount }</span>
              </a>
              <a href={ url }
                 title={ item.Title }
                 option={ option }
                 class="name">{ item.Title }</a>
              <p class="author">{ (author.AuthorInfo || []).map(function(item) {
                return item.AuthorName;
              }).join(' ') }</p>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default WorksList;
