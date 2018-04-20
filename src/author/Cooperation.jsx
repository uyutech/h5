/**
 * Created by army8735 on 2018/4/20.
 */

'use strict';

class Cooperation extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  render() {
    return <div class="mod-cooperation">
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
