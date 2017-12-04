/**
 * Created by army8735 on 2017/9/21.
 */

class Page extends migi.Component {
  constructor(...data) {
    super(...data);
    this._index = this.props.index;
    this._total = this.props.total;
    this.update();
  }
  get index() {
    return this._index || 1;
  }
  @bind
  set index(v) {
    this._index = v;
    this.update();
  }
  get total() {
    return this._total || 1;
  }
  @bind
  set total(v) {
    this._total = v;
    this.index = 1;
  }
  get list() {
    return this._list || [];
  }
  @bind
  set list(v) {
    this._list = v;
  }
  get num() {
    return this._num;
  }
  @bind
  set num(v) {
    this._num = v;
  }
  update() {
    var list = [];
    list.push(<li>{ this.index == 1 ? <span>1</span> : <a href="#">1</a> }</li>);
    if(this.total > 1) {
      if(this.index > 4) {
        list.push(<li>...</li>);
      }
      for(var i = Math.max(2, this.index - 2); i < this.index; i++) {
        list.push(<li>{ this.index == i ? <span>{ i }</span> : <a href="#">{ i }</a> }</li>);
      }
      if(this.index > 1) {
        list.push(<li><span>{ this.index }</span></li>);
      }
      for(var i = this.index + 1; i < Math.min(this.total, this.index + 3); i++) {
        list.push(<li>{ this.index == i ? <span>{ i }</span> : <a href="#">{ i }</a> }</li>);
      }
      if(this.index < this.total - 3) {
        list.push(<li>...</li>);
      }
      if(this.index < this.total) {
        list.push(<li><a href="#">{ this.total }</a></li>);
      }
    }
    this.list = list;
  }
  submit(e) {
    e.preventDefault();
    var index = parseInt(this.num) || 1;
    if(index < 1) {
      index = 1;
    }
    else if(index > this.total) {
      index = this.total;
    }
    this.num = index;
    if(index && index != this.index) {
      this.index = index;
      this.emit('page', this.index);
    }
  }
  click(e) {
    e.preventDefault();
    var index = e.target.innerHTML;
    if(index && index != this.index) {
      this.index = parseInt(index);
      this.emit('page', this.index);
    }
  }
  prev(e) {
    e.preventDefault();
    if(this.index > 1) {
      this.index--;
      this.emit('page', this.index);
    }
  }
  next(e) {
    e.preventDefault();
    if(this.index < this.total) {
      this.index++;
      this.emit('page', this.index);
    }
  }

  render() {
    return <form class="cp-page" onSubmit={ this.submit } onSwipeLeft={ this.prev } onSwipeRight={ this.next }>
      <a href="#" class={ this.index == 1 ? 'prev dis' : 'prev' } onClick={ this.prev }><b></b>上一页</a>
      <ol onClick={ {'a': this.click} }>
        {
          this.list
        }
      </ol>
      <a href="#" class={ this.index == this.total ? 'next dis' : 'next' } onClick={ this.next }>下一页<b></b></a>
      <span>{ this.index }/{ this.total } 页</span>
      <input type="number" class="num" name="page" value={ this.num } min="1" max={ this.total }/>
      <input type="submit" class="sub" value="跳转"/>
    </form>;
  }
}

export default Page;
