/**
 * Created by army on 2017/7/2.
 */

class Dynamics extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind list = []
  click(e, vd, tvd) {
    let url = tvd.props.href;
    jsBridge.openUri(url);
  }
  render() {
    return <div class="cp-dynamic">
      <ul class={ this.list.length ? '' : 'fn-hide' } onClick={ { li: this.click } }>
        {
          this.list.map(function(item) {
            return <li href={ item.DynamicUrl }>
              <div class="con">
                <div class="user">
                  <div class={ `head fn-clear` }>
                    <img src={ item.AuthorHeadUrl }/>
                  </div>
                  <div class="name">
                    <p>{ item.AuthorName }</p>
                    <small>{ item.SendTime }</small>
                  </div>
                </div>
                <p class="info"><b class="weibo"/>{ item.DynamicContent }</p>
              </div>
              <div class="preview">
                <img src={ item.DynamicPic }/>
              </div>
            </li>;
            let info;
            let preview;
            if(item.type == 'song') {
              info = <p class="info"><b class="zq"/>{ item.action }<a href="#">{ item.song }</a></p>;
              preview = <div class="preview">
                <img src={ item.pic }/>
              </div>;
            }
            else if(item.type == 'weibo') {
              info = <p class="info"><b class="wb"/>{ item.action }<a href="#">{ item.txt }</a></p>
            }
            return <li>
              <div class="con">
                <div class="user">
                  <div class={ `head n${item.imgs.length} fn-clear` }>
                    {
                      item.imgs.map(function(item2) {
                        return <img src={ item2 }/>;
                      })
                    }
                  </div>
                  <div class="name">
                    <p>{ item.names.join('、')}</p>
                    <small>{ item.time }</small>
                  </div>
                </div>
                { info }
              </div>
              { preview }
            </li>;
          })
        }
      </ul>
      <div class={ 'no' + (this.list.length ? ' fn-hide' : '') }></div>
    </div>;
  }
}

export default Dynamics;
