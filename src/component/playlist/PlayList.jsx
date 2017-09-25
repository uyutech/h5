/**
 * Created by army on 2017/7/1.
 */

class PlayList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  setData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.list.element).html(s);
  }
  appendData(data) {
    let self = this;
    let s = '';
    (data || []).forEach(function(item) {
      s += self.genItem(item);
    });
    $(self.ref.list.element).append(s);
  }
  genItem(item) {
    return <li>
      <a href={ `works.html?id=${item.WorksID}` } class="pic">
        <img src={ item.cover_Pic || '//zhuanquan.xyz/img/blank.png' }/>
      </a>
      <div class="txt" worksId={ item.WorksID || item.WorkID }>
        <a href={ `works.html?id=${item.WorksID}` } class="name">{ item.Title }</a>
        <p class="intro">{ item.sub_Title }</p>
      </div>
    </li>;
      //{
        // item.type.map(function(item2) {
        //   return <b class={ item2 }/>;
        // })
      //}
  }
  click(e, vd, tvd) {
    e.preventDefault();
    jsBridge.pushWindow(tvd.props.href);
  }
  render() {
    return <div class="cp-playlist">
      <ul class="list" ref="list" onClick={ { a: this.click } }/>
    </div>;
  }
}

export default PlayList;
