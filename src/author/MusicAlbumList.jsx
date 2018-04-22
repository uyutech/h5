/**
 * Created by army8735 on 2018/3/30.
 */

'use strict';

class MusicAlbumList extends migi.Component {
  constructor(...data) {
    super(...data);
    this.visible = this.props.visible;
  }
  @bind list
  @bind visible
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    jsBridge.pushWindow(url, {
      title,
      transparentTitle: true,
    });
  }
  render() {
    return <div class={ 'mod-musicalbumlist' + (this.visible ? '' : ' fn-hide') }
                onClick={ { a: this.click } }>
      {
        this.list
          ? this.list.length
            ? <ul class="list">
              {
                this.list.map(function(item) {
                  let url = `/music_album.html?id=${item.id}`;
                  return <li>
                    <b class="bg"/>
                    <a href={ url }
                       class="pic"
                       title={ item.title }>
                      <img src={ $util.img(item.cover, 170, 170, 80) || '/src/common/blank.png' }/>
                      <span class="type">{ item.typeName }</span>
                      <span class="num">{ $util.abbrNum(item.popular) }</span>
                    </a>
                    <a href={ url }
                       class="txt"
                       title={ item.title }>
                      <span>{ item.title }</span>
                      <span class="profession">{ (item.profession || []).map((item) => {
                        return item.name;
                      }).join(' ') }</span>
                    </a>
                  </li>;
                })
              }
              </ul>
            : <div class="empty">暂无</div>
          : <div class="placeholder"/>
      }
    </div>;
  }
}

export default MusicAlbumList;
