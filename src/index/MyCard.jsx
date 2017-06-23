/**
 * Created by army on 2017/6/23.
 */
 
class MyCard extends migi.Component {
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
    return <div class="my_card"></div>;
  }
}

export default MyCard;
