/**
 * Created by army8735 on 2017/12/10.
 */

'use strict';

class Circles extends migi.Component {
  constructor(...data) {
    super(...data);
    this.dataList = this.props.dataList;
  }
  @bind dataList
  click(e, vd, tvd) {
    e.preventDefault();
    let url = tvd.props.href;
    let title = tvd.props.title;
    if(!url) {
      throw new Error('circles url is null');
    }
    jsBridge.pushWindow(url, {
      title,
    });
  }
  render() {
    return <ul class="circles" onClick={ { a: this.click } }>
      {
        this.dataList && this.dataList.length
          ? (this.dataList || []).map(function(item) {
              return <li rel={ item.Cid }><a href={ '/circle.html?circleID=' + item.Cid } title={ item.CirclingName + '圈' }>{ item.CirclingName }</a></li>;
            })
          : <div class="empty">{ this.props.empty || '暂无数据' }</div>
      }
    </ul>;
  }
}

export default Circles;
