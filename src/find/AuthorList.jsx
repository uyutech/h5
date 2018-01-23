/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import net from "../common/net";
import util from "../common/util";

class AuthorList extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.index = 0;
    self.on(migi.Event.DOM, function() {
      let $root = $(self.element);
      $root.on('click', 'a', function(e) {
        e.preventDefault();
        let $a = $(this);
        let url = $a.attr('href');
        let title = $a.attr('title');
        jsBridge.pushWindow(url, {
          transparentTitle: true,
          backIcon: 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAb1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v7W1tby8vL9/f0AAACWlpbb29sAAAD+/v79/f37+/vDw8O4uLgyMjLS0tL6+vrv7+/S0tL39/fz8/PY2NimpqaUlJSjo6Ozs7PY2Nj///9WoHXJAAAAJHRSTlMAAgUIJg8XDBMf9ZCP8RxVRiL459NOMCgWu7OIg2hoXFZOQ0I8A0qaAAAAy0lEQVRYw+3Wxw7CQAxFUWxnSiiBFEjobf7/G/EkrJGwJRbIb3/PKopnZrPZvhmArsZhQLkBiKeUzmIBkJYppZYQNH3qAoGmXz0coaa/ewYU/bpmABR9UUVCUPWBtD2C9b/u94qeAdrlfn4rSlmPb+BaeyfoGQjxMArbGLgXAeViEoQAxaqYhA2JBAq+1AiA5Ez4S+FJoBO6/FFrhDYfFrFwbJpLPm1ioe57nwGpEH3lx9MkFYKLbvy1SQUknuaRxATnoHzm2Wy2j3sBzCEcEv1zv9AAAAAASUVORK5CYII=',
        });
      });
    });
  }
  @bind index
  click() {
    let data = this.props.data;
    let length = (data.authorlist || []).length;
    if(this.index > length - 6) {
      this.index = 0;
    }
    else {
      this.index += 6;
    }
  }
  render() {
    let data = this.props.data;
    return <div class={ 'mod-authorlist' + (this.props.last ? ' last' : '') }>
      <h3 style={ data.coverpic ? `background-image:url(${data.coverpic})` : '' }>
        { data.Describe }{ (data.authorlist || []).length > 6 ? <span onClick={ this.click }>换一换</span> : '' }
      </h3>
      <ul>
        {
          (data.authorlist || []).slice(this.index, this.index + 6).map(function(item) {
            return <li>
              <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName } class="pic">
                <img src={ util.autoSsl(util.img120_120_80(item.Head_url)) || '/src/common/blank.png' }/>
              </a>
              <a href={ '/author.html?authorId=' + item.AuthorID } title={ item.AuthorName } class="name">{ item.AuthorName }</a>
              <p class="fans">{ item.FansNumber }</p>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default AuthorList;
