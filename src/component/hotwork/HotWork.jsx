/**
 * Created by army8735 on 2017/8/8.
 */

import AuthorType from '../author/AuthorType.jsx';

class HotWork extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  autoWidth() {
    this.list = this.ref.list.element;
    this.$list = $(this.list);
    let $c = this.$list.find('.c');
    $c.width('css', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  @bind dataList = []
  click(e, vd, tvd) {
    let worksID = tvd.props.WorksID;
    if(worksID) {
      jsBridge.pushWindow('works.html?id=' + worksID);
    }
  }
  render() {
    let authorId = this.props.authorId;
    return <div class="cp_hotwork">
      <h3>{ this.props.title }</h3>
      <div class="list" ref="list">
        <div class="c">
          <ul onClick={ { li: this.click } }>
            {
              this.dataList.map(function(item) {
                let myAuthor;
                let workAuthors = '';
                // item.Works_Item_Author.forEach(function(item) {
                //   if(item.AuthorID === authorId) {
                //     myAuthor = item;
                //   }
                // });
                // if(myAuthor) {
                //   // 如果是歌手，将其它歌手&链接并加上with
                //   if(myAuthor.AuthorType == AuthorType.CODE.歌手) {
                //     let authors = [];
                //     item.Works_Item_Author.forEach(function(item) {
                //       if(item.AuthorID !== authorId) {
                //         authors.push(item.AuthorName);
                //       }
                //     });
                //     if(authors.length) {
                //       workAuthors = 'with ' + authors.join('&');
                //     }
                //   }
                //   // 其它类型将歌手全部展示
                //   else {
                //     let authors = [];
                //     item.Works_Item_Author.forEach(function(item) {
                //       if(item.AuthorID !== authorId) {
                //         authors.push(item.AuthorName);
                //       }
                //     });
                //     if(authors.length) {
                //       workAuthors = authors.join('&');
                //     }
                //   }
                // }
                // // 其它类型将歌手全部展示
                // else {
                //   let authors = [];
                //   item.Works_Item_Author.forEach(function(item) {
                //     if(item.AuthorID !== authorId) {
                //       authors.push(item.AuthorName);
                //     }
                //   });
                //   if(authors.length) {
                //     workAuthors = authors.join('&');
                //   }
                // }
                return <li worksID={ item.WorksID }>
                  <div class="pic" style={ `background:url(${item.cover_Pic || 'src/common/blank.png'}) no-repeat center` }>
                    <div class="num"><b class="audio"/>{ item.Popular }</div>
                    <div class="ath">{ workAuthors }</div>
                  </div>
                  <p class="txt">{ item.Title }</p>
                </li>;
              })
            }
          </ul>
        </div>
      </div>
    </div>;
  }
}

export default HotWork;
