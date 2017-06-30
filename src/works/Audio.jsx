/**
 * Created by army on 2017/6/11.
 */
 
class Audio extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="audio">
      <div class="wave1"/>
      <div class="wave2"/>
      <audio
        controls="controls"
        src={ 'http://bbs.xiguo.net/zq/01.mp3' }>
        your browser does not support the audio tag
      </audio>
    </div>;
  }
}

export default Audio;
