/**
 * Created by army on 2017/6/11.
 */
 
class Audio extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    let $root = $(this.element);
    if($root.hasClass('fn-hide')) {
      $root.removeClass('fn-hide');
    }
  }
  render() {
    return <div class="audio">
      <div class="wave1"/>
      <div class="wave2"/>
      <audio
        controls="controls"
        preload="meta"
        src={ this.props.data[0].FileUrl }>
        your browser does not support the audio tag
      </audio>
    </div>;
  }
}

export default Audio;
