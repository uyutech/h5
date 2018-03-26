/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

import worksState from './worksState';

class Info extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind typeName
  @bind title
  @bind subTitle
  @bind state
  @bind stateName
  setData(data) {
    let self = this;
    self.typeName = data.typeName;
    self.title = data.title;
    self.subTitle = data.subTitle;
    self.state = data.state;
  }
  render() {
    return <div class="mod-info">
      <span class="type">{ this.typeName }</span>
      <div class="title">
        <h1>{ this.title }</h1>
        <h2 class={ this.subTitle ? '' : 'fn-hide' }>{ this.subTitle }</h2>
      </div>
      <span class={ 'state s' + this.state }>{ worksState[this.state] }</span>
    </div>;
  }
}

export default Info;
