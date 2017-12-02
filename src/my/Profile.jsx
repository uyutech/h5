/**
 * Created by army8735 on 2017/10/30.
 */

'use strict';

import net from '../common/net';
import util from '../common/util';

class Profile extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind head
  @bind sname
  @bind sign
  @bind address
  @bind updateNickNameTimeDiff
  @bind updateHeadTimeDiff
  click() {
    let self = this;
    if(self.updateNickNameTimeDiff < 24 * 60 * 60 * 1000) {
      alert('昵称一天只能修改一次哦~');
      return;
    }
    $(self.ref.sname.element).addClass('fn-hide');
    $(self.ref.edit.element).addClass('fn-hide');
    $(self.ref.input.element).removeClass('fn-hide').focus().val(self.sname);
    $(self.ref.ok.element).removeClass('fn-hide')
  }
  clickOk() {
    let self = this;
    $(self.ref.sname.element).removeClass('fn-hide');
    $(self.ref.input.element).addClass('fn-hide');
    $(self.ref.ok.element).addClass('fn-hide');
    let $edit = $(self.ref.edit.element);
    let newName = $(self.ref.input.element).val().trim();
    let length = newName.length;
    if(length < 4 || length > 8) {
      alert('昵称长度需要在4~8个字之间哦~');
      $edit.removeClass('fn-hide');
      return;
    }
    if(newName !== self.sname) {
      net.postJSON('/api/my/updateNickName', { nickName: newName }, function(res) {
        if(res.success) {
          self.sname = newName;
          self.updateNickNameTimeDiff = 0;
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $edit.removeClass('fn-hide');
      }, function(res) {
        alert(res.message || util.ERROR_MESSAGE);
        $edit.removeClass('fn-hide');
      });
    }
    else {
      $edit.removeClass('fn-hide');
    }
  }
  clickHead(e) {
    let self = this;
    if(self.updateHeadTimeDiff < 24 * 60 * 60 * 1000) {
      e.preventDefault();
      alert('头像一天只能修改一次哦~');
    }
  }
  change(e) {
    let self = this;
    if(self.updateHeadTimeDiff < 24 * 60 * 60 * 1000) {
      e.preventDefault();
      alert('头像一天只能修改一次哦~');
      return;
    }
    if(window.FileReader) {
      let file = e.target.files[0];
      let size = file.size;
      if(size && size !== 0 && size <= 1024 * 500) {
        let $upload = $(self.ref.upload.element);
        $upload.addClass('fn-hide');
        let fileReader = new FileReader();
        fileReader.onload = function() {
          net.postJSON('/api/my/uploadHead', { img: fileReader.result }, function(res) {
            if(res.success) {
              self.head = res.url;
            }
            else {
              alert(res.message || util.ERROR_MESSAGE);
            }
            $upload.removeClass('fn-hide');
          }, function(res) {
            alert(res.message || util.ERROR_MESSAGE);
            $upload.removeClass('fn-hide');
          });
        };
        fileReader.readAsDataURL(file);
      }
      else {
        alert('图片体积太大啦，不能超过500k！');
      }
    }
    else {
      alert('您的浏览器暂不支持上传，请暂时使用Chrome或者IE10以上浏览器。');
    }
  }
  click2() {
    let self = this;
    $(self.ref.sign.element).addClass('fn-hide');
    $(self.ref.edit2.element).addClass('fn-hide');
    $(self.ref.input2.element).removeClass('fn-hide').focus().val(self.sign);
    $(self.ref.ok2.element).removeClass('fn-hide')
  }
  clickOk2() {
    let self = this;
    $(self.ref.sign.element).removeClass('fn-hide');
    $(self.ref.input2.element).addClass('fn-hide');
    $(self.ref.ok2.element).addClass('fn-hide');
    let $edit = $(self.ref.edit2.element);
    let newSign = $(self.ref.input2.element).val().trim();
    let length = newSign.length;
    if(length > 16) {
      alert('签名长度不能超过16个字哦~');
      $edit.removeClass('fn-hide');
      return;
    }
    if(newSign !== self.sname) {
      net.postJSON('/api/my/updateSign', { sign: newSign }, function(res) {
        if(res.success) {
          self.sign = newSign;
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $edit.removeClass('fn-hide');
      }, function(res) {
        alert(res.message || util.ERROR_MESSAGE);
        $edit.removeClass('fn-hide');
      });
    }
    else {
      $edit.removeClass('fn-hide');
    }
  }
  click3() {
    let self = this;
    $(self.ref.address.element).addClass('fn-hide');
    $(self.ref.edit3.element).addClass('fn-hide');
    $(self.ref.input3.element).removeClass('fn-hide').focus().val(self.address);
    $(self.ref.ok3.element).removeClass('fn-hide')
  }
  clickOk3() {
    let self = this;
    $(self.ref.address.element).removeClass('fn-hide');
    $(self.ref.input3.element).addClass('fn-hide');
    $(self.ref.ok3.element).addClass('fn-hide');
    let $edit = $(self.ref.edit3.element);
    let newAddress = $(self.ref.input3.element).val().trim();
    let length = newAddress.length;
    if(length > 256) {
      alert('地址长度不能超过256个字哦~');
      $edit.removeClass('fn-hide');
      return;
    }
    if(newAddress !== self.address) {
      net.postJSON('/api/my/updateAddress', { address: newAddress }, function(res) {
        if(res.success) {
          self.address = newAddress;
        }
        else {
          alert(res.message || util.ERROR_MESSAGE);
        }
        $edit.removeClass('fn-hide');
      }, function(res) {
        alert(res.message || util.ERROR_MESSAGE);
        $edit.removeClass('fn-hide');
      });
    }
    else {
      $edit.removeClass('fn-hide');
    }
  }
  render() {
    return <div class="profile">
      <h4>我的资料</h4>
      <div class="c">
        <div class="pic" onClick={ this.clickPic }>
          <img src={ util.autoSsl(util.img200_200_80(this.head)) || '/src/common/head.png' }/>
          <div class="upload" ref="upload">
            <input ref="file" type="file" onChange={ this.change } onClick={ this.clickHead } accept="image/gif, image/jpeg, image/png"/>
          </div>
        </div>
        <div class="txt">
          <label>昵称：</label>
          <strong ref="sname">{ this.sname }</strong>
          <input ref="input" type="text" class="fn-hide" value="" maxlength="8" placeholder="请输入昵称"/>
          <b class="edit" ref="edit" onClick={ this.click }/>
          <button class="fn-hide" ref="ok" onClick={ this.clickOk }>确定</button>
          <br/>
          <label>签名：</label>
          <p ref="sign" class={ this.sign ? 'sign' : 'sign empty' }>{ this.sign || '暂无签名' }</p>
          <input ref="input2" type="text" class="input2 fn-hide" value="" maxlength="16" placeholder="请输入签名"/>
          <b class="edit edit2" ref="edit2" onClick={ this.click2 }/>
          <button class="fn-hide" ref="ok2" onClick={ this.clickOk2 }>确定</button>
        </div>
      </div>
    </div>;
  }
}

export default Profile;
