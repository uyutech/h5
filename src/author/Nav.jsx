/**
 * Created by army on 2017/6/16.
 */

import Profile from './Profile.jsx';
import Link from './Link.jsx';
import Tags from './Tags.jsx';

class Nav extends migi.Component {
  constructor(...data) {
    super(...data);
  }
  render() {
    return <div class="nav">
      <div class="bg"/>
      <Profile ref="profile"/>
      <Link ref="link"/>
      <Tags ref="tags"/>
    </div>;
  }
}

export default Nav;
