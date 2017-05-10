// Google analytics

$(function() {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', '{{env "GOOGLE_ANALYTICS_KEY"}}', 'auto');
  ga('send', 'pageview');
})


// Intercom

window.intercomSettings = {
  app_id: '{{env "INTERCOM_APP_ID"}}',
}

$(function(){
  var w=window;
  var ic=w.Intercom;
  if(typeof ic==="function"){
    ic('reattach_activator');
    ic('update',intercomSettings);
  }else{
    var d=document;
    var i=function(){i.c(arguments)};
    i.q=[];
    i.c=function(args){i.q.push(args)};
    w.Intercom=i;
    function l(){
      var s=d.createElement('script');
      s.type='text/javascript';
      s.async=true;
      s.src='https://widget.intercom.io/widget/{{env "INTERCOM_APP_ID"}}';
      var x=d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s,x);
    }
    l()
  }
})


// Fullstory
$(function() {
  window['_fs_debug'] = false;
  window['_fs_host'] = 'www.fullstory.com';
  window['_fs_org'] = '{{env "FULLSTORY_ORG_ID"}}';
  window['_fs_namespace'] = 'FS';
  (function(m,n,e,t,l,o,g,y){
      if (e in m && m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].'); return;}
      g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
      o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
      y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
      g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
      g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
      g.clearUserCookie=function(c,d,i){if(!c || document.cookie.match('fs_uid=[`;`]*`[`;`]*`[`;`]*`')){
      d=n.domain;while(1){n.cookie='fs_uid=;domain='+d+
      ';path=/;expires='+new Date(0).toUTCString();i=d.indexOf('.');if(i<0)break;d=d.slice(i+1)}}};
  })(window,document,window['_fs_namespace'],'script','user');
})
