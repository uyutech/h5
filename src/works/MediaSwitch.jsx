/**
 * Created by army on 2017/6/11.
 */
 
class MediaSwitch extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $window = $(window);
      let $switch = $(self.element);
      let $nav = $(self.props.nav.element);
      let top = $switch.offset().top - $nav.height();
      let winWidth = $window.width();
      let $lis = $switch.find('li.item');
      let lefts = [];
      for(let i = 0, len = $lis.length; i < len; i++) {
        lefts.push($lis.eq(i).offset().left);
      }
      for(let i = 0, len = $lis.length; i < len; i++) {
        let $item = $lis.eq(i);
        $item.css('-webkit-transform', `translate3d(${winWidth-lefts[i]-40}px,${i*40}px,0)`);
        $item.css('transform', `translate3d(${winWidth-lefts[i]-40}px,${i*40}px,0)`);
      }
      $window.on('scroll', function() {
        let diff = top - $window.scrollTop();
        if(diff > 0) {
          $switch.removeClass('fix');
          for(let i = 0, len = $lis.length; i < len; i++) {
            let $item = $lis.eq(i);
            $item.css('-webkit-transform', `translate3d(${Math.floor((winWidth-lefts[i]-40)*diff/top)}px,${Math.floor(i*40*diff/top)}px,0)`);
            $item.css('transform', `translate3d(${Math.floor((winWidth-lefts[i]-40)*diff/top)}px,${Math.floor(i*40*diff/top)}px,0)`);
          }
        }
        else {
          $switch.addClass('fix');
          $lis.removeAttr('style');
        }
      });
      setTimeout(function() {
        $switch.addClass('show');
      }, 200);
    });
  }
  click(e, vd, tvd) {
    let $ul = $(vd.element);
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      $ul.find('.cur').removeClass('cur');
      $li.addClass('cur');
      this.emit('change', tvd.props.ref);
    }
  }
  render() {
    return <div class="switch">
      <b class="bg"/>
      <ul onClick={ { 'li.item': this.click } }>
        <li class="item video cur" ref={ 0 }/>
        <li class="placeholder"/>
        <li class="item audio" ref={ 1 }/>
        <li class="placeholder"/>
        <li class="item image" ref={ 2 }/>
        <li class="placeholder"/>
        <li class="item link" ref={ 3 }/>
      </ul>
    </div>;
  }
}

export default MediaSwitch;
