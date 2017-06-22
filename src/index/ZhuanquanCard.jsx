/**
 * Created by army on 2017/6/20.
 */
 
class ZhuanquanCard extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).show();
  }
  hide() {
    $(this.element).hide();
  }
  render() {
    return <div class="zhuanquan_card"></div>;
  }
}

export default ZhuanquanCard;
