/**
 * Created by army8735 on 2018/4/20.
 */

'use strict';

class Cooperation extends migi.Component {
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
    return <div class={ 'mod-cooperation' + (this.visible ? '' : ' fn-hide') }
                onClick={ { a: this.click } }>
      <h4>合作关系</h4>
      {
        this.list
          ? this.list.length
            ? <ul class="list">
              {
                this.list.map(function(item) {
                  let url = `/author.html?id=${item.id}`;
                  return <li>
                    <a class="pic"
                       href={ url }
                       title={ item.name }>
                      <img src={ $util.img(item.headUrl, 120, 120, 80) || '/src/common/head.png' }/>
                    </a>
                    <a class="name"
                       href={ url }
                       title={ item.name }>{ item.name }</a>
                    <p class="fans">合作{ item.count }次</p>
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

export default Cooperation;
