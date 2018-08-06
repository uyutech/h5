/**
 * Created by army8735 on 2018/5/11.
 */

'use strict';

let loading;

class BotPanel extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.on(migi.Event.DOM, function() {
      migi.eventBus.on('BOT_PANEL', function(list) {
        if(loading) {
          return;
        }
        if(Array.isArray(list[0])) {
          self.list = list;
        }
        else {
          self.list = [list];
        }
        self.pop = true;
      });
      $(self.element).on('click', function(e) {
        if(!$(e.target).closest('.c')[0]) {
          self.cancel();
        }
      });
    });
  }
  @bind pop
  @bind list
  clickItem(e, vd, tvd) {
    if(loading) {
      return;
    }
    let rel = tvd.props.rel;
    let arr = rel.split('_');
    let i = arr[0];
    let j = arr[1];
    let click = this.list[i][j].click;
    if(click) {
      click(this);
    }
  }
  cancel() {
    if(loading) {
      return;
    }
    loading = true;
    let self = this;
    self.pop = false;
    setTimeout(function() {
      self.list = [];
      loading = false;
    }, 200);
  }
  render() {
    return <div class={ 'cp-botpanel' + (this.pop ? ' on' : '') }>
      <div class="c"
           onClick={ { li: this.clickItem } }>
        {
          (this.list || []).map((arr, i) => {
            return <ul>
              {
                (arr || []).map((item, j) => {
                  return <li class={ item.class + (item.state ? ' on' : '') }
                             rel={ i + '_' + j }><b/>{ item.name }</li>;
                })
              }
            </ul>;
          })
        }
        <button class="cancel" onClick={ this.cancel }>取消</button>
      </div>
    </div>;
  }
}

export default BotPanel;
