/**
 * Created by army on 2017/7/1.
 */

class PlayList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  switchType(e, vd) {
    let $ul = $(vd.element);
    $ul.toggleClass('alt');
    $ul.find('li').toggleClass('cur');
  }
  click(e, vd, tvd) {
    let id = tvd.props.workId;
    jsBridge.pushWindow('works.html?id=' + id);
  }
  setData(data) {
    this.list = data.data || [];
  }
  @bind list = [];
  render() {
    return <div class="cp_playlist">
      <div class="bar">
        <ul class="btn fn-clear">
          <li class="all">播放全部</li>
          <li class="audio"></li>
          <li class="video"></li>
        </ul>
        <ul class="type fn-clear" onClick={ this.switchType }>
          <li class="cur"><span>最热</span></li>
          <li><span>最新</span></li>
        </ul>
      </div>
      <ul class="list" onClick={ { '.pic': this.click, '.txt': this.click } }>
        {
          this.list.map(function(item) {
            return <li>
              <div workId={ item.WorksID } class="pic" style={ `background:url(${item.cover_Pic})` }/>
              <div class="txt" workId={ item.WorksID }>
                <div class="name">{ item.Title }</div>
                <p class="intro">{ item.sub_Title }</p>
              </div>
              {
                // item.type.map(function(item2) {
                //   return <b class={ item2 }/>;
                // })
              }
            </li>;
          })
        }
      </ul>
    </div>;
  }
}

export default PlayList;
