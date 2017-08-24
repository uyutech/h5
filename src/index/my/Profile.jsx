/**
 * Created by army on 2017/7/16.
 */
 
class Profile extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  click(e, vd, tvd) {
    let $tvd = $(tvd.element);console.log($tvd.hasClass('alt'))
    if($tvd.hasClass('alt')) {
      $(vd.element).find('.card').toggleClass('alt');
    }
  }
  render() {
    return <div class="profile" onClick={ { '.card': this.click } }>
      <div class="bg"/>
      <div class="card">
        <img class="pic" src="http://bbs.xiguo.net/zq/zz/02.png"/>
        <div class="con">
          <h3>司夏<span>个人身份</span></h3>
          <ul>
            <li>Lv.5</li>
            <li>
              <strong>2</strong>
              <span>感兴趣</span>
            </li>
            <li>
              <strong>6</strong>
              <span>喜欢我</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="card alt">
        <img class="pic" src="http://bbs.xiguo.net/zq/zz/02.png"/>
        <div class="con">
          <h3>司夏<span>公众身份</span></h3>
          <ul>
            <li>Lv.5</li>
            <li>
              <strong>2</strong>
              <span>感兴趣</span>
            </li>
            <li>
              <strong>6</strong>
              <span>喜欢我</span>
            </li>
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default Profile;
