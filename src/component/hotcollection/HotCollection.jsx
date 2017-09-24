/**
 * Created by army8735 on 2017/9/18.
 */

class HotCollection extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list
  autoWidth() {
    this.$root = $(this.element);
    this.list = this.ref.list.element;
    this.$list = $(this.list);
    let $c = this.$list.find('.c');
    $c.width('css', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  render() {
    return <div class="cp-hotcollection">
      <h3>{ this.props.title }</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul>
            {
              (this.list || []).map(function(item) {
                if(item.type == 'audio') {
                  return <li>
                    <div class="pic">
                      <div class="bg3"/>
                      <div class="bg2"/>
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
                    <div class="bg3"/>
                    <div class="bg2"/>
                    <div class="bg"/>
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

export default HotCollection;
