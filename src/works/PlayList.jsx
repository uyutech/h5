/**
 * Created by army on 2017/6/11.
 */
 
class PlayList extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="playlist">
      <div class="t">
        <b class="icon"/>
        <span>播放全部</span>
        <b class="icon2"/>
      </div>
    </div>;
  }
}

export default PlayList;
