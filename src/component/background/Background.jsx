/**
 * Created by army8735 on 2018/1/22.
 */

'use strict';

function setHeight($b, percent) {
  $b.css('height', Math.floor(percent) + '%');
}

class Background extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let $l1 = $(self.ref.l1.element);
      let $l2 = $(self.ref.l2.element);
      let $l3 = $(self.ref.l3.element);
      let $l4 = $(self.ref.l4.element);
      function play() {
        setHeight($l1, Math.random() * 62);
        setHeight($l2, Math.random() * 62);
        setHeight($l3, Math.random() * 62);
        setHeight($l4, Math.random() * 62);
        if(self.timeout) {
          clearTimeout(self.timeout);
        }
        self.timeout = setTimeout(function() {
          setHeight($l1, 31);
          setHeight($l2, 62);
          setHeight($l3, 31);
          setHeight($l4, 62);
        }, 300);
      }
      jsBridge.on('mediaTimeupdate', function(e) {
        play();
      });
    });
  }
  click() {
    if(this.props.disableClick) {
      return;
    }
    let version = jsBridge.appVersion.split('.');
    let major = parseInt(version[0]) || 0;
    let minor = parseInt(version[1]) || 0;
    let patch = parseInt(version[2]) || 0;
    if(jsBridge.ios && major < 0 && minor < 6) {
      return;
    }
    jsBridge.pushWindow('/record.html', {
      title: '最近播放',
      transparentTitle: true,
    });
  }
  render() {
    return <div class="cp-background" onClick={ this.click }>
      <b ref="l1"/>
      <b ref="l2"/>
      <b ref="l3"/>
      <b ref="l4"/>
    </div>;
  }
}

export default Background;
