/**
 * Created by army8735 on 2017/8/9.
 */

class HotAuthor extends migi.Component {
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
  @bind dataList = []
  click(e, vd, tvd) {
    let authorID = tvd.props.authorID;
    if(authorID) {
      util.goto('/author/' + authorID);
    }
  }
  render() {
    return <div class="cp-hotauthor">
      <h3>{ this.props.title }</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul onClick={ { li: this.click } }>
            {
              this.dataList.map(function(item) {
                let types = item.WorksType || [];
                return <li authorID={ item.AuthorID }>
                  <div class="pic" style={ `background:url(${item.Head_url || '//zhuanquan.xyz/img/blank.png'})` }>
                    {
                      types.slice(0, 2).map(function(item) {
                        return <b class={ `cp-author_type${item}` }/>;
                      })
                    }
                  </div>
                  <div class="txt">{ item.AuthorName }</div>
                  <div class="info">合作{ item.CooperationTimes }次</div>
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
