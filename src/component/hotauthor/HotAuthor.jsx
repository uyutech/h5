/**
 * Created by army8735 on 2017/8/9.
 */

'use strict';

import util from '../../common/util';
import authorTemplate from '../../component/author/authorTemplate';

let seq = ['ge', 'qu', 'ci', 'cv', 'hun'];

class HotAuthor extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  @bind hasData
  @bind dataList
  autoWidth() {
    let $list = $(this.element).find('.list');
    let $c = $list.find('.c');
    $c.css('width', '9999rem');
    let $ul = $c.find('ul');
    $c.css('width', $ul.width() + 1);
  }
  render() {
    return <div class="cp-hotauthor">
      {
        this.hasData
          ? this.dataList && this.dataList.length
            ? <ul class="list fn-clear">
                {
                  this.dataList.map(function(item) {
                    let type = [];
                    if(item.Authortype) {
                      for(let i = 0, len = item.Authortype.length; i < len; i++) {
                        let code = authorTemplate.code2Data[item.Authortype[i].AuthorTypeID].css;
                        if(code && type.indexOf(code) === -1) {
                          type.push(code);
                        }
                      }
                    }
                    migi.sort(type, function(a, b) {
                      if(seq.indexOf(a) === -1) {
                        return true;
                      }
                      if(seq.indexOf(b) === -1) {
                        return false;
                      }
                      return seq.indexOf(a) > seq.indexOf(b);
                    });
                    return <li>
                      <a href={ `/author/${item.AuthorID}` } class="pic">
                        <img src={ util.autoSsl(util.img120_120_80(item.Head_url
                          || '//zhuanquan.xin/img/head/8fd9055b7f033087e6337e37c8959d3e.png')) }/>
                        {
                          type.slice(0, 2).map(function(item) {
                            return <b class={ 'cp-author-type-' + item }/>;
                          })
                        }
                      </a>
                      <a href={ `/author/${item.AuthorID}` } class="txt">
                        <span class="name">{ item.AuthorName }</span>
                        <span class="fans">粉丝 { util.abbrNum(item.FansNumber) }</span>
                        <span class="comment">留言 { util.abbrNum(item.Popular) }</span>
                      </a>
                      <div class="info">合作{ util.abbrNum(item.CooperationTimes) }次</div>
                    </li>;
                  })
                }
              </ul>
            : <div class="empty">暂无数据</div>
          : <div class="fn-placeholder"/>
      }
    </div>;
  }
}

export default HotAuthor;
