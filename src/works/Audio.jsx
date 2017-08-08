/**
 * Created by army on 2017/6/11.
 */
 
class Audio extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  show() {
    $(this.element).removeClass('fn-hide');
  }
  render() {
    return <div class="audio fn-hide">
      <div class="wave1"/>
      <div class="wave2"/>
      <audio
        controls="controls"
        src={ this.props.data[0].FileUrl }>
        your browser does not support the audio tag
      </audio>
    </div>;
  }
}

export default Audio;
