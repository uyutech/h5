/**
 * Created by army8735 on 2018/1/8.
 */

'use strict';

import Background from '../component/background/Background.jsx';

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.dataList = self.props.dataList;
    self.on(migi.Event.DOM, function() {
      let $ul = $(self.ref.list.element);
      $ul.on('click', 'li', function() {
        let $li = $(this);
        if($li.hasClass('cur')) {
          return;
        }
        $ul.find('.cur').removeClass('cur');
        $li.addClass('cur');
        self.emit('change', $li.attr('rel'));
      });
    });
  }
  @bind dataList
  click() {
    jsBridge.pushWindow('/search.html', {
      hideBackButton: true,
      transparentTitle: true,
    });
  }
  render() {
    return <div class="mod-nav">
      <b class="search" onClick={ this.click }/>
      <ul ref="list">
        {
          (this.dataList || []).map(function(item, i) {
            if(!i) {
              return <li class="cur" rel={ item.ID }>{ item.Title }</li>
            }
            return <li rel={ item.ID }>{ item.Title }</li>;
          })
        }
      </ul>
      <Background/>
    </div>;
  }
}

export default Nav;
