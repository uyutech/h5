/**
 * Created by army8735 on 2017/8/17.
 */

import itemTemplate from './itemTemplate';

import Author from './Author2.jsx';
import Audio from './Audio.jsx';
import Video from './Video.jsx';

let WIDTH = $(window).width();
let currentTime = 0;
let duration = 0;
let isStart;
let isMove;

let audio;

class Media extends migi.Component {
  constructor(...data) {
    super(...data);
    let WIDTH = $(window).width();
    let style = document.createElement('style');
    style.innerText = `body>.media>.c{height:${WIDTH/16*9}px}`;
    document.head.appendChild(style);
  }
  setCover(url) {
    $(this.element).css('background-image', `url(${url})`);
  }
  setWorks(works) {
    let self = this;
    let workHash = {};
    let workList = [];
    let authorList = [];
    let mediaList = [];
    works.forEach(function(item) {
      // 先按每个小作品类型排序其作者
      util.sort(item.Works_Item_Author, itemTemplate(item.ItemType).authorSort || function() {});
      // 将每个小作品根据小类型映射到大类型上，再归类
      let bigType = itemTemplate(item.ItemType).bigType;
      workHash[bigType] = workHash[bigType] || [];
      workHash[bigType].push(item);
    });
    Object.keys(workHash).forEach(function(k) {
      workList.push({
        bigType: k,
        value: workHash[k],
      });
    });
    util.sort(workList, function(a, b) {
      return a.bigType > b.bigType;
    });
    workList.forEach(function(works) {
      let authors = [];
      works.value.forEach(function(work) {
        authors = authors.concat(work.Works_Item_Author);
      });
      // 去重
      let hash = {};
      for(let i = 0; i < authors.length; i++) {
        let author = authors[i];
        let key = author.ID + ',' + author.WorksAuthorType;
        if(hash[key]) {
          authors.splice(i--, 1);
          continue;
        }
        else {
          hash[key] = true;
        }
      }
      // 合并
      hash = {};
      let nAuthors = [];
      authors.forEach(function(author) {
        if(hash.hasOwnProperty(author.WorksAuthorType)) {
          nAuthors[hash[author.WorksAuthorType]].list.push(author);
        }
        else {
          hash[author.WorksAuthorType] = nAuthors.length;
          nAuthors.push({
            type: author.WorksAuthorType,
            list: [author]
          });
        }
      });
      authorList.push(nAuthors);
    });
    self.ref.author.setAuthor(authorList);

    workList.forEach(function(item) {
      if(item.bigType === 'audio') {
        let fileList = item.value.map(function(item2) {
          return item2.FileUrl;
        });
        audio = migi.render(
          <Audio data={ fileList }/>,
          self.ref.c.element
        );
        audio.on('timeupdate', function(data) {
          currentTime = data;
          let percent = currentTime / duration;
          self.setBarPercent(percent);
        });
        audio.on('loadedmetadata', function(data) {
          duration = data.duration;
          self.canControl = true;
        });
      }
    });
  }
  @bind popular = 0
  @bind canControl
  clickTag(e, vd, tvd) {
    let $ul = $(vd.element);
    let $li = $(tvd.element);
    if(!$li.hasClass('cur')) {
      $ul.find('.cur').removeClass('cur');
      $li.addClass('cur');
      this.emit('tagChange', tvd.props.rel);
    }
  }
  clickPlay(e, vd) {
    let $play = $(vd.element);
    if($play.hasClass('pause')) {
      audio.pause();
    }
    else {
      audio.play();
    }
    $play.toggleClass('pause');
  }
  clickProgress(e) {
    if(e.target.className !== 'point') {
      let x = e.pageX;
      let percent = x / WIDTH;
      let currentTime = Math.floor(duration * percent);
      audio.currentTime(currentTime);
    }
  }
  start(e) {
    if(e.touches.length === 1) {
      isStart = true;
      audio.pause();
      $(this.ref.play.element).removeClass('pause');
    }
  }
  move(e) {
    if(isStart) {
      isMove = true;
      e.preventDefault();
      let x = e.touches[0].pageX;
      let percent = x / WIDTH;
      this.setBarPercent(percent);
      currentTime = Math.floor(duration * percent);
    }
  }
  end() {
    if(isMove) {
      audio.currentTime(currentTime);
    }
    isStart = isMove = false;
  }
  setBarPercent(percent) {
    percent *= 100;
    $(this.ref.has.element).css('width', percent + '%');
    $(this.ref.pgb.element).css('-webkit-transform', `translate3d(${percent}%,0,0)`);
    $(this.ref.pgb.element).css('transform', `translate3d(${percent}%,0,0)`);
  }
  render() {
    return <div class="media">
      <Author ref="author"/>
      <div class="c" ref="c">
        <span class="popular" flag="1">{ this.popular }</span>
      </div>
      <div class={ 'progress' + (this.canControl ? '' : ' dis') } onClick={ this.clickProgress }>
        <div class="has" ref="has"/>
        <div class="pbg" ref="pgb">
          <div class="point" ref="point" onTouchStart={ this.start } onTouchMove={ this.move } onTouchEnd={ this.end }/>
        </div>
      </div>
      <div class={ 'bar' + (this.canControl ? '' : ' dis') }>
        <div class="prev"/>
        <div class="play" ref="play" onClick={ this.clickPlay }/>
        <div class="next"/>
      </div>
      <div class="tags" ref="tags" onClick={ { li: this.clickTag } }>
        <ul>
          <li class="cur" rel="0"><span>简介</span></li>
          <li rel="1"><span>评论</span></li>
        </ul>
      </div>
    </div>;
  }
}

export default Media;
