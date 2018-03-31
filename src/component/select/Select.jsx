/**
 * Created by army8735 on 2018/3/30.
 */

'use strict';

class Select extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = self.props.list;
    self.on(migi.Event.DOM, function() {
      let $body = $(document.body);
      $body.on('click', function() {
        self.showPop = false;
      });
    });
  }
  @bind list
  @bind text
  @bind showPop
  clickPop(e, vd, tvd) {
    e.stopPropagation();
    let self = this;
    self.showPop = true;
  }
  clickSelPop(e, vd, tvd) {
    e.stopPropagation();
    let self = this;
    self.showPop = false;
    let $li = $(tvd.element);
    if($li.hasClass('cur')) {
      return;
    }
    $(vd.element).find('.cur').removeClass('cur');
    $li.addClass('cur');
    self.text = tvd.children[0];
    self.emit('type', tvd.props.rel);
  }
  render() {
    return <div class="mod-select">
      <label class={ this.list && this.list.length > 1 ? '' : ' fn-hide' }
             onClick={ this.clickPop }>
        {
          this.text || '全部'
        }
      </label>
      <div class={ 'pop' + (this.showPop ? ' on' : '') }>
        <div class={ 'c' + (this.showPop ? ' on' : '') }>
          <label>分类</label>
          <ul class="fn-clear" onClick={ this.clickSelPop }>
            <li class="cur">全部</li>
            {
              (this.list || []).map(function(item) {
                return <li rel={ item.ItemsTypeID }>{ item.ItemsTypeName }</li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default Select;
