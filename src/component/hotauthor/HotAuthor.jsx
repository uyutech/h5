/**
 * Created by army8735 on 2017/8/9.
 */

class HotAuthor extends migi.Component {
  constructor(...data) {
    super(...data);
    this.pushWindow = this.props.pushWindow;
  }
  @bind pushWindow
  @bind dataList = []
  autoWidth() {
    let $list = $(this.ref.list.element);
    let $c = $list.find('.c');
    $c.css('width', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  click(e, vd, tvd) {
    if(this.pushWindow) {
      e.preventDefault();
      jsBridge.pushWindow(tvd.props.href, {
        transparentTitle: true,
      });
    }
  }
  render() {
    return <div class="cp-hotauthor">
      <h3>{ this.props.title }</h3>
      <div class="list" ref="list" onClick={ { a: this.click } }>
        <div class="c">
          {
            this.dataList && this.dataList.length
              ? <ul>
                {
                  this.dataList.map(function(item) {
                    let types = item.WorksType || [];
                    return <li>
                      <a href={ `author.html?id=${item.AuthorID}` } class="pic">
                        <img src={ util.img90_90(item.Head_url) || '//zhuanquan.xin/img/f59284bd66f39bcfc70ef62eee10e186.png' }/>
                        {
                          types.slice(0, 2).map(function(item) {
                            return <b class={ `cp-author_type${item}` }/>;
                          })
                        }
                      </a>
                      <a href={ `author.html?id=${item.AuthorID}` } class="txt">{ item.AuthorName }</a>
                      <div class="info">合作{ item.CooperationTimes }次</div>
                    </li>;
                  })
                }
              </ul>
              : <div class="empty"/>
          }
        </div>
      </div>
    </div>;
  }
}

export default HotAuthor;
