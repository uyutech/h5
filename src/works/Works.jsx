/**
 * Created by army8735 on 2017/9/18.
 */

import Media from './Media.jsx';
import Intro from './Intro.jsx';
import WorkComment from './WorkComment.jsx';

let ajax;
let firstLoadComment = true;
let barrageTime = 0;

class Works extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      let media = self.ref.media;
      let intro = self.ref.intro;
      let workComment = self.ref.workComment;
      let comment = workComment.ref.comment;
      media.on('tagChange', function(type) {
        switch (type) {
          case '0':
            workComment.hide();
            intro.show();
            break;
          case '1':
            intro.hide();
            workComment.show();
            if(firstLoadComment) {
              firstLoadComment = false;
              workComment.load();
            }
            break;
        }
      });
      media.on('switchSubWork', function(data) {
        self.subWorkID = data[0].ItemID;
        barrageTime = 0;
      });
      media.on('timeupdate', function(data) {
        barrageTime = data;
      });
      comment.on('chooseSubComment', function(rid, cid, name) {
        self.rootId = rid;
        self.replayId = cid;
        self.replayName = name;
      });
      comment.on('closeSubComment', function() {
        self.clickReplay();
      });
    });
  }
  @bind hasContent
  @bind loading
  @bind rootId = null
  @bind replayId = null
  @bind replayName
  @bind worksID
  @bind subWorkID
  setID(worksID) {
    let self = this;
    self.worksID = worksID;
    let workComment = self.ref.workComment;
    workComment.worksID = worksID;
  }
  load() {
    let self = this;
    let media = self.ref.media;
    let intro = self.ref.intro;
    if(ajax) {
      ajax.abort();
    }
    ajax = util.postJSON('api/works/GetWorkDetails', { WorksID: self.worksID }, function(res) {
      if(res.success) {
        let data = res.data;
        media.setCover(data.cover_Pic);
        media.setWorks(data.Works_Items);
        media.popular = data.Popular;
        intro.tags = data.ReturnTagData || [];
        $(self.ref.form.element).removeClass('fn-hide');
      }
      else {
        alert(res.message);
      }
    });
  }
  clickReplay() {
    this.replayId = null;
    this.replayName = null;
    this.rootId = null;
  }
  input(e, vd) {
    if(window.$CONFIG.isLogin !== 'True') {
      migi.eventBus.emit('NEED_LOGIN');
      $(vd.element).blur();
    }
    else {
      let v = $(vd.element).val().trim();
      this.hasContent = v.length > 0;
    }
  }
  focus(e, vd) {
    if(window.$CONFIG.isLogin !== 'True') {
      migi.eventBus.emit('NEED_LOGIN');
      $(vd.element).blur();
    }
  }
  click(e) {
    e.preventDefault();
    let self = this;
    if(self.hasContent) {
      let $input = $(this.ref.input.element);
      let Content = $input.val();
      let ParentID = self.replayId !== null ? self.replayId : -1;
      let RootID = self.rootId !== null ? self.rootId : -1;
      self.loading = true;
      self.ref.media.switchTo(1);
      util.postJSON('api/works/AddComment', {
        ParentID,
        RootID,
        Content,
        subWorkID: self.subWorkID,
        BarrageTime: barrageTime
      }, function(res) {
        if(res.success) {
          self.ref.workComment.element.scrollIntoView();
          $input.val('');
          self.hasContent = false;
          if(RootID === -1) {
            self.ref.workComment.ref.comment.prependData(res.data);
            self.ref.workComment.ref.comment.message = '';
          }
          else {
            self.ref.workComment.ref.comment.prependChild(res.data);
          }
        }
        else if(res.code === 1000) {
          migi.eventBus.emit('NEED_LOGIN');
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        self.loading = false;
      }, function(res) {
        alert(res.message || util.ERROR_MESSAGE);
        self.loading = false;
      });
    }
  }
  render() {
    return <div class="works">
      <Media ref="media"/>
      <Intro ref="intro"/>
      <WorkComment ref="workComment"/>
      <div class="form fn-hide" ref="form">
        <div class="c">
          <div class={ 'reply' + (this.replayId ? '' : ' fn-hide') } onClick={ this.clickReplay }>{ this.replayName }</div>
          <div class="inputs">
            <input ref="input" type="text" placeholder="回复..." onInput={ this.input } onFocus={ this.focus }/>
          </div>
          <button onClick={ this.click } class={ this.hasContent && !this.loading ? '' : 'dis' }>确定</button>
        </div>
      </div>
    </div>;
  }
}

export default Works;
