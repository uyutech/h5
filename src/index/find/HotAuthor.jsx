/**
 * Created by army on 2017/6/22.
 */

class HotAuthor extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list2 = this.props.list || [];
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
  @bind list2
  render() {
    return <div class="hot_author">
      <h3>{ this.props.title }</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul>
            {
              this.list2.map(function(item) {
                return <li>
                  <div class="pic">
                    <img src={ item.img }/>
                    <b class="ge"/>
                  </div>
                  <div class="txt">{ item.name }</div>
                  <div class="info">{ item.info }</div>
                </li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default HotAuthor;
