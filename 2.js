var list = ["http://weibo.com/u/1750157883", "http://weibo.com/u/1794527151", "http://weibo.com/u/1713573214", "http://weibo.com/u/1419077611", "http://weibo.com/u/1737804444", "http://weibo.com/u/1797123763", "http://weibo.com/u/1730052383", "http://weibo.com/u/1146513833", "http://weibo.com/u/1740666897", "http://weibo.com/u/1796659607", "http://www.weibo.com/u/1775781307", "http://www.weibo.com/u/1782529153", "http://weibo.com/u/1761105235", "http://weibo.com/u/1744721702", "http://weibo.com/u/1651509603", "http://weibo.com/u/1812394167", "http://weibo.com/u/1242549754", "http://weibo.com/u/2187177964", "http://weibo.com/u/1799586437", "http://weibo.com/u/2033875677", "http://weibo.com/u/2830063752", "http://weibo.com/u/1689414080", "http://weibo.com/u/3756542501", "http://weibo.com/u/1734324972", "http://weibo.com/u/1204539127", "http://weibo.com/u/3175697583", "http://weibo.com/u/2830817960", "http://weibo.com/u/1772915217", "http://weibo.com/u/2210250080", "http://weibo.com/u/3303232095", "http://weibo.com/u/1644516981", "http://weibo.com/u/5100943484", "http://weibo.com/u/1913682152", "http://weibo.com/u/2020805287", "http://weibo.com/u/2536410051 ", "http://weibo.com/u/1747816504", "http://weibo.com/u/2264315292", "http://weibo.com/u/1606111614 ", "http://weibo.com/u/1666038940", "http://weibo.com/u/1365168845", "http://weibo.com/u/2955043324", "http://weibo.com/u/1827492905", "http://weibo.com/u/1784197151", "http://weibo.com/u/1744348630", "http://weibo.com/u/1759411151 ", "http://weibo.com/u/1744188571", "http://weibo.com/u/1764431112", "http://weibo.com/u/1743996211", "http://weibo.com/u/1407998352 ", "http://weibo.com/u/1879760353", "http://weibo.com/u/1562989541", "http://weibo.com/u/1797815017", "http://weibo.com/u/1005442811", "http://weibo.com/u/5848096056 ", "http://weibo.com/u/1438245880", "http://weibo.com/u/1787449650", "http://weibo.com/u/1860377384", "http://weibo.com/u/1906818151", "http://weibo.com/u/1654162630", "http://weibo.com/u/2266537042 ", "http://weibo.com/u/1583720744", "http://weibo.com/u/2026955024", "http://weibo.com/u/1532415541", "http://weibo.com/u/1437737072", "http://weibo.com/u/1743974354", "http://weibo.com/u/1805108154", "http://weibo.com/u/1378236401", "http://weibo.com/u/5081844930 ", "http://weibo.com/u/1853863275", "http://weibo.com/u/3106296895", "http://weibo.com/u/2786019241", "http://weibo.com/u/1836589294", "http://weibo.com/u/1827927525", "http://weibo.com/u/2161901265", "http://weibo.com/u/2051709372", "http://weibo.com/u/3963209263", "http://weibo.com/u/1633936332", "http://weibo.com/u/1079220264", "http://weibo.com/u/1621078697", "http://weibo.com/u/1279004761", "http://weibo.com/u/2996425491", "http://weibo.com/u/1745461624 ", "http://weibo.com/u/1266383825", "http://weibo.com/u/1727751591", "http://weibo.com/u/2390481120", "http://weibo.com/u/1751771045", "http://weibo.com/u/3967599844 ", "http://weibo.com/u/5201943314", "http://weibo.com/u/1975307985", "http://weibo.com/u/1913270551", "http://weibo.com/u/2523175962 ", "http://weibo.com/u/1939180022", "http://weibo.com/u/2121705775", "http://weibo.com/u/1077197890", "http://weibo.com/u/2012752133", "http://weibo.com/u/1844046695", "http://weibo.com/u/1954301771", "http://weibo.com/u/5089070363", "http://weibo.com/u/2396461932", "http://weibo.com/u/1761979544", "http://weibo.com/u/1583396223", "http://weibo.com/u/1683354151", "http://weibo.com/u/1764019441", "http://weibo.com/u/1583396223"];

var list2 = [];
list.forEach(function (item, i) {
  if (!/\/u\//.test(item)) {
    console.log(item, i);
    list2.push({
      url: item,
      i: i
    });
  }
});

console.log(list2);

function load() {
  if (list2.length) {
    var item = list2.pop();
    $.get(item.url, function (res) {
      let match = res.match(/\$CONFIG\['oid'\]='(\d+)';/);
      list[item.i] = 'http://weibo.com/u/' + match[1];
      console.log(item.i, list[item.i]);
      console.log(JSON.stringify(list));
      load();
    }, function() {
      load();
    });
  }
  else {
    console.log('fin');
  }
}

load();
