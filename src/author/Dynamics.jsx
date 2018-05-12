/**
 * Created by army8735 on 2018/2/25.
 */

'use strict';

import PostList from '../component/postlist/PostList.jsx';

let offset;
let ajax;
let loading;
let loadEnd;

class Dynamics extends migi.Component {
  constructor(...data) {
    super(...data);
    let self = this;
    self.visible = self.props.visible;
  }
  @bind visible
  setData(id, data) {
    let self = this;
    self.id = id;
    if(data) {
      offset = data.limit;
      self.ref.postList.setData(data.data);
      if(offset >= data.count) {
        loadEnd = true;
        self.ref.postList.message = '已经到底了';
      }
      else {
        loadEnd = false;
        self.ref.postList.message = '正在加载...';
      }
    }
  }
  listenScroll() {
    let self = this;
    window.addEventListener('scroll', function() {
      self.checkMore();
    });
  }
  checkMore() {
    let self = this;
    if(loading || loadEnd || !self.visible) {
      return;
    }
    if($util.isBottom()) {
      self.load();
    }
  }
  load() {
    let self = this;
    if(ajax) {
      ajax.abort();
    }
    let postList = self.ref.postList;
    postList.message = '正在加载...';
    loading = true;
    ajax = $net.postJSON('/h5/author/dynamicList', { id: self.id, offset }, function(res) {
      if(res.success) {
        let data = res.data;
        postList.appendData(data.data);
        offset += data.limit;
        if(offset >= data.count) {
          loadEnd = true;
          postList.message = '已经到底了';
        }
      }
      else {
        jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      }
      loading = false;
    }, function(res) {
      jsBridge.toast(res.message || $util.ERROR_MESSAGE);
      loading = false;
    });
  }
  render() {
    return <div class={ 'dynamic' + (this.visible ? '' : ' fn-hide') }>
      <PostList ref="postList"
                disabledClickPerson={ true }
                message="正在加载..."
                visible={ true }/>
    </div>;
  }
}

export default Dynamics;
