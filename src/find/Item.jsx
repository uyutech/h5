/**
 * Created by army8735 on 2018/4/5.
 */


'use strict';

import Banner from './Banner.jsx';
import Works from './Works.jsx';
import AuthorList from './AuthorList.jsx';
import WorksList from './WorksList.jsx';

class Item extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
    self.cache = [];
  }
  @bind visible
  @bind list
  setData(data) {
    let self = this;
    self.ref.banner.setData(data.banner);
    self.list = data.list;
  }
  render() {
    return <div class={ 'mod-item' + (this.visible ? '' : ' fn-hide') }>
      <Banner ref="banner"/>
      {
        (this.list || []).map((item, i) => {
          console.log(item);
          switch(item.type) {
            case 1:
              if(this.cache[i] && this.cache[i].type === item.type) {
                this.cache[i].value.setData(item);
              }
              else {
                this.cache[i] = {
                  type: item.type,
                  value: <Works data={item}/>,
                };
              }
              return this.cache[i].value;
            case 4:
              if(this.cache[i] && this.cache[i].type === item.type) {
                this.cache[i].value.setData(item);
              }
              else {
                this.cache[i] = {
                  type: item.type,
                  value: <AuthorList data={item}/>,
                };
              }
              return this.cache[i].value;
            case 5:
              if(this.cache[i] && this.cache[i].type === item.type) {
                this.cache[i].value.setData(item);
              }
              else {
                this.cache[i] = {
                  type: item.type,
                  value: <WorksList data={item}/>,
                };
              }
              return this.cache[i].value;
          }
        })
      }
    </div>;
  }
}

export default Item;
