/**
 * Created by army8735 on 2018/5/19.
 */

'use strict';

import WorksList from './WorksList.jsx';

class SkillWorks extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.list = self.props.list;
    self.visible = self.props.visible;
  }
  @bind visible
  @bind list
  render() {
    return <div class={ 'mod-skillworks' + (this.visible ? '' : ' fn-hide') }>
      {
        (this.list || []).map((item) => {
          return <WorksList data={ item } authorId={ this.authorId }/>;
        })
      }
    </div>;
  }
}

export default SkillWorks;
