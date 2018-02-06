/**
 * Created by army8735 on 2018/2/2.
 */

'use strict';

import worksType from './worksType';
import worksState from './worksState';

class Info extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind worksType
  @bind title
  @bind subTitle
  @bind state
  render() {
    return <div class="mod-info">
      <span class={ 'type' + (this.worksType && worksType[this.worksType] ? '' : ' fn-hide') }>{ worksType[this.worksType] }</span>
      <div class="title">
        <h1>{ this.title }</h1>
        <h2 class={ this.subTitle ? '' : 'fn-hide' }>{ this.subTitle }</h2>
      </div>
      <span class={ 'state' + (this.state && worksState.getStateStr(this.worksType, this.state) ? '' : 'fn-hide') }>{ worksState.getStateStr(this.worksType, this.state) }</span>
    </div>;
  }
}

export default Info;
