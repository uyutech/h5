/**
 * Created by army on 2017/5/17.
 */

let rel = 0;

import util from '../../common/util';

class BotNav extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('CLICK_MENU_USER', function() {
        if(rel !== 3) {
          rel = 3;
          $(self.element).find('.cur').removeClass('cur');
          $(self.element).find('.my').addClass('cur');
          self.emit('change', rel);
        }
      });
      migi.eventBus.on('FOLLOW_UPDATE', function() {
        self.followUpdate = true;
      });
      migi.eventBus.on('FOLLOW_UPDATED', function() {
        self.followUpdate = false;
      });
    });
  }
  @bind followUpdate
  click(e, vd, tvd) {
    if(tvd.props.class === 'new') {
      jsBridge.pushWindow('/subpost.html', {
        title: '画圈',
        showOptionMenu: 'true',
        optionMenu: '发布',
      });
      return;
    }
    let $elem = $(tvd.element);
    if($elem.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $elem.addClass('cur');
    rel = tvd.props.rel;
    this.emit('change', rel);
  }
  render() {
    return <ul class="bot-nav" onClick={ { li: this.click } }>
      <li class="find cur" rel={ 0 }>
        <b class="icon"/>
        <span>发现</span>
      </li>
      <li class="circling" rel={ 1 }>
        <b class="icon"/>
        <span>转圈</span>
      </li>
      <li class="new">
        <b class="icon"/>
      </li>
      <li class={ 'follow' + (this.followUpdate ? ' update' : '') } rel={ 2 }>
        <b class="icon"/>
        <span>关注</span>
      </li>
      <li class="my" rel={ 3 }>
        <b class="icon"/>
        <span>我的</span>
      </li>
    </ul>;
  }
}

export default BotNav;
