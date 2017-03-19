class SearchNav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="search_nav">
      <form>
        <b></b>
        <input type="text" placeholder="搜索"/>
        <button></button>
      </form>
    </div>;
  }
}

export default SearchNav;
