/**
 * Created by army8735 on 2017/10/10.
 */

'use strict';

class Poster extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  @bind visible
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    jsBridge.openUri('https://' + url);
    $net.statsAction(25, {
      id: tvd.props.rel,
    });
  }
  render() {
    return <div class={ 'mod-poster' + (this.visible ? '' : ' fn-hide') }>
      <ul class="c" onClick={ { a: this.click } }>
        {
          (this.list || []).map(function(item) {
            return <li>
              <a href={ item.url }
                 rel={ item.id }>
                <img src={ $util.img(item.url, 750, 0, 80) || '/src/common/blank.png' }/>
              </a>
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Poster;
