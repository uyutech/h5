/**
 * Created by army on 2017/7/2.
 */

class Dynamics extends migi.Component {
  constructor(...data) {
    super(...data);
    this.list = this.props.list;
  }
  render() {
    return <div class="cp_dynamic">
      <ul>
        {
          this.list.map(function(item) {
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
    </div>;
  }
}

export default Dynamics;
