/**
 * Created by army8735 on 2017/9/1.
 */

import util from '../common/util';
import net from '../common/net';
import Audio from './Audio.jsx';
import Video from './Video.jsx';

class Media extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    if(self.props.workID) {
      if(self.props.first === 'video') {
        self.props.videoData.forEach(function(item, i) {
          if(self.props.workID === item.ItemID.toString()) {
            self.vIndex = i;
          }
        })
      }
      else if(self.props.first === 'audio') {
        self.props.audioData.forEach(function(item, i) {
          if(self.props.workID === item.ItemID.toString()) {
            self.aIndex = i;
          }
        })
      }
    }
    self.on(migi.Event.DOM, function() {
    });
  }
  @bind vIndex = 0
  @bind aIndex = 0
  clickType(e, vd, tvd) {
    let self = this;
    let $dd = $(tvd.element);
    let $parent = $dd.parent();
    if(tvd.name === 'dt' && !$parent.hasClass('cur') || (tvd.name === 'dd' && (!$dd.hasClass('cur') || !$parent.hasClass('cur')))) {
      let type = $parent.attr('rel');
      let index = $dd.attr('rel');
      let audio = self.ref.audio;
      let video = self.ref.video;
      if($parent.hasClass('cur')) {
        if(tvd.name === 'dd') {
          $parent.find('.cur').removeClass('cur');
          $dd.addClass('cur');
        }
        if(type === 'audio') {
          audio.switchTo(this.aIndex = index);
          history.replaceState(null, '', '/works/' + this.props.worksID + '/' + this.props.audioData[this.aIndex].ItemID);
        }
        else if(type === 'video') {
          video.switchTo(this.vIndex = index);
          history.replaceState(null, '', '/works/' + this.props.worksID + '/' + this.props.videoData[this.vIndex].ItemID);
        }
      }
      else {
        let $type = $(vd.element);
        $type.find('dl.cur').removeClass('cur');
        $parent.addClass('cur');
        if(tvd.name === 'dd') {
          $parent.find('.cur').removeClass('cur');
          $dd.addClass('cur');
        }
        if(type === 'audio') {
          video && video.pause().hide();
          audio.show();
          audio.switchTo(this.aIndex = index);
          history.replaceState(null, '', '/works/' + this.props.worksID + '/' + this.props.audioData[this.aIndex].ItemID);
        }
        else if(type === 'video') {
          audio && audio.pause().hide();
          video.show();
          video.switchTo(this.vIndex = index);
          history.replaceState(null, '', '/works/' + this.props.worksID + '/' + this.props.videoData[this.vIndex].ItemID);
        }
      }
    }
  }
  render() {
    let showLabel = this.props.videoData && this.props.audioData;
    let worksID = this.props.worksID;
    let workID = this.props.workID;
    let first = this.props.first;
    if(showLabel) {
      return <div class="mod mod-media fn-clear" style={ `background-image:url(${util.autoSsl(util.img750_750_80(this.props.cover || '//zhuanquan.xin/img/blank.png'))})` }>
        {
          this.props.videoData
            ? <Video ref="video" worksID={ worksID } workID={ workID }
                     cover={ this.props.cover } datas={ this.props.videoData } show={ this.props.first === 'video' }/>
            : ''
        }
        {
          this.props.audioData
            ? <Audio ref="audio" worksID={ worksID } workID={ workID }
                     cover={ this.props.cover } datas={ this.props.audioData } show={ this.props.first === 'audio' }/>
            : ''
        }
        <div class="type fn-clear" ref="type" onClick={ { dt: this.clickType, dd: this.clickType } }>
          {
            this.props.videoData
              ? <dl class={ 'video fn-clear' + (this.props.first === 'video' ? ' cur' : '') } rel="video">
                <dt rel={ this.vIndex }>视频</dt>
                {
                  this.props.videoData.length && this.props.videoData.length > 1
                    ? this.props.videoData.map(function(item, i) {
                      if(workID !== undefined && first === 'video') {
                        return <dd class={ workID === item.ItemID.toString() ? 'cur' : '' } rel={ i }>{ item.ItemName }</dd>;
                      }
                      return <dd class={ this.vIndex === i ? 'cur' : '' } rel={ i }>{ item.ItemName }</dd>;
                    }.bind(this))
                    : ''
                }
              </dl>
              : ''
          }
          {
            this.props.audioData
              ? <dl class={ 'audio fn-clear' + (this.props.first === 'audio' ? ' cur' : '') } rel="audio">
                <dt rel={ this.aIndex }>音频</dt>
                {
                  this.props.audioData.length && this.props.audioData.length > 1
                    ? this.props.audioData.map(function(item, i) {
                      if(workID !== undefined && first === 'audio') {
                        return <dd class={ workID === item.ItemID.toString() ? 'cur' : '' } rel={ i }>{ item.ItemName }</dd>;
                      }
                      return <dd class={ this.aIndex === i ? 'cur' : '' } rel={ i }>{ item.ItemName }</dd>;
                    }.bind(this))
                    : ''
                }
              </dl>
              : ''
          }
        </div>
      </div>;
    }
    return <div class="mod mod-media no-type fn-clear" style={ `background-image:url(${util.autoSsl(util.img750_750_80(this.props.cover || '//zhuanquan.xin/img/blank.png'))})` }>
      {
        this.props.videoData
          ? <Video ref="video" worksID={ worksID } workID={ workID }
                   cover={ this.props.cover } datas={ this.props.videoData } show={ this.props.first === 'video' }/>
          : ''
      }
      {
        this.props.audioData
          ? <Audio ref="audio" worksID={ worksID } workID={ workID }
                   cover={ this.props.cover } datas={ this.props.audioData } show={ this.props.first === 'audio' }/>
          : ''
      }
    </div>;
  }
}

export default Media;
