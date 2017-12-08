/**
 * Created by army8735 on 2017/12/2.
 */

'use strict';

import BotNav from '../component/botnav/BotNav.jsx';
import TopNav from '../component/topnav/TopNav.jsx';
import Find from '../find/Find.jsx';
import ImageView from '../post/ImageView.jsx';

let s = '';
s += migi.preRender(<TopNav/>);
s += migi.preRender(<BotNav/>);
s += migi.preRender(<ImageView ref="imageView"/>);
s += migi.preRender(<Find/>);

export default s;
