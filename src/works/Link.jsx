/**
 * Created by army on 2017/6/12.
 */
 
class Link extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).removeClass('fn-hide');
  }
  click(e, vd, tvd) {
    e.preventDefault();
    jsBridge.pushWindow(tvd.props.href, {
      titleBar: 1,
      showBack: true
    });
  }
  render() {
    return <div class="link fn-hide">
      <ul onClick={ { a: this.click } }>
        {
          (this.props.data || []).map(function(item) {
            return <li class={ item.type }><a href={ item.url }>{ item.type }</a></li>;
          })
        }
      </ul>
    </div>;
  }
}

export default Link;
