/**
 * Created by army8735 on 2018/5/6.
 */


'use strict';

import VideoList from './VideoList.jsx';
import AudioList from './AudioList.jsx';
import BotPanel from '../component/botpanel/BotPanel.jsx';

let hash = {};

class MyDownload extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.kind = 2;
    self.on(migi.Event.DOM, function() {
      self.load(self.kind);
    });
  }
  @bind kind
  load(kind) {
    let self = this;
    if(hash[kind]) {
      return;
    }
    jsBridge.localMediaList({
      kind,
    }, function(res) {
      if(self.kind === kind) {
        hash[kind] = true;
        switch(kind) {
          case 1:
            self.ref.videoList.setData(res);
            if(res && res.length) {
              self.ref.videoList.message = '';
            }
            else {
              self.ref.videoList.message = '暂无下载';
            }
            break;
          case 2:
            self.ref.audioList.setData(res);
            if(res && res.length) {
              self.ref.audioList.message = '';
            }
            else {
              self.ref.audioList.message = '暂无下载';
            }
            break;
        }
      }
    });
  }
  clickKind(e, vd, tvd) {
    let self = this;
    let kind = tvd.props.rel;
    if(kind === self.kind) {
      return;
    }
    self.kind = kind;
    self.load(kind);
  }
  render() {
    return <div class="download">
      <ul class="type"
          onClick={ { li: this.clickKind } }>
        <li class={ this.kind === 2 ? 'cur' : 'false' }
            rel={ 2 }>音频</li>
        <li class={ this.kind === 1 ? 'cur' : 'false' }
            rel={ 1 }>视频</li>
      </ul>
      <VideoList ref="videoList"
                 message="正在加载..."
                 @visible={ this.kind === 1 }/>
      <AudioList ref="audioList"
                 message="正在加载..."
                 @visible={ this.kind === 2 }/>
      <BotPanel ref="botPanel"/>
    </div>;
  }
}

export default MyDownload;
