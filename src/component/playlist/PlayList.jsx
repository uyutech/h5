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
      <div worksId={ item.WorksID || item.WorkID } class="pic" style={ `background:url(${item.cover_Pic || item.CoverPic || '//zhuanquan.xyz/img/blank.png'})` }/>
      <div class="txt" worksId={ item.WorksID || item.WorkID }>
        <div class="name">{ item.Title }</div>
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
    let id = tvd.props.worksId;
    jsBridge.pushWindow(`works.html?id=${id}`);
  }
  render() {
    return <div class="cp-playlist">
      <ul class="list" ref="list" onClick={ { '.pic': this.click, '.txt': this.click } }/>
    </div>;
  }
}

export default PlayList;
