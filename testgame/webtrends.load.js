// WebTrends SmartSource Data Collector Tag v10.2.36
// Copyright (c) 2012 Webtrends Inc.  All rights reserved.
// Tag Builder Version: 4.1.0.33
// Created: 2012.08.24
window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        dcsid:"dcseatfr100000knvj9k6cln8_2r4k",
        domain:"statse.webtrendslive.com",
        timezone:-5,
        i18n:true,
        offsite:true,
        download:true,
        downloadtypes:"xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip",
        onsitedoms:"ahh.com",
        fpcdom:".ahh.com",
        plugins:{
            hm:{src:"//s.webtrends.com/js/webtrends.hm.js"},
            facebook:{src:"//s.webtrends.com/js/webtrends.fb.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="webtrends.min.js";    
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());
