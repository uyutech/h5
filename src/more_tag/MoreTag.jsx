/**
 * Created by army8735 on 2017/12/26.
 */

'use strict';

class MoreTag extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  setData(data) {
    let self = this;
    self.list = data;

    self.hasData = true;
  }
  click(e, vd, tvd) {
    let tag = tvd.props.rel;
    jsBridge.popWindow({
      tag
    });
  }
  genDom() {
    let self = this;
    return <div onClick={ { dd: this.click.bind(this) } }>
      {
        (self.list || []).map(function(item) {
          return <dl class="fn-clear">
            <dt>{ item.name }</dt>
            {
              (item.value || []).map(function(item2) {
                return <dd rel={ item2.value || item2.key }>{ item2.key }</dd>
              })
            }
          </dl>;
        })
      }
    </div>;
  }
  render() {
    return <div class="more-tag">
      {
        this.hasData
          ? this.genDom()
          : <div>
              <div class="fn-placeholder"/>
            </div>
      }
    </div>;
  }
}

export default MoreTag;
