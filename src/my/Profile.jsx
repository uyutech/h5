/**
 * Created by army on 2017/7/16.
 */
 
class Profile extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind userName
  clickEdit(e) {
    e.preventDefault();
    let self = this;
    let name = window.prompt('请输入想要修改的昵称', window.$CONFIG.userName).trim();
    if(name !== window.$CONFIG.userName) {
      util.postJSON('api/users/UpdateNickName', { NickName: name }, function(res) {
        if(res.success) {
          self.userName = name;
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
      });
    }
  }
  render() {
    return <div class="profile">
      <div class="bg"/>
      <div class="card">
        <img class="pic" src={ '' || '//zhuanquan.xin/img/f59284bd66f39bcfc70ef62eee10e186.png' }/>
        <div class="con">
          <h3>{ this.userName }<a href="#" class="edit" onClick={ this.clickEdit }>编辑</a></h3>
        </div>
      </div>
    </div>;
  }
}

export default Profile;
