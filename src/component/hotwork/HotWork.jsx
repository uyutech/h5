/**
 * Created by army8735 on 2017/8/8.
 */

let isStart;
let startX;

class HotWork extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  autoWidth() {
    this.$root = $(this.element);
    this.list = this.ref.list.element;
    this.$list = $(this.list);
    let $c = this.$list.find('.c');
    $c.width('css', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  @bind dataList = [{ blank: true}]
  click(e, vd, tvd) {
    jsBridge.pushWindow('works.html');
  }
  render() {
    return <div class="cp_hotwork">
      <h3>热门作品</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul onClick={ { li: this.click } }>
            {
              this.dataList.map(function(item) {
                if(item.blank) {
                  return <li>
                    <div class="pic"/>
                  </li>;
                }
                return <li>
                  <div class="pic" style={ `background:url(${item.cover_Pic || 'src/common/blank.png'}) no-repeat center` }>
                    <div class="num"><b class="audio"/>66w</div>
                    <div class="ath">{ item.Author.join('/') }</div>
                  </div>
                  <p class="txt">{ item.WorksTitle }</p>
                </li>;
                if(item.type == 'audio') {
                  return <li>
                    <div class="pic">
                      <div class="bg"/>
                      <div class="mask"/>
                      <div class="num"><b class="audio"/>66w</div>
                      <div class="ath">{ item.author }</div>
                    </div>
                    <p class="txt">名字</p>
                  </li>;
                }
                return <li>
                  <div class="pic">
                    <img src={ item.img }/>
                    <div class="mask"/>
                    <div class="num"><b class="video"/>{ item.num }</div>
                    <div class="ath">{ item.author }</div>
                  </div>
                  <p class="txt">{ item.name }</p>
                </li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default HotWork;
