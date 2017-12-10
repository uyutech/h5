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
  render() {
    return <ul class="circles" onClick={ { a: this.click } }>
      {
        (this.dataList || []).map(function(item) {
          return <li rel={ item.Cid }><a href={ '/circle.html?circleID=' + item.Cid } title={ item.CirclingName + '圈' }>{ item.CirclingName }</a></li>;
        })
      }
    </ul>;
  }
}

export default Circles;
