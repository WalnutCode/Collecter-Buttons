/* SiteCatalyst code version: AppMeasurement 2.0.0
Copyright 1996-2013 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com */

//  Version Information
//  1.1 - 05/07/2014 - Saved Cart User
//          - added siteCatalyst_savedCardUser()
//  1.2 - ??/??/2014 - Fixed Quick View / Mini Bag
//          - moved call for siteCatalyst_QuickViewAddToCart() to solution
//          - fixed pageName (evar43)
//  1.4 - 08/27/2014 - Added code to strip out e (email) parameter from URL
//  1.5 - 09/03/2014 - Added UTM variables in URL to get stored in eVars
//  1.6 - 09/24/2014 - Fixed source parse to find it anywhere within the URL
//  1.7 - 10/17/2014 - Added recommended products click interaction with Rich Recs and internal distinction
//  1.8 - 10/27/2014 - Added site ID and host name to recommended click throughs
//  1.9 - 1/29/2015 - Fixed cookie issue with crossVisitParticipation function being called too often
//  1.10 - 2/23/2015 - T140Sale A/B test changes
//  1.10.2 - 2/26/2015 - Added UID conversion and cookie support
//  1.10.3 - 3/5/2015 - Added pinch zoom event tracking
//  2.0.0 - 5/8/2015 - Updated to use new Adobe AppMeasurement.js. DTI Support. Colorswatch support.
//  2.0.1 - 6/30/2015 - Fixed mobile RR & referral support. Added type-ahead tracking
//  2.0.2 - 8/2015 - Colorswatch fixes. Removed some comments. Added Address Verification tracking.
//  2.0.3 - 8/2015 - Typeahead tracking changes. Visa Checkout tracking. Disabled Colorswatch tracking.
//  2.0.4 - 9/2015 - Colorswatch fixes. Out of stock tracking. Foundation updates.
//  2.0.5 - 10/2015 - Site redesign updates. Email tracking. General search updates.
//  2.0.6 - 11/2015 - Search refinements. Inventory error updates.
//2.0.8.0             MasterPass tracking
//2.0.9.0   4/20/2016  Mobile filter button tracking
//2.0.9.1   4/21/2016   Mobile filter button tracking - adding vars to tracking vars
//2.0.9.2   4/21/2016   Selector Change
/*2.0.11.0  7/14/2016   PayPal tracking. We capture the payment method for pay pal but the tracking of people leaving the site to interact with pay pal and then returning is messed up. We can capture more returns from pay pal than people clicking to go to pay pal. The variables in Omniture are prop9 and eVar28.
                        The second relates to 3C. We currently capture campaignsf by populating eVar/prop71 with the string that follows /source/. In 3C we’re going use a query string parameter _s to populate that data. We should enable that as an option (when /source/ does not exist) to ease the transition to 3C from TCS.
						*/
// 2.0.12.0  8/5/2016    eVar53 was being overwritten  
// 2.0.16.0  7/12/2107 Added free shipping coupon tracking.                       
// 2.0.17.0  8/23/2017 Added error message capture - RMC                      
// 2.0.17.1  10/30/2017 Removing broken free shipping coupon tracking. 'FreeShippingBannerEnabled' is not defined in TCS.Settings. - RMC
// 2.0.17.2 03/07/2018  Adding a conditional statement for JCPenney to set cookies at sportsfanshop.jcpenney.com instead of just jcpenney.com - RMC 

// fanatics_s_account should be set prior to calling this s_code file.


var $s = s_gi(fanatics_s_account);
/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
/* Conversion Config */
$s.currencyCode = "USD";
/* Link Tracking Config */
$s.trackDownloadLinks = true;
$s.trackExternalLinks = true;
$s.trackInlineStats = true;
$s.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";
$s.linkInternalFilters = "javascript:,.fanatics.com,.footballfanatics.com,localhost,127.0.0.1,www.paypal.com,integration.richrelevance.com";
$s.linkLeaveQueryString = false;
$s.linkTrackVars = "None";
$s.linkTrackEvents = "None";

var langCodes = {
    en: { name: "English" },
    fr: { name: "French Canadian" }
};

/* WARNING: Changing any of the below variables will cause drastic changes to how your visitor data is collected.  Changes should only be made when instructed to do so by your account manager.*/
$s.visitorNamespace = "fanatics";
$s.trackingServer = "fanatics.112.2o7.net";
$s.dc = "112";

// UTM Global Variables
var sc_utm_source = '';
var sc_utm_medium = '';
var sc_utm_term = '';
var sc_utm_content = '';
var sc_utm_campaign = '';
var sc_placement = '';
var sc_adposition = '';
var sc_affiliateid = '';
var sc_matchtype = '';
var sc_adtype = '';
var sc_email = '';
var sc_search = '';

// Setup User Agent and Hostname
$s.eVar54 = document.location.hostname;
$s.prop54 = document.location.hostname;
// The referrer of the tracking call is the current page URL.
$s.prop50 = "D=Referer";
$s.eVar50 = "D=Referer"; // "Referer" with one r is the correct spelling of this header.
// The "r" parameter in the tracking call is the referring URL.
$s.prop51 = "D=r";
$s.eVar51 = "D=r";

var s_prevPageType = '';

var sc_cookies = document.cookie;
var sc_cookieNames = sc_cookies.split(';');
jQuery.each(sc_cookieNames, function (i, item) {
    if (jQuery.trim(item).toLowerCase() == "t140sale=a") {
        $s.prop38 = "111,1111,1";
    }
    if (jQuery.trim(item).toLowerCase() == "t140sale=b") {
        $s.prop38 = "222,2222,2";
    }
});
//Setup Clickmap
function s_getObjectID(o) {
    var ID = o.href;
    return ID;
}
$s.getObjectID = s_getObjectID;
/* Configure Channel Manager */
$s._channelParameter = "Paid Search|pcrid";
$s._channelPattern = "email|EML";
/* Plugin Config */
$s.usePlugins = true;

function s_doPlugins(fanatics_s_code) {
    // Page view call actions
    if (!$s.linkType) {
        // Add event30 (custom page view event) to s.events for all page view calls
        $s.events = $s.apl($s.events, 'event30', ',', 2);
    }
    //set current domain in linkInternalFilters
    $s.getLinkInternalDomain();
    // Put pageName in prop22 & eVar43 for correlation to other variables, especially in link tracking calls, which do not record pageName
    if ($s.pageName) {
        $s.prop22 = $s.eVar43 = $s.pageName;
    }
    // Add calls to plugins here
    // Copy search term and set aggregate search event
    if ($s.prop4 && !sc_search) {
        $s.eVar1 = $s.prop4;
        $s.events = $s.apl($s.events, 'event1', ',', 2);

        var typeAheadSearchSubmit = $s.c_r('s_tssub');
        if (typeAheadSearchSubmit) {
            $s.c_w('s_tssub', '');
        }
        // Do not refire search events if the same search term passed in twice in a row or this is a bookmarked/typed visit
        var t_search = $s.getValOnce($s.prop4, 's_stv', 0);
        if (t_search == '' || !typeAheadSearchSubmit) {
            var a = $s.split($s.events, ',');
            var e = '';
            for (var i = 0; i < a.length; i++) {
                if (a[i] == 'event1' || a[i] == 'event2' || a[i] == 'event4') {
                    continue;
                }
                else {
                    e += a[i] ? a[i] + ',' : a[i];
                }
            }
            $s.events = e.substring(0, e.length - 1);

            // Clear out properties
            $s.eVar1 = $s.prop4 = $s.prop5 = $s.prop6 = '';
        }
        //Get Page Prior to Search
        var s_prevPage = $s.getPreviousValue($s.pageName, 's_prevPage', 0);
        if (s_prevPage) {
            $s.prop8 = s_prevPage;
        }
        else {
            $s.prop8 = "non-internal referrer to search results";
        }
        //Get PageType Prior to Search
        s_prevPageType = $s.getPreviousValue($s.prop3, 's_prevProp3', 0);
        if (s_prevPageType) {
            $s.prop10 = s_prevPageType;
        }
        else {
            $s.prop10 = "non-internal referrer to search results";
        }
    }
    // Copy search type prop into eVar
    if ($s.prop7) {
        $s.eVar2 = $s.prop7;
    }
    // automate event27 (more than 3000 search results)
    if ($s.prop5 && parseInt($s.prop5) > 3000) {
        $s.events = $s.apl($s.events, "event27", ",", 2);
    }
    // Automate Custom ProdView Event
    if ($s.events && $s.events.indexOf('prodView') > -1) {
        $s.events = $s.apl($s.events, 'event5', ',', 2);
    }
    // Automate Finding Method eVar
    var internalFlag = false;
    if (document.referrer) {
        var filters = $s.split($s.linkInternalFilters, ',');
        var docRef = $s.split(document.referrer, '/');
        docRef = docRef[2];
        for (var f in filters) {
            if (docRef.indexOf(filters[f]) > -1) {
                internalFlag = true;
            }
        }
    }
    // create productmerch product for merchandising eVar binding
    if ((!$s.products || ($s.products && $s.products.indexOf(';productmerch') > -1) || $s.newProduct == 'true')) {
        if (!$s.c_r('productnum')) {
            $s.productNum = 1;
        }
        else {
            $s.productNum = parseInt($s.c_r('productnum')) + 1;
        }
        $s.products = ';productmerch' + $s.productNum;          //record an instance with orig allocation - must bind to brand new product every time
        var e = new Date();
        e.setTime(e.getTime() + (30 * 86400000));
        $s.c_w('productnum', $s.productNum, e);
        if ($s.linkTrackVars == "None" || $s.linkTrackVars == '') {
            $s.linkTrackVars = 'events,products';
        }
        else {
            $s.linkTrackVars = $s.apl($s.linkTrackVars, 'events,products', ',', 2);
        }
        if ($s.linkTrackEvents == "None" || $s.linkTrackEvents == '') {
            $s.linkTrackEvents = 'event15';
        }
        else {
            $s.linkTrackEvents = $s.apl($s.linkTrackEvents, 'event15', ',', 2);
        }
        $s.events = $s.apl($s.events, 'event15', ',', 2);
    }
    else if ($s.products) {
        $s.events = $s.apl($s.events, 'event15', ',', 2);
    }
    if ($s.c_r('productnum') && $s.events.indexOf('purchase') > -1) {
        $s.c_w('productnum', '0', 0);
    }
    //  Automate OrderID eVar
    if ($s.purchaseID) {
        $s.eVar21 = $s.purchaseID;
    }
    // Set Internal Campaign
    if (!$s.eVar5) {
        $s.eVar5 = $s.Util.getQueryParam('ab');
        $s.eVar5 = $s.getValOnce($s.eVar5, 's_ev5', 0);
    }

    if (!$s.eVar53) {
       $s.eVar53 = $s.Util.getQueryParam('_s');
       $s.prop53 =  $s.eVar53;
       $s.eVar53 = $s.getValOnce($s.eVar53, 's_ev53', 0);
   }

    // Set Campaign Variables
    var s_InUrl = window.location.href;
    var s_Url = "";
    s_InUrl = s_InUrl.split('&');
    jQuery.each(s_InUrl, function (i, item) {
        if (item.substr(0, 2) !== "e=") {
            s_Url = s_Url + '&' + item;
        }
    });
    s_Url = s_Url.substr(1, s_Url.length);
    var s_Cpgn = parseSource(s_Url);

    // Set s.campaign to <channel>|<referring domain>|<keywords>|<campaign code>
    $s.campaign = "";
    // Referring Domain
    if (($s._referringDomain) && ($s._referringDomain != "Typed/Bookmarked")) {
        $s.campaign += $s._referringDomain;
    }
    else {
        $s.campaign += "n/a";
    }
    $s.campaign += "|";
    // Keywords
    if ($s._keywords) {
        $s.campaign += $s._keywords;
    }
    else {
        $s.campaign += "n/a";
    }
    $s.campaign += "|";
    // Campaign Code
    if (s_Cpgn && s_Cpgn != "n/a") {
        $s.campaign += s_Cpgn;
        $s.eVar53 = s_Cpgn;
        $s.prop53 = s_Cpgn;
    }
    else {
        $s.campaign += "n/a";
    }
    // Blank out campaign when no channel or campaign was detected
    if ($s.campaign.indexOf('n/a|n/a|n/a') > -1) {
        $s.campaign = "";
    }
    // Set Partner ID Variables
    if (typeof sc_PSID != 'undefined' && sc_PSID != '') {
        $s.eVar16 = sc_PSID;
        $s.prop11 = sc_PSID;
    }
    else {
        $s.eVar16 = window.location.hostname;
        $s.prop11 = window.location.hostname;
    }
    // Set Cart Created Date
    if (!!$s.events && $s.events.indexOf("scOpen") > -1) {
        var e = new Date();
        $s.eVar47 = e.getMonth() + 1 + '/' + e.getDate() + '/' + e.getFullYear();
    }
    // Lowercase all variables
    $s.manageVars('lowercaseVars');

    // Colorswatch event tracking
    var clickedPid = $s.c_r("s_clickedPid");
    if (clickedPid && typeof ($s.prop3) != 'undefined' && $s.prop3.toLowerCase() == 'pdp') {
        jQuery("a.pdpColorSwatchContainer").each(function (index) {
            var itemPid = jQuery(this).data("pid").toString();
            if (clickedPid === itemPid) {
                $s.events = $s.apl($s.events, "event60", ",", 0);
                $s.c_w("s_clickedPid", "", new Date(Date.now()));
                return false;
            }
        });
        jQuery("div.b-swatch-inner").each(function (index) {
            var itemPid = jQuery(this).data("product-id").toString();
            if (clickedPid === itemPid) {
                $s.events = $s.apl($s.events, "event60", ",", 0);
                $s.c_w("s_clickedPid", "", new Date(Date.now()));
                return false;
            }
        });
    }
	// JCPenney Specific Code - set cookies at sportsfanshop.jcpenney.com instead of just jcpenney.com - RMC 03/07/2018
	 if (typeof sc_PSID != 'undefined' && sc_PSID != '' && sc_PSID == 14088)
	 {
		// $s.cookieDomainPeriods = "3";
		$s.cookieDomain = "sportsfanshop.jcpenney.com";
    }
}
$s.doPlugins = s_doPlugins;

/******************** CONVENIENCE FUNCTIONS *************************/
function s_findMethod(findMethod) {
    $s.tl(true, 'o', findMethod);
}
function s_beginCheckout(products) {
    $s.linkTrackVars = 'eVar28,prop9,events,products,prop11,prop54,eVar16,eVar54';
    $s.linkTrackEvents = 'scCheckout';
    $s.events = 'scCheckout';
    $s.eVar28 = 'Checkout';
    $s.prop9 = 'Checkout';
    $s.products = products;
    $s.tl(true, 'o', 'Checkout');
}
function linkInteraction(elem, linkName) {
    $s.linkTrackVars = 'eVar28,prop9,eVar43';
    $s.eVar28 = linkName;
    $s.prop9 = linkName;
    if ($s.pageName) {
        $s.eVar43 = $s.pageName;
    }
    $s.tl(elem, 'o', linkName);
    return false;
}
/* Used to parse campaign code from URL */
function parseSource(pUrl) {
    if (pUrl.indexOf("/source") > -1) {
        var iBegin = pUrl.indexOf("/source") + 8;
        var iEnd = pUrl.length;
        pUrl = pUrl.substr(iBegin, iEnd);
        if (pUrl.indexOf("/") > -1) {
            iEnd = pUrl.indexOf("/");
        } else {
            if (pUrl.indexOf("?") > -1) {
                iEnd = pUrl.indexOf("?");
            } else {
                iEnd = pUrl.length;
            }
        }
        pUrl = pUrl.substr(0, iEnd);
    } else {
        pUrl = "n/a";
    }
    return pUrl.toLowerCase();
}
/************************** PLUGINS SECTION *************************/
/* You may insert any plugins you wish to use here. */
/* Function: getLinkInternalDomain - parse the URL and return the domain for linkInternalFilter string */
$s.getLinkInternalDomain = function () {
    var s_InUrl = window.location.href;
    var s_Url = '';
    s_InUrl = s_InUrl.split('&');
    jQuery.each(s_InUrl, function (i, item) {
        if (item.substr(0, 2) !== 'e=') {
            s_Url = s_Url + '&' + item;
        }
    }
    );
    s_Url = s_Url.substr(1, s_Url.length);
    var urlString = s_Url;
    var urlPattern = new RegExp('(http|https)://(.*?)/.*$');
    var parsedUrl = urlString.match(urlPattern);
    var domain = parsedUrl[2];
    var parts = domain.split('.');
    if (parts.length > 2) {
        parts.shift();
        domain = parts.join('.');
    }
    else {
        domain = domain;
    }
    $s.linkInternalFilters = $s.linkInternalFilters + ',' + domain;
};

/* Utility manageVars v2.0.0 - Calls function to apply to variables
   Currently used to apply lowerCaseVars function to app variables. (requires split 1.5) */
$s.manageVars = function (c, l, f) {
    var s = this, vl, la, vla;
    l = l ? l : '';
    f = f ? f : 1;
    if (!s[c]) {
        return false;
    }
    vl = 'pageName,purchaseID,channel,server,pageType,campaign,state,zip,events,products,transactionID';
    for (var n = 1; n < 76; n++) {
        vl += ',prop' + n + ',eVar' + n + ',hier' + n;
    }
    if (l && (f == 1 || f == 2)) {
        if (f == 1) {
            vl = l;
        }
        if (f == 2) {
            la = s.split(l, ',');
            vla = s.split(vl, ',');
            vl = '';
            for (x in la) {
                for (y in vla) {
                    if (la[x] == vla[y]) {
                        vla[y] = '';
                    }
                }
            }
            for (y in vla) {
                vl += vla[y] ? ',' + vla[y] : '';
            }
        }
        s.pt(vl, ',', c, 0);
        return true;
    }
    else if (l == '' && f == 1) {
        s.pt(vl, ',', c, 0);
        return true;
    }
    else {
        return false;
    }
};
$s.clearVars = function (t) {
    var s = this;
    s[t] = '';
};
$s.lowercaseVars = function (t) {
    var s = this;
    if (s[t] && t != 'events') {
        s[t] = s[t].toString();
        if (s[t].indexOf('D=') != 0) {
            s[t] = s[t].toLowerCase();
        }
    }
};
$s.pt = function (x, d, f, a) {
    var s = this, t = x, z = 0, y, r;
    while (t) {
        y = t.indexOf(d);
        y = y < 0 ? t.length : y;
        t = t.substring(0, y);
        r = s[f](t, a);
        if (r) {
            return r;
        }
        z += y + d.length;
        t = x.substring(z, x.length);
        t = z < x.length ? t : '';
    }
    return '';
};

/* Plugin: getValOnce v1.1 
   v - Value to set/check
   c - The name of the cookie to set
   e - expiration time multiplier, pass in 0 to set indefinitely
   t - If 'm' is passed in, 10 second expiration base value, otherwise 24 hours
*/
$s.getValOnce = function (v, c, e, t) {
    var s = this, a = new Date, v = v ? v : '', c = c ? c : 's_gvo', e = e ? e : 0, i = t == 'm' ? 10000 : 86400000;
    var k = s.c_r(c);
    if (v) {
        a.setTime(a.getTime() + e * i);
        s.c_w(c, v, e == 0 ? 0 : a);
    }
    return v == k ? '' : v;
};

/* Utility Function: split v1.5 - split a string (JS 1.0 compatible) */
$s.split = function (l, d) {
    var i, x = 0, a = new Array;
    while (l) {
        i = l.indexOf(d);
        i = i > -1 ? i : l.length;
        a[x++] = l.substring(0, i);
        l = l.substring(i + d.length);
    }
    return a;
};

/* Plugin Utility: apl v2.0
    l = Event property ex: $s.events
    v = Event that needs to be added ex: 'Event30'
    d = The character to perform the split between 'l', ex: l = 'Event15, Event30'
    u = If set to 1, perform a case sensitive comparison to see if value of 'v' is already in 'l'. Else, perform a case-insenstive comparison.
*/
$s.apl = function (l, v, d, u) {
    var s = this, m = 0;
    if (!l) {
        l = '';
    }
    if (u) {
        var i, n, a = s.split(l, d);
        for (i = 0; i < a.length; i++) {
            n = a[i];
            m = m || (u == 1 ? (n == v) : (n.toLowerCase() == v.toLowerCase()));
        }
    }
    if (!m) {
        l = l ? l + d + v : v;
    }
    return l;
};

/* Function - read combined cookies v 2.0.0 */
if (!$s.__ccucr) {
    $s.c_rr = $s.Util.cookieRead;
    $s.__ccucr = true;
    function c_r(k) {
        var s = this, d = new Date, v = s.c_rr(k), c = s.c_rr('s_pers'), i, m, e;
        if (v) {
            return v;
        }
        k = $s.Util.urlEncode(k);
        i = c.indexOf(' ' + k + '=');
        c = i < 0 ? s.c_rr('s_sess') : c;
        i = c.indexOf(' ' + k + '=');
        m = i < 0 ? i : c.indexOf('|', i);
        e = i < 0 ? i : c.indexOf(';', i);
        m = m > 0 ? m : e;
        v = i < 0 ? '' : $s.Util.urlDecode(c.substring(i + 2 + k.length, m < 0 ? c.length : m));
        if (m > 0 && m != e) {
            if (parseInt(c.substring(m + 1, e < 0 ? c.length : e)) < d.getTime()) {
                d.setTime(d.getTime() - 60000);
                s.c_w($s.Util.urlDecode(k), '', d);
                v = '';
            }
        }
        return v;
    }
    $s.c_r = c_r;
}

if (!$s.__ccucw) {
    $s.c_wr = $s.Util.cookieWrite;
    $s.__ccucw = true;
    /* Function - write combined cookies v 2.0.0 
        k - The key to write
        v - Value
        e - Expiration date
    */
    function c_w(k, v, e) {
        var s = this, d = new Date, ht = 0, pn = 's_pers', sn = 's_sess', pc = 0, sc = 0, pv, sv, c, i, t;
        d.setTime(d.getTime() - 60000);
        if (s.c_rr(k)) {
            s.c_wr(k, '', d);
        }
        k = $s.Util.urlEncode(k);
        pv = s.c_rr(pn);
        i = pv.indexOf(' ' + k + '=');
        if (i > -1) {
            pv = pv.substring(0, i) + pv.substring(pv.indexOf(';', i) + 1);
            pc = 1;
        }
        sv = s.c_rr(sn);
        i = sv.indexOf(' ' + k + '=');
        if (i > -1) {
            sv = sv.substring(0, i) + sv.substring(sv.indexOf(';', i) + 1);
            sc = 1;
        }
        d = new Date;
        if (e) {
            if (e.getTime() > d.getTime()) {
                pv += ' ' + k + '=' + $s.Util.urlEncode(v) + '|' + e.getTime() + ';';
                pc = 1;
            }
        }
        else {
            sv += ' ' + k + '=' + $s.Util.urlEncode(v) + ';';
            sc = 1;
        }
        sv = sv.replace(/%00/g, '');
        pv = pv.replace(/%00/g, '');
        if (sc) {
            s.c_wr(sn, sv, 0);
        }
        if (pc) {
            t = pv;
            while (t && t.indexOf(';') != -1) {
                var t1 = parseInt(t.substring(t.indexOf('|') + 1, t.indexOf(';')));
                t = t.substring(t.indexOf(';') + 1); ht = ht < t1 ? t1 : ht;
            }
            d.setTime(ht);
            s.c_wr(pn, pv, d);
        }
        return v == s.c_r($s.Util.urlDecode(k));
    }
    $s.c_w = c_w;
}

/* Plugin Utility: Replace v2.0 */
$s.repl = function (x, o, n) {
    var i = x.indexOf(o), l = n.length;
    while (x && i >= 0) {
        x = x.substring(0, i) + n + x.substring(i + o.length);
        i = x.indexOf(o, i + l)
    }
    return x;
}


/* Plugin: getPreviousValue v2.0.0 - return previous value of designated variable (requires split utility)
   v - Property to write new value to the provided key (c)
   c - Cookie key to return previous value(overwritten by value in v)
   el - Events (comma separated) to read from cookie. First match is returned.
   Expiration is set to 30 minutes
 */
$s.getPreviousValue = function (v, c, el) {
    var s = this, t = new Date, i, j, r = '';
    t.setTime(t.getTime() + 1800000);
    if (el) {
        if (s.events) {
            i = s.split(el, ',');
            j = s.split(s.events, ',');
            for (x in i) {
                for (y in j) {
                    if (i[x] == j[y]) {
                        if (s.c_r(c)) {
                            r = s.c_r(c);
                        }
                        v ? s.c_w(c, v, t) : s.c_w(c, 'no value', t);
                        return r;
                    }
                }
            }
        }
    }
    else {
        if (s.c_r(c)) {
            r = s.c_r(c);
        }
        v ? s.c_w(c, v, t) : s.c_w(c, 'no value', t);
        return r;
    }
};

/* Plugin Utility - first only */
$s.p_fo = function (n) {
    var s = this;
    if (!s.__fo) {
        s.__fo = new Object;
    }
    if (!s.__fo[n]) {
        s.__fo[n] = new Object;
        return 1;
    }
    else {
        return 0;
    }
};

/* s.join: 2.0 - Joins an array into a string */
$s.join = function (v, p) {
    var s = this;
    var f, b, d, w;
    if (p) {
        f = p.front ? p.front : '';
        b = p.back ? p.back : '';
        d = p.delim ? p.delim : '';
        w = p.wrap ? p.wrap : '';
    }
    var str = '';
    for (var x = 0; x < v.length; x++) {
        if (typeof (v[x]) == 'object') {
            str += s.join(v[x], p);
        }
        else {
            str += w + v[x] + w;
        }
        if (x < v.length - 1) {
            str += d;
        }
    }
    return f + str + b;
}

/* Top 130 Search Engines */
$s.seList = "altavista.co|q,r|AltaVista>aol.co.uk,search.aol.co.uk|query"
+ "|AOL - United Kingdom>search.aol.com,search.aol.ca|query,q|AOL.com "
+ "Search>ask.com,ask.co.uk|ask,q|Ask Jeeves>www.baidu.com|wd|Baidu>da"
+ "um.net,search.daum.net|q|Daum>google.co,googlesyndication.com|q,as_"
+ "q|Google>google.com.ar|q,as_q|Google - Argentina>google.com.au|q,as"
+ "_q|Google - Australia>google.at|q,as_q|Google - Austria>google.com."
+ "bh|q,as_q|Google - Bahrain>google.com.bd|q,as_q|Google - Bangladesh"
+ ">google.be|q,as_q|Google - Belgium>google.com.bo|q,as_q|Google - Bo"
+ "livia>google.ba|q,as_q|Google - Bosnia-Hercegovina>google.com.br|q,"
+ "as_q|Google - Brasil>google.bg|q,as_q|Google - Bulgaria>google.ca|q"
+ ",as_q|Google - Canada>google.cl|q,as_q|Google - Chile>google.cn|q,a"
+ "s_q|Google - China>google.com.co|q,as_q|Google - Colombia>google.co"
+ ".cr|q,as_q|Google - Costa Rica>google.hr|q,as_q|Google - Croatia>go"
+ "ogle.cz|q,as_q|Google - Czech Republic>google.dk|q,as_q|Google - De"
+ "nmark>google.com.do|q,as_q|Google - Dominican Republic>google.com.e"
+ "c|q,as_q|Google - Ecuador>google.com.eg|q,as_q|Google - Egypt>googl"
+ "e.com.sv|q,as_q|Google - El Salvador>google.ee|q,as_q|Google - Esto"
+ "nia>google.fi|q,as_q|Google - Finland>google.fr|q,as_q|Google - Fra"
+ "nce>google.de|q,as_q|Google - Germany>google.gr|q,as_q|Google - Gre"
+ "ece>google.com.gt|q,as_q|Google - Guatemala>google.hn|q,as_q|Google"
+ " - Honduras>google.com.hk|q,as_q|Google - Hong Kong>google.hu|q,as_"
+ "q|Google - Hungary>google.co.in|q,as_q|Google - India>google.co.id|"
+ "q,as_q|Google - Indonesia>google.ie|q,as_q|Google - Ireland>google."
+ "is|q,as_q|Google - Island>google.co.il|q,as_q|Google - Israel>googl"
+ "e.it|q,as_q|Google - Italy>google.com.jm|q,as_q|Google - Jamaica>go"
+ "ogle.co.jp|q,as_q|Google - Japan>google.jo|q,as_q|Google - Jordan>g"
+ "oogle.co.ke|q,as_q|Google - Kenya>google.co.kr|q,as_q|Google - Kore"
+ "a>google.lv|q,as_q|Google - Latvia>google.lt|q,as_q|Google - Lithua"
+ "nia>google.com.my|q,as_q|Google - Malaysia>google.com.mt|q,as_q|Goo"
+ "gle - Malta>google.mu|q,as_q|Google - Mauritius>google.com.mx|q,as_"
+ "q|Google - Mexico>google.co.ma|q,as_q|Google - Morocco>google.nl|q,"
+ "as_q|Google - Netherlands>google.co.nz|q,as_q|Google - New Zealand>"
+ "google.com.ni|q,as_q|Google - Nicaragua>google.com.ng|q,as_q|Google"
+ " - Nigeria>google.no|q,as_q|Google - Norway>google.com.pk|q,as_q|Go"
+ "ogle - Pakistan>google.com.py|q,as_q|Google - Paraguay>google.com.p"
+ "e|q,as_q|Google - Peru>google.com.ph|q,as_q|Google - Philippines>go"
+ "ogle.pl|q,as_q|Google - Poland>google.pt|q,as_q|Google - Portugal>g"
+ "oogle.com.pr|q,as_q|Google - Puerto Rico>google.com.qa|q,as_q|Googl"
+ "e - Qatar>google.ro|q,as_q|Google - Romania>google.ru|q,as_q|Google"
+ " - Russia>google.st|q,as_q|Google - Sao Tome and Principe>google.co"
+ "m.sa|q,as_q|Google - Saudi Arabia>google.com.sg|q,as_q|Google - Sin"
+ "gapore>google.sk|q,as_q|Google - Slovakia>google.si|q,as_q|Google -"
+ " Slovenia>google.co.za|q,as_q|Google - South Africa>google.es|q,as_"
+ "q|Google - Spain>google.lk|q,as_q|Google - Sri Lanka>google.se|q,as"
+ "_q|Google - Sweden>google.ch|q,as_q|Google - Switzerland>google.com"
+ ".tw|q,as_q|Google - Taiwan>google.co.th|q,as_q|Google - Thailand>go"
+ "ogle.bs|q,as_q|Google - The Bahamas>google.tt|q,as_q|Google - Trini"
+ "dad and Tobago>google.com.tr|q,as_q|Google - Turkey>google.com.ua|q"
+ ",as_q|Google - Ukraine>google.ae|q,as_q|Google - United Arab Emirat"
+ "es>google.co.uk|q,as_q|Google - United Kingdom>google.com.uy|q,as_q"
+ "|Google - Uruguay>google.co.ve|q,as_q|Google - Venezuela>google.com"
+ ".vn|q,as_q|Google - Viet Nam>google.co.vi|q,as_q|Google - Virgin Is"
+ "lands>icqit.com|q|icq>bing.com|q|Microsoft Bing>myway.com|searchfor"
+ "|MyWay.com>naver.com,search.naver.com|query|Naver>netscape.com|quer"
+ "y,search|Netscape Search>reference.com|q|Reference.com>seznam|w|Sez"
+ "nam.cz>abcsok.no|q|Startsiden>tiscali.it|key|Tiscali>virgilio.it|qs"
+ "|Virgilio>yahoo.com,search.yahoo.com|p|Yahoo!>ar.yahoo.com,ar.searc"
+ "h.yahoo.com|p|Yahoo! - Argentina>au.yahoo.com,au.search.yahoo.com|p"
+ "|Yahoo! - Australia>ca.yahoo.com,ca.search.yahoo.com|p|Yahoo! - Can"
+ "ada>fr.yahoo.com,fr.search.yahoo.com|p|Yahoo! - France>de.yahoo.com"
+ ",de.search.yahoo.com|p|Yahoo! - Germany>hk.yahoo.com,hk.search.yaho"
+ "o.com|p|Yahoo! - Hong Kong>in.yahoo.com,in.search.yahoo.com|p|Yahoo"
+ "! - India>yahoo.co.jp,search.yahoo.co.jp|p,va|Yahoo! - Japan>kr.yah"
+ "oo.com,kr.search.yahoo.com|p|Yahoo! - Korea>mx.yahoo.com,mx.search."
+ "yahoo.com|p|Yahoo! - Mexico>ph.yahoo.com,ph.search.yahoo.com|p|Yaho"
+ "o! - Philippines>sg.yahoo.com,sg.search.yahoo.com|p|Yahoo! - Singap"
+ "ore>es.yahoo.com,es.search.yahoo.com|p|Yahoo! - Spain>telemundo.yah"
+ "oo.com,espanol.search.yahoo.com|p|Yahoo! - Spanish (US : Telemundo)"
+ ">tw.yahoo.com,tw.search.yahoo.com|p|Yahoo! - Taiwan>uk.yahoo.com,uk"
+ ".search.yahoo.com|p|Yahoo! - UK and Ireland>yandex|text|Yandex.ru>s"
+ "earch.cnn.com|query|CNN Web Search>search.earthlink.net|q|Earthlink"
+ " Search>search.comcast.net|q|Comcast Search>search.rr.com|qs|RoadRu"
+ "nner Search>optimum.net|q|Optimum Search";

/********************** CUSTOM FUNCTIONS SECTION ********************/
/* You may insert any custom functions you wish to use here.        */
var fid = $s.c_r('s_fid').split('-');
$s.eVar75 = '';
for (i = 0; i < fid.length; i++) {
    $s.eVar75 += hexToDec(fid[i]);
}
if ($s.eVar75) {
    $s.Util.cookieWrite('s_fuid', $s.eVar75);
}

$s.prop40 = pageLanguage() + '|' + pageCurrency();

function pageLanguage() {
    var lang = jQuery("html").attr("lang");
    if (!lang) {
        lang = "en";
    }
    var langName = getLanguageName(lang);
    if (!langName) {
        return 'English';
    }
    return langName;
}
function getLanguageName(languageCode) {
    if (!languageCode) {
        return null;
    }
    var lwrd = languageCode.toLowerCase();
    var item = langCodes[lwrd];
    if (!item) {
        return null;
    }
    return item.name;
}
function pageCurrency() {
    if (typeof (TCS.Settings.currencyCode) != 'undefined') {
        return TCS.Settings.currencyCode;
    }
    else {
        var currencyMeta = jQuery("meta[itemprop='priceCurrency']");
        if (!currencyMeta) {
            return 'USD';
        }
        if (!currencyMeta.attr("content")) {
            return 'USD';
        }

        return currencyMeta.attr("content");
    }
}

// Inventory Functions
jQuery(document).on("cart.inventory.outofstock.tracking", function (event, data, formName, message, sku, pid) {
    if (typeof (pid) == 'undefined' || !pid) {
        var pIdx = $s.products.indexOf(';;;;');
        if (pIdx > 0) {
            var pStr = $s.products.substring(0, pIdx + 4);
            $s.products = pStr + "eVar22=" + sku;
        }
    }
    else {
        $s.products = ";" + pid + ";;;;eVar22=" + sku;
    }
    $s.events = "event51,event68,event35";
    setupPsIdHostNameTracking();
    $s.eVar82 = message;
    $s.prop12 = formName;
    $s.linkTrackEvents = "event51,event68,event35";
    $s.linkTrackVars = "events,products,prop11,eVar16,prop54,eVar54,prop13,prop50,eVar50,prop3,eVar62,prop59,eVar59,prop52,eVar52,prop22,eVar43,eVar13,eVar82,prop12,prop29";
    $s.tl(true, "o", "Cart Inventory - Out of Stock");
});

// Error Message Capture
jQuery(document).on("message.error.tracking", function (event, message, source) {
    $s.events = "event51";
    $s.eVar82 = message + '|' + source;
    $s.linkTrackEvents = "event51";
	setupPsIdHostNameTracking();
	if ( $s.prop3 == 'pdp' )
	{
		$s.linkTrackVars = "events,eVar82,prop3,prop11,prop13,prop22,prop40,prop50,prop54,eVar16,eVar43,eVar50,eVar54,eVar62,products,prop31,eVar16,eVar17,eVar19,eVar27";
	}
	else
	{
		$s.linkTrackVars = "events,eVar82,prop3,prop11,prop13,prop22,prop40,prop50,prop54,eVar16,eVar43,eVar50,eVar54,eVar62";
	}
    $s.tl(true, "o", "Error Message - User");
});

// Email Identity Functions
jQuery(document).on("email.useridentity.tracking", function (event, customerId, area) {
    $s.events = "event70";
    $s.eVar57 = customerId;
    if (typeof (area) != 'undefined') {
        if (area == 'footer') {
            $s.eVar86 = $s.prop63 = $s.prop3 + "|" + area;
        }
        else {
            $s.eVar86 = $s.prop63 = area;
        }
    }
    else {
        $s.eVar86 = $s.prop63 = $s.prop3;
    }

    $s.linkTrackEvents = "event70";
    $s.linkTrackVars = "events,eVar57,eVar86,prop63,prop11,prop54,prop13,prop22,prop50,prop40,eVar16,eVar54,eVar62,eVar43,eVar50";
    $s.tl(true, "o", "Email - User Identity");
});

// Custom function for Product Quick View
function siteCatalyst_ProdQuickView(productID, inStock, outStock, isSale, prodName) {
    $s.pageName = "Quick View: " + prodName;
    $s.events = "prodView,event6";
    $s.products = ";" + productID + ";;;;";
    $s.prop3 = "pdp";
    $s.eVar62 = "pdp";
    $s.eVar8 = sc_TeamName.split("_").join(" ");
    $s.prop2 = sc_TeamName.split("_").join(" ");
    $s.prop1 = sc_LeagueName;
    $s.eVar7 = sc_LeagueName;
    $s.eVar17 = isSale;
    $s.eVar18 = inStock;
    $s.eVar19 = outStock;
    $s.linkTrackVars = "events,products,eVar8,eVar17,eVar18,eVar19,prop11,prop54,prop13,prop22,prop50,prop40,eVar16,eVar54,eVar43,eVar50";
    $s.linkTrackEvents = 'prodView,event6';
    var clickedPid = $s.c_r("s_clickedPid");
    if (clickedPid == productID) {
        $s.events = $s.apl($s.events, "event60", ",", 0);
        $s.linkTrackEvents = $s.apl($s.linkTrackEvents, "event60", ",", 0);
        $s.c_w("s_clickedPid", "", new Date(Date.now()));
    }
    $s.tl(true, 'o', 'Product QuickView');
}
// Custom function for Product Quick View Add to Cart
function siteCatalyst_QuickViewAddToCart(pid, sku, cartCount, qty) {
    var cartEvents = "scAdd";
    if (cartCount - qty == 0) {
        cartEvents += ",scOpen";
    }
    $s.events = cartEvents;
    $s.products = ";" + pid + ";;;;eVar22=" + sku;
    $s.eVar20 = cartCount;
    $s.prop3 = "cart";
    $s.eVar62 = "cart";
    $s.linkTrackVars = "events,products,eVar20,prop11,prop54,prop13,prop22,prop50,prop40,eVar16,eVar54,eVar43,eVar50";
    $s.linkTrackEvents = 'scAdd,scOpen';
    $s.tl(true, 'o', 'Minibag Add To Cart');
}
// Custom function for Fanatics and JCP Add to Cart pages on Product Display Page.
// This despite function named for JCP.
function siteCatalyst_JCPAddToCart(pid, sku, cartCount, qty) {
    var cartEvents = "scAdd";
    if (cartCount - qty == 0) {
        cartEvents += ",scOpen";
    }
    $s.events = cartEvents;
    $s.products = ";" + pid + ";;;;eVar22=" + sku;
    $s.eVar20 = cartCount;
    $s.prop3 = "cart";
    $s.eVar62 = "cart";
    $s.linkTrackVars = "events,products,eVar20,prop11,prop54,prop13,prop22,prop50,prop40,eVar16,eVar54,eVar43,eVar50";
    $s.linkTrackEvents = 'scAdd,scOpen';
    $s.tl(true, 'o', 'JCP Add To Cart');
}
// Custom function for jQuery Validate Form Failures
function siteCatalyst_jQueryValidateFailures(formName) {
    $s.events = "event35";
    $s.prop12 = formName;
    $s.linkTrackVars = "events,prop12,prop22";
    $s.linkTrackEvents = 'event35';
    $s.tl(true, 'o', 'Form Validation Failure');
}
// Custom function for Remove Item from Mini Cart
function siteCatalyst_miniCartRemoveItem(productID, SKU) {
    $s.events = "scRemove";
    $s.products = ';' + productID + ';;;;eVar22=' + SKU;
    $s.prop3 = "cart";
    $s.eVar62 = "cart";
    $s.linkTrackVars = "events,products,eVar22,prop11,prop54,prop13,prop22,prop50,prop40,eVar16,eVar54,eVar43,eVar50";
    $s.linkTrackEvents = 'scRemove';
    $s.tl(true, 'o', 'Remove Item From Mini Cart');
}
// Custom utility function for getting breadcrumb item count
// TODO This appears to not work or be called
function sc_browseItemCount() {
    var sc_BreadCrumbProdNum = 0;
    var sc_BreadCrumb = jQuery("div.browseHeaderBreadCrumbs").html();
    if (sc_BreadCrumb == null) {
        sc_BreadCrumb = "";
    }
    if (sc_BreadCrumb.length > 0) {
        if (sc_BreadCrumb.indexOf("items)") > 0) {
            var sc_BreadCrumbRegexp = /\(([0-9]+) items\)/g;
            var sc_BreadCrumbMatches = sc_BreadCrumbRegexp.exec(sc_BreadCrumb);
            sc_BreadCrumbProdNum = sc_BreadCrumbMatches[1];
        }
    }
    return sc_BreadCrumbProdNum;
}
// Custom function for rewards clicks
// event70=Customer Identified, event71= Signup click, event72=Signup Complete
function siteCatalyst_rewardsClick() {
    $s.events = "event71";
    $s.linkTrackVars = "events,prop3,prop11,prop54,prop13,prop22,prop50,prop40,eVar16,eVar54,eVar62,eVar43,eVar50";
    $s.linkTrackEvents = 'event71';
    $s.tl(true, 'o', 'Rewards Promo Click');
}
function siteCatalyst_rewardsPageSignup(customerId, area) {
    $s.events = "event70,event72";
    if (typeof (area) != 'undefined') {
        $s.eVar86 = $s.prop63 = area;
    }
    else {
        $s.eVar86 = $s.prop63 = $s.prop3;
    }
    $s.eVar57 = customerId;
    $s.linkTrackVars = "events,eVar57,eVar86,prop63,prop11,prop54,prop13,prop22,prop50,prop40,eVar16,eVar54,eVar62,eVar43,eVar50";
    $s.linkTrackEvents = 'event70,event72';
    $s.tl(true, 'o', 'Rewards Page Signup');
}
jQuery("a.fancash-join").on("click", function (event) {
    siteCatalyst_rewardsClick();
});

// Recently viewed event tracking for SiteCatalyst
jQuery("div.rvpContainer, .rvpRowContainer").on("click", "div.ImageLink a, .ItemContainer a", function () {
    s_findMethod("Recently Viewed");
});

// Colorswatch tracking
if (typeof TCS.Settings.EnableColorSwatch != 'undefined' &&
    TCS.Settings.EnableColorSwatch) {
    var firstSwatchLoad = true;

    function colorSwatchIsOnPage() {
        if (jQuery("div.browseColorSwatchContainer").length || jQuery("a.pdpColorSwatchContainer").length ||
            jQuery("a.qvColorSwatchContainer").length || jQuery("div.b-swatch-inner").length) {
            return 'true';
        }
        return 'false';
    }

    $s.prop72 = colorSwatchIsOnPage();

    function colorSwatchTracking(store, pid, trackLink) {
        $s.events = "event65";
        $s.prop37 = $s.prop3;
        $s.products = ";" + pid + ";;;;";

        setupPsIdHostNameTracking();

        var expiry = new Date(Date.now() + 60000 * 30);
        if (store) {
            $s.c_w("s_clickedPid", pid, expiry);
        }

        $s.linkTrackEvents = 'event65';
        $s.linkTrackVars = 'events,prop37,prop72,prop11,eVar16,eVar54,prop54';
        if (trackLink) {
            $s.tl(true, 'o', "Colorswatch");
        }
    }
    // Desktop TLP Color Swatch Tracking
    jQuery("div.browseColorSwatchContainer a").on("click", function (event) {
        var itemId = jQuery(this).data("pid");
        colorSwatchTracking(true, itemId, true);
    });
    // Mobile TLP Color Swatch Tracking
    jQuery("div.b-swatch-inner").on("click", function (event) {
        if (typeof ($s.prop3) != 'undefined' && $s.prop3.toLowerCase() != 'pdp') {
            var itemId = jQuery(this).data("product-id");
            colorSwatchTracking(true, itemId, true);
        }
    });
    // Desktop and Mobile Product Color Swatch Tracking
    jQuery(document).on("swatch.product.tracking", function (event, data, element) {
        // Mobile loads the image dynamically after page renders, ignore first load.
        if (jQuery(element).hasClass('b-swatch-inner') && firstSwatchLoad) {
            firstSwatchLoad = false;
            return;
        }
        if (jQuery(element).hasClass('qvColorSwatchContainer')) {
            var itemId = jQuery(element).data("pid");
            colorSwatchTracking(true, itemId, false);
        }
        else {
            colorSwatchTracking(false, '', false);
        }

        siteCatalyst_SwatchProductDisplay(data.FulfillmentSystemProductID, data.StandardOptions, data.PriceName, data.Title);
    });
}

// Custom function for Colorswatch Product Display
function siteCatalyst_SwatchProductDisplay(productID, sizeOptions, isSale, prodName) {
    var sizeStock = parseSizeOptions(sizeOptions);
    var isOnSale = "false";
    if (isSale == "Sale") {
        isOnSale = "true"
    }
    $s.pageName = "Fanatics: " + prodName;
    $s.events += ",prodView,event5";
    $s.products = ";" + productID + ";;;;eVar17=" + isOnSale;
    $s.eVar17 = isOnSale;
    $s.eVar18 = sizeStock.inStockProd;
    $s.eVar19 = sizeStock.outStockProd;
    $s.linkTrackVars += ",products,eVar7,eVar8,eVar17,eVar18,eVar19,eVar27,eVar29,eVar49,prop1,prop2,prop3,prop11,prop54,prop13,prop22,prop25,prop50,prop40,eVar16,eVar54,eVar43,eVar50";
    $s.linkTrackEvents += ',prodView,event5';
    $s.tl(true, 'o', 'Colorswatch');
}

// Desktop Featured Product DTI
jQuery(".tlpFeaturedProductContainerDTI").on("click", ".tlpFeaturedLeft a, .tlpFeaturedRight h4 a, .biImage a, .productTitle a", dtiPathClick);
// Mobile Featured Product DTI
jQuery("dti-product-container a dti-top-wrapper").on("click", dtiPathClick);
// Mobile Balance Featured Product DTI
jQuery("div#something a").on("click", dtiPathClick);

function dtiPathClick(event) {
    event.preventDefault();
    var link = jQuery(this).attr("href");
    var dtiLink = link + "?p_src=dti";
    location.href = dtiLink;
}

// Dynamically loaded elements for RichRelevance
if (jQuery("div#item_page_rr1").length) {
    // Desktop/Mobile - You May Also Like/Rich Relevance tracking for SiteCatalyst
    jQuery("div#item_page_rr1").on("click", "a", moreWeSee);
    jQuery("div#item_page_rr2").on("click", "a", moreWeSee);
}
else {
    if (jQuery("form.mwsRelatedForm").length) {
        // Desktop/Mobile - Internal Related Product Tracking for SiteCatalyst
        jQuery("form.mwsRelatedForm a").on("click", moreWeSee);
    }
    else {
        // Mobile Balance - Rich Relevance/Internal Related Tracking
        jQuery("div#mwsBaynoteControlContainer a").on("click", moreWeSee);
    }
}

function moreWeSee(event) {
    var link = jQuery(this);
    var item = link.closest("form").find("div.Item");
    var scProductID = "";
    if (item.length) {
        scProductID = item.attr("id");
        scProductID = scProductID ? scProductID.replace("Item", "") : "";
    }
    else if (link.attr("id")) {
        scProductID = link.attr("id").replace("Item", "");
    }
    var scLinkName = "recommended products:internal";
    if (jQuery("div#item_page_rr1").length) {
        scLinkName = "recommended products:rich relevance";
        if (location.href.indexOf("p_src=dti") > -1) {
            scLinkName = "recommended products:rich relevance dti";
            event.preventDefault();
            link.attr("href", link.attr("href") + "?p_src=dtirichrec");
            location.href = link.attr("href");
            $s.pev2 = scLinkName;
        }
    }
    else if (location.href.indexOf("p_src=dti") > -1) {
        scLinkName = "recommended products:internal dti";
        event.preventDefault();
        link.attr("href", link.attr("href") + "?p_src=dtiinternalrec");
        location.href = link.attr("href");
        $s.pev2 = scLinkName;
    }
    $s.linkTrackVars = 'eVar28,prop9,eVar43,prop33,prop11,eVar16,prop54,eVar54';
    $s.eVar16 = sc_PSID;
    $s.eVar28 = scLinkName;
    $s.eVar54 = document.location.hostname;
    $s.prop9 = scLinkName;
    $s.prop11 = sc_PSID;
    $s.prop33 = scProductID;
    $s.prop54 = document.location.hostname;
    if ($s.pageName) {
        $s.eVar43 = $s.pageName;
    }
    $s.tl(true, 'o', scLinkName);
}

// Type Ahead Search Suggestion Tracking
jQuery(document).on("suggest.track", function (event, query, itemSubmitted, items) {
    // Search submitted
    $s.c_w('s_tssub', '1');
    sc_search = 1;

    if (typeof (TCS.Settings.typeahead.enabled) != 'undefined' && TCS.Settings.typeahead.enabled) {
        $s.events = '';
        $s.linkTrackEvents = 'None';
        $s.linkTrackVars = 'events,prop4,eVar1,prop11,eVar16,eVar54,prop54,eVar81';

        // Based on autosuggest.js behavior, if query is same, then a regular search was conducted
        if (query == itemSubmitted) {
            $s.eVar77 = $s.prop74 = query.length;
            $s.eVar78 = $s.prop75 = "-1:" + items.length;
            $s.eVar1 = $s.prop4 = query;
            $s.linkTrackVars += ",prop74,prop75,eVar77,eVar78";

            jQuery.each(items, function (index, value) {
                $s.eVar81 = $s.apl($s.eVar81, value.text, ";", 1);
            });
        }
        else {
            // Typeahead selection that was selected
            $s.prop4 = itemSubmitted;
            $s.eVar1 = itemSubmitted;
            $s.events = 'event52';
            $s.linkTrackEvents = 'event52';
            var selected = '';

            jQuery.each(items, function (index, value) {
                var suggestion = value.text;
                if (suggestion == itemSubmitted) {
                    var loc = index + 1;
                    $s.prop75 = loc + ":" + items.length;
                    $s.eVar78 = loc + ":" + items.length;
                    selected = suggestion;
                    $s.linkTrackVars += ',prop75,eVar78';
                }
                $s.eVar81 = $s.apl($s.eVar81, suggestion, ";", 1);
            });

            if (selected) {
                var typedSoFar = query;
                $s.prop73 = typedSoFar;
                $s.eVar76 = typedSoFar;
                $s.prop74 = typedSoFar.length;
                $s.eVar77 = typedSoFar.length;
                $s.linkTrackVars += ',eVar76,eVar77,prop73,prop74';
            }
        }
        setupPsIdHostNameTracking();

        $s.tl(true, 'o', "Search Type-Ahead");
    }
});

// Minibag "Continue Shopping" Link
jQuery("body").on("click", "a.mbContinueShopping", function () {
    linkInteraction(true, "mini cart:continue shopping");
})
//PayPal submit and complete
jQuery("#PaypalSubmit").on("click", function () {
    linkInteraction(true, "PayPal Submit");
})

jQuery("#PaymentSubmit").on("click", function () {
    linkInteraction(true, "PayPal Complete");
})
// Removed Item from minibag
    .on("click", "a.mbItemRemoveTarget, .minibag-remove-button", function () {
        siteCatalyst_miniCartRemoveItem(jQuery(this).data("product-id"), jQuery(this).data("sku"));
    })
// Click on a Rewards Link
// TODO: This does not appear to be used
    .on("click", "a.rewardsClubLinkJS", function () {
        siteCatalyst_rewardsClick();
    })
// Click on a Rewards Link
    .on("rewards_rewardsPageSignupCustomEvent", function (event, customerId, area) {
        siteCatalyst_rewardsPageSignup(customerId, area);
    });
// jQuery Validate errors
jQuery("form").on("jQueryValidationError", function () {
    var formName = jQuery(this).attr("name");
    siteCatalyst_jQueryValidateFailures(formName);
});
// header checkout link click
jQuery("div#headerFrameCartCheckoutContainer").on("click", "a#headerCartCheckoutLink", function () {
    s_beginCheckout(sc_OrderItemsString);
});
// minibag checkout click
jQuery("body").on("click", "a.mbCheckout", function () {
    s_beginCheckout(sc_OrderItemsString);
    linkInteraction(true, "mini cart:check out now");
});
// Mobile checkout step 3
jQuery(function () {
    jQuery("#selectShippingContent select").change(function () {
        jQuery("#paypalSelectShippingContent select").val(jQuery(this).val());
    });
});
// Pinch Zoom analytics events: Check if Zoom is enabled and we are on a PDP
if (TCS.Settings.ZoomEnabled && jQuery(".panzoom-parent").length) {
    // If enabled, grab our panzoom element
    var _panzoom = jQuery('.panzoom-enabled');
    // Bind click to fire the click zoom event.
    jQuery(document).on('click', 'div.slick-slide', function () {
        siteCatalyst_clickZoom();
        // When the modal is opened, bind to the pinchzoom event.
        _panzoom.bind('panzoomend.analytics', function (e, panzoom, matrix, changed) {
            if (changed) {
                // If pinchzoom is detected, fire zoom event and then unbind the event per requirements
                siteCatalyst_pinchPan();
                _panzoom.unbind('panzoomend.analytics');
            }
        });
    });
    // if we close the modal, unbind the analytics event for pinchzooming.
    jQuery(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
        _panzoom.unbind('panzoomend.analytics');
    });
}


if (TCS.Settings.ZoomEnabled && TCS.Settings.PDPMultiZoomEnabled) {
    jQuery(document).on("mouseover", "img#mainProductImage", function () {
        if (typeof tcs_pMZSelf != 'undefined' && tcs_pMZSelf.widget_current_image_zoom_available) {
            siteCatalyst_hoverZoom();
        }
    });
}

// Wire up consistent zoom events
jQuery(document).on("click", "img.qvMainImage", function () {
    siteCatalyst_clickZoom();
});
jQuery(document).on("click", "img#mainProductImage", function () {
    if ((typeof tcs_pMZSelf != 'undefined' && !tcs_pMZSelf.widget_current_image_zoom_available) || typeof tcs_pMZSelf == 'undefined') {
        siteCatalyst_clickZoom();
    }
});
jQuery(document).on("click", "a.zoom", function () {
    if ((typeof tcs_pMZSelf != 'undefined' && !tcs_pMZSelf.widget_current_image_zoom_available) || typeof tcs_pMZSelf == 'undefined') {
        siteCatalyst_clickZoom();
    }
});
jQuery(document).on("click", "a.altzoom", function () {
    if ((typeof tcs_pMZSelf != 'undefined' && !tcs_pMZSelf.widget_current_image_zoom_available) || typeof tcs_pMZSelf == 'undefined') {
        siteCatalyst_clickZoom();
    }
});

var s_category = $s.c_r('s_gf_cat');
var s_selection = $s.c_r('s_gf_sel');
if ((s_category != "") && (s_selection != "")) {
    $s.eVar23 = s_category;
    $s.prop15 = s_category;
    $s.eVar24 = s_selection;
    $s.prop16 = s_selection;
}
var date1DayOld = new Date();
date1DayOld.setDate(date1DayOld.getDate() - 1);
$s.c_w('s_gf_cat', '', date1DayOld);
$s.c_w('s_gf_sel', '', date1DayOld);
jQuery("body").on("click", "div.GuidedFilterContainer ul li a", function (e) {
    var s_category = jQuery(this).parents("div.GuidedFilterContainer, .accordionWrapper").find("h2 a, .accordion-header").html();
    var s_selection = jQuery(this).html();
    $s.c_w('s_gf_cat', s_category, 0);
    $s.c_w('s_gf_sel', s_selection, 0);
});
function siteCatalyst_savedCardUser() {
    $s.events = "event48";
    $s.linkTrackVars = "events";
    $s.linkTrackEvents = 'event48';
    $s.tl(true, 'o', 'Saved Card User');
}
function siteCatalyst_clickZoom() {
    $s.events = "event56";
    $s.eVar16 = sc_PSID;
    $s.eVar31 = "click zoom";
    $s.eVar54 = document.location.hostname;
    $s.prop11 = sc_PSID;
    $s.prop41 = "click zoom";
    $s.prop54 = document.location.hostname;
    $s.linkTrackVars = "events,eVar16,eVar31,eVar54,prop11,prop41,prop54";
    $s.linkTrackEvents = 'event56';
    $s.tl(true, 'o', 'Click Zoom');
}
function siteCatalyst_hoverZoom() {
    $s.events = "event56";
    $s.eVar16 = sc_PSID;
    $s.eVar31 = "hover zoom";
    $s.eVar54 = document.location.hostname;
    $s.prop11 = sc_PSID;
    $s.prop41 = "hover zoom";
    $s.prop54 = document.location.hostname;
    $s.linkTrackVars = "events,eVar16,eVar31,eVar54,prop11,prop41,prop54";
    $s.linkTrackEvents = 'event56';
    $s.tl(true, 'o', 'Hover Zoom');
}
function siteCatalyst_pinchPan() {
    $s.events = "event56";
    $s.eVar16 = sc_PSID;
    $s.eVar31 = "pinch and pan";
    $s.eVar54 = document.location.hostname;
    $s.prop11 = sc_PSID;
    $s.prop41 = "pinch and pan";
    $s.prop54 = document.location.hostname;
    $s.linkTrackVars = "events,eVar16,eVar31,eVar54,prop11,prop41,prop54";
    $s.linkTrackEvents = 'event56';
    $s.tl(true, 'o', 'Pinch and Pan');
}
// Decode the window URL for referrals from external sources
s_InUrl = window.location.href;
s_InUrl = s_InUrl.split('&');
jQuery.each(s_InUrl, function (i, item) {
    if (item.indexOf("?") > 0) {
        item = item.substring(item.indexOf("?") + 1, item.length);
    }
    paramLookup = item.split('=');
    switch (paramLookup[0]) {
        case 'utm_source':
            sc_utm_source = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'utm_medium':
            sc_utm_medium = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'utm_term':
            sc_utm_term = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'utm_content':
            sc_utm_content = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'utm_campaign':
            sc_utm_campaign = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'placement':
            sc_placement = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'adposition':
            sc_adposition = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'affiliateid':
            sc_affiliateid = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'matchtype':
            sc_matchtype = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'adtype':
            sc_adtype = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            break;
        case 'e':
            sc_email = paramLookup[1].replace(new RegExp("%20", "g"), " ");
            jQuery(document).trigger('email.useridentity.tracking', [sc_email, 'emailcampaign']);
            break;
    }
});
$s.eVar39 = sc_utm_source;
$s.eVar40 = sc_utm_medium;
$s.eVar41 = sc_utm_term;
$s.eVar42 = sc_utm_content;
$s.eVar44 = sc_utm_campaign;
if (sc_adposition.length > 0) {
    $s.eVar45 = sc_adposition;
}
else {
    $s.eVar45 = sc_placement;
}
if (sc_adtype.length > 0) {
    $s.eVar46 = sc_adtype;
}
else {
    if (sc_matchtype.length > 0) {
        $s.eVar46 = sc_matchtype;
    }
    else {
        $s.eVar46 = sc_affiliateid;
    }
}
//Id.me Tracking
function siteCatalyst_idMeTrack(clickScope, clickTrackEvent) {

    $s.prop3 = sc_pageType;
    $s.eVar16 = sc_PSID;
    $s.prop11 = sc_PSID;
    $s.eVar54 = document.location.hostname;
    $s.prop54 = document.location.hostname;
    if (clickTrackEvent === "idmeTrigger") {
        if (clickScope === "military") {
            $s.prop9 = "IDmeTroopClick";
            $s.eVar28 = "IDmeTroopClick";
        }
        else {
            $s.prop9 = "IDmeFirstResponderClick";
            $s.eVar28 = "IDmeFirstResponderClick";
        }
    }
    else if (clickTrackEvent === "idmeSuccess") {
        if (clickScope === "military") {
            $s.prop9 = "IDmeTroopSuccess";
            $s.eVar28 = "IDmeTroopSuccess";
        }
        else {
            $s.prop9 = "IDmeFirstResponderSuccess";
            $s.eVar28 = "IDmeFirstResponderSuccess";
        }
    }
    $s.linkTrackVars = "prop9,eVar28,eVar16,prop11,eVar54,prop54,prop3";
    $s.tl(true, 'o', 'IdMe');
}

//Id.me Tracking
//function siteCatalyst_sameDayShippingTrack(clickScope, clickTrackEvent) {

//    $s.prop65 = clickTrackEvent;

//    $s.linkTrackVars += ",prop65";
//}

//event handler for utracking click event
//todo - change this to utrack-click and edit all MilitaryAndFirstResponders
jQuery(".utrack").on("click", function () {
    var eventScope = $(this).data('scope');
    var trackEvent = $(this).data('track-event');
    //idme
    if (trackEvent === "idmeTrigger") {
        siteCatalyst_idMeTrack(eventScope, trackEvent);
    }
});

//event handler for tracking element exists onpage load
//todo - change this to utrack-load and edit all MilitaryAndFirstResponders
jQuery(window).load(function () {
    jQuery("div.utrack").each(function (index) {
        var eventScope = $(this).data('scope').toLowerCase();
        var trackEvent = $(this).data('track-event');

        if (trackEvent === "idmeSuccess") {
            siteCatalyst_idMeTrack(eventScope, trackEvent);
        }

        //if (eventScope === "samedayshipping") {
        //    siteCatalyst_sameDayShippingTrack(eventScope, trackEvent);
        //}
    });
});
function siteCatalyst_getPrevPage() {
    return $s.c_r("s_prevProp3");
}

//Address Verification tracking
jQuery(document).on("addressVerificationLoad.tracking", function () {
    $s.events = "event66";
    setupPsIdHostNameTracking();

    $s.linkTrackVars = "events,prop3,prop11,prop54,eVar16,eVar54";
    $s.linkTrackEvents = "event66";

    $s.tl(true, "o", "Address Verification Load");
});
jQuery(document).on("addressVerificationNfEdit.tracking", function () {
    setupAddressVerificationTracking("Address Not Found - Selected Edit");

    $s.tl(true, "o", "Address Not Found - Selected Edit");
});
jQuery(document).on("addressVerificationNfContinue.tracking", function () {
    setupAddressVerificationTracking("Address Not Found - Selected Continue");

    $s.tl(true, "o", "Address Verification Not Found - Selected Continue");
});
jQuery(document).on("addressVerificationSaEdit.tracking", function () {
    setupAddressVerificationTracking("Edited Address");

    $s.tl(true, "o", "Address Verification Suggestion Edit");
});
jQuery(document).on("addressVerificationSaContinue.tracking", function (event, selectedOption, isNewAddress) {
    if (isNewAddress) {
        setupAddressVerificationTracking("Suggested Address");
    }
    else {
        setupAddressVerificationTracking("Original Address");
    }

    $s.tl(true, "o", "Address Verification Suggestion Continue");
});

function setupAddressVerificationTracking(selectedOption) {
    $s.events = "event67";
    $s.prop42 = selectedOption;
    setupPsIdHostNameTracking();

    $s.linkTrackVars = "events,prop3,prop11,prop42,prop54,eVar16,eVar54";
    $s.linkTrackEvents = "event67";
}

jQuery(".visaCheckout").on("click", function () {
    $s.eVar28 = $s.prop9 = "VisaCheckoutClick";
    setupPsIdHostNameTracking();

    $s.linkTrackEvents = "";
    $s.linkTrackVars = "eVar28,prop9,prop11,eVar16,prop54,eVar54,prop3,prop13,prop22,prop50,prop40,eVar62,eVar43,eVar50";
    $s.tl(true, "o", "Visa Checkout");
});

jQuery(document).on("visacheckout.loginsuccess", function () {
    $s.eVar28 = $s.prop9 = "VisaCheckoutClickSuccess";
    setupPsIdHostNameTracking();

    $s.linkTrackEvents = "";
    $s.linkTrackVars = "eVar28,prop9,prop11,eVar16,prop54,eVar54,prop3,prop13,prop22,prop50,prop40,eVar62,eVar43,eVar50";
    $s.tl(true, "o", "Visa Checkout");
});

jQuery(".masterpass-buy-with.masterpass-link").on("click", function () {
    $s.eVar28 = $s.prop9 = "MasterPassCheckoutClick";
    setupPsIdHostNameTracking();

    $s.linkTrackEvents = "";
    $s.linkTrackVars = "eVar28,prop9,prop11,eVar16,prop54,eVar54,prop3,prop13,prop22,prop50,prop40,eVar62,eVar43,eVar50";
    $s.tl(true, "o", "MasterPass Checkout");
});

jQuery(document).on("masterpasscheckout.loginsuccess", function () {
    $s.eVar28 = $s.prop9 = "MasterPassCheckoutClickSuccess";
    setupPsIdHostNameTracking();

    $s.linkTrackEvents = "";
    $s.linkTrackVars = "eVar28,prop9,prop11,eVar16,prop54,eVar54,prop3,prop13,prop22,prop50,prop40,eVar62,eVar43,eVar50";
    $s.tl(true, "o", "MasterPass Checkout");
});

jQuery(document.body).on("click", ".b-btn-floating-top-right", function () {
    $s.eVar84 = "MobileFilterButtonClick";
    $s.prop70 = "MobileFilterButtonClick";
    setupPsIdHostNameTracking();

    $s.linkTrackEvents = "";
    $s.linkTrackVars = "eVar84,prop70,eVar28,prop9,prop11,eVar16,prop54,eVar54,prop3,prop13,prop22,prop50,prop40,eVar62,eVar43,eVar50";
    $s.tl(true, "o", "Mobile Filter Click");
});

function setupPsIdHostNameTracking() {
    $s.eVar16 = sc_PSID;
    $s.prop11 = sc_PSID;
    $s.eVar54 = document.location.hostname;
    $s.prop54 = document.location.hostname;
}

// Custom function for parsing product data JSON object for the standard size options
function parseSizeOptions(sizeOptions) {
    var inStock = ""; var outStock = "";
    jQuery(sizeOptions).each(function (e, t) {
        if (t.IsOutOfStock) {
            outStock = outStock + "," + t.Name
        }
        else {
            inStock = inStock + "," + t.Name
        }
    });
    if (inStock.charAt(0) == ",") {
        inStock = inStock.substr(1, inStock.length)
    }
    if (outStock.charAt(0) == ",") {
        outStock = outStock.substr(1, outStock.length)
    }
    if (inStock == "" && outStock == "") {
        inStock = "Discontinued"; outStock = "Discontinued"
    }
    else {
        if (inStock == "") {
            inStock = "All Sizes Unavailable"
        }
        if (outStock == "") {
            outStock = "All Sizes Available"
        }
    }

    return { "inStockProd": inStock, "outStockProd": outStock };
};

function add(x, y, base) {
    var z = [];
    var n = Math.max(x.length, y.length);
    var carry = 0;
    var i = 0;
    while (i < n || carry) {
        var xi = i < x.length ? x[i] : 0;
        var yi = i < y.length ? y[i] : 0;
        var zi = carry + xi + yi;
        z.push(zi % base);
        carry = Math.floor(zi / base);
        i++;
    }
    return z;
}
function multiplyByNumber(num, x, base) {
    if (num < 0)
        return null;
    if (num == 0)
        return [];
    var result = [];
    var power = x;
    while (true) {
        if (num & 1) {
            result = add(result, power, base);
        }
        num = num >> 1;
        if (num === 0)
            break;
        power = add(power, power, base);
    }
    return result;
}
function parseToDigitsArray(str, base) {
    var digits = str.split('');
    var ary = [];
    for (var i = digits.length - 1; i >= 0; i--) {
        var n = parseInt(digits[i], base);
        if (isNaN(n))
            return null;
        ary.push(n);
    }
    return ary;
}
function convertBase(str, fromBase, toBase) {
    var digits = parseToDigitsArray(str, fromBase);
    if (digits === null)
        return null;
    var outArray = [];
    var power = [1];
    for (var i = 0; i < digits.length; i++) {
        if (digits[i]) {
            outArray = add(outArray, multiplyByNumber(digits[i], power, toBase), toBase);
        }
        power = multiplyByNumber(fromBase, power, toBase);
    }
    var out = '';
    for (var i = outArray.length - 1; i >= 0; i--) {
        out += outArray[i].toString(toBase);
    }
    return out;
}
function hexToDec(hexStr) {
    if (hexStr.substring(0, 2) === '0x')
        hexStr = hexStr.substring(2);
    hexStr = hexStr.toLowerCase();
    return convertBase(hexStr, 16, 10);
}

/*
    ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============            
AppMeasurement for JavaScript version: 2.0.0
Copyright 1996-2013 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com
*/
function AppMeasurement() {
    var a = this; a.version = "1.4.3"; var k = window; k.s_c_in || (k.s_c_il = [], k.s_c_in = 0); a._il = k.s_c_il; a._in = k.s_c_in; a._il[a._in] = a; k.s_c_in++; a._c = "s_c"; var q = k.yb; q || (q = null); var r = k, n, t; try { for (n = r.parent, t = r.location; n && n.location && t && "" + n.location != "" + t && r.location && "" + n.location != "" + r.location && n.location.host == t.host;) r = n, n = r.parent } catch (u) { } a.nb = function (a) { try { console.log(a) } catch (b) { } }; a.za = function (a) { return "" + parseInt(a) == "" + a }; a.replace = function (a, b, d) {
        return !a || 0 > a.indexOf(b) ?
            a : a.split(b).join(d)
    }; a.escape = function (c) { var b, d; if (!c) return c; c = encodeURIComponent(c); for (b = 0; 7 > b; b++) d = "+~!*()'".substring(b, b + 1), 0 <= c.indexOf(d) && (c = a.replace(c, d, "%" + d.charCodeAt(0).toString(16).toUpperCase())); return c }; a.unescape = function (c) { if (!c) return c; c = 0 <= c.indexOf("+") ? a.replace(c, "+", " ") : c; try { return decodeURIComponent(c) } catch (b) { } return unescape(c) }; a.eb = function () {
        var c = k.location.hostname, b = a.fpCookieDomainPeriods, d; b || (b = a.cookieDomainPeriods); if (c && !a.cookieDomain && !/^[0-9.]+$/.test(c) &&
        (b = b ? parseInt(b) : 2, b = 2 < b ? b : 2, d = c.lastIndexOf("."), 0 <= d)) { for (; 0 <= d && 1 < b;) d = c.lastIndexOf(".", d - 1), b--; a.cookieDomain = 0 < d ? c.substring(d) : c } return a.cookieDomain
    }; a.c_r = a.cookieRead = function (c) { c = a.escape(c); var b = " " + a.d.cookie, d = b.indexOf(" " + c + "="), f = 0 > d ? d : b.indexOf(";", d); c = 0 > d ? "" : a.unescape(b.substring(d + 2 + c.length, 0 > f ? b.length : f)); return "[[B]]" != c ? c : "" }; a.c_w = a.cookieWrite = function (c, b, d) {
        var f = a.eb(), e = a.cookieLifetime, g; b = "" + b; e = e ? ("" + e).toUpperCase() : ""; d && "SESSION" != e && "NONE" != e && ((g = "" !=
        b ? parseInt(e ? e : 0) : -60) ? (d = new Date, d.setTime(d.getTime() + 1E3 * g)) : 1 == d && (d = new Date, g = d.getYear(), d.setYear(g + 5 + (1900 > g ? 1900 : 0)))); return c && "NONE" != e ? (a.d.cookie = c + "=" + a.escape("" != b ? b : "[[B]]") + "; path=/;" + (d && "SESSION" != e ? " expires=" + d.toGMTString() + ";" : "") + (f ? " domain=" + f + ";" : ""), a.cookieRead(c) == b) : 0
    }; a.F = []; a.ba = function (c, b, d) {
        if (a.ta) return 0; a.maxDelay || (a.maxDelay = 250); var f = 0, e = (new Date).getTime() + a.maxDelay, g = a.d.visibilityState, m = ["webkitvisibilitychange", "visibilitychange"]; g || (g = a.d.webkitVisibilityState);
        if (g && "prerender" == g) { if (!a.ca) for (a.ca = 1, d = 0; d < m.length; d++) a.d.addEventListener(m[d], function () { var b = a.d.visibilityState; b || (b = a.d.webkitVisibilityState); "visible" == b && (a.ca = 0, a.delayReady()) }); f = 1; e = 0 } else d || a.l("_d") && (f = 1); f && (a.F.push({ m: c, a: b, t: e }), a.ca || setTimeout(a.delayReady, a.maxDelay)); return f
    }; a.delayReady = function () {
        var c = (new Date).getTime(), b = 0, d; for (a.l("_d") ? b = 1 : a.na() ; 0 < a.F.length;) {
            d = a.F.shift(); if (b && !d.t && d.t > c) {
                a.F.unshift(d); setTimeout(a.delayReady, parseInt(a.maxDelay / 2));
                break
            } a.ta = 1; a[d.m].apply(a, d.a); a.ta = 0
        }
    }; a.setAccount = a.sa = function (c) { var b, d; if (!a.ba("setAccount", arguments)) if (a.account = c, a.allAccounts) for (b = a.allAccounts.concat(c.split(",")), a.allAccounts = [], b.sort(), d = 0; d < b.length; d++) 0 != d && b[d - 1] == b[d] || a.allAccounts.push(b[d]); else a.allAccounts = c.split(",") }; a.foreachVar = function (c, b) {
        var d, f, e, g, m = ""; e = f = ""; if (a.lightProfileID) d = a.J, (m = a.lightTrackVars) && (m = "," + m + "," + a.ga.join(",") + ","); else {
            d = a.c; if (a.pe || a.linkType) m = a.linkTrackVars, f = a.linkTrackEvents,
            a.pe && (e = a.pe.substring(0, 1).toUpperCase() + a.pe.substring(1), a[e] && (m = a[e].xb, f = a[e].wb)); m && (m = "," + m + "," + a.A.join(",") + ","); f && m && (m += ",events,")
        } b && (b = "," + b + ","); for (f = 0; f < d.length; f++) e = d[f], (g = a[e]) && (!m || 0 <= m.indexOf("," + e + ",")) && (!b || 0 <= b.indexOf("," + e + ",")) && c(e, g)
    }; a.L = function (c, b, d, f, e) {
        var g = "", m, p, k, w, n = 0; "contextData" == c && (c = "c"); if (b) {
            for (m in b) if (!(Object.prototype[m] || e && m.substring(0, e.length) != e) && b[m] && (!d || 0 <= d.indexOf("," + (f ? f + "." : "") + m + ","))) {
                k = !1; if (n) for (p = 0; p < n.length; p++) m.substring(0,
                n[p].length) == n[p] && (k = !0); if (!k && ("" == g && (g += "&" + c + "."), p = b[m], e && (m = m.substring(e.length)), 0 < m.length)) if (k = m.indexOf("."), 0 < k) p = m.substring(0, k), k = (e ? e : "") + p + ".", n || (n = []), n.push(k), g += a.L(p, b, d, f, k); else if ("boolean" == typeof p && (p = p ? "true" : "false"), p) {
                    if ("retrieveLightData" == f && 0 > e.indexOf(".contextData.")) switch (k = m.substring(0, 4), w = m.substring(4), m) {
                        case "transactionID": m = "xact"; break; case "channel": m = "ch"; break; case "campaign": m = "v0"; break; default: a.za(w) && ("prop" == k ? m = "c" + w : "eVar" == k ? m = "v" +
                                w : "list" == k ? m = "l" + w : "hier" == k && (m = "h" + w, p = p.substring(0, 255)))
                    } g += "&" + a.escape(m) + "=" + a.escape(p)
                }
            } "" != g && (g += "&." + c)
        } return g
    }; a.gb = function () {
        var c = "", b, d, f, e, g, m, p, k, n = "", q = "", r = d = ""; if (a.lightProfileID) b = a.J, (n = a.lightTrackVars) && (n = "," + n + "," + a.ga.join(",") + ","); else {
            b = a.c; if (a.pe || a.linkType) n = a.linkTrackVars, q = a.linkTrackEvents, a.pe && (d = a.pe.substring(0, 1).toUpperCase() + a.pe.substring(1), a[d] && (n = a[d].xb, q = a[d].wb)); n && (n = "," + n + "," + a.A.join(",") + ","); q && (q = "," + q + ",", n && (n += ",events,")); a.events2 &&
            (r += ("" != r ? "," : "") + a.events2)
        } a.AudienceManagement && a.AudienceManagement.isReady() && (c += a.L("d", a.AudienceManagement.getEventCallConfigParams())); for (d = 0; d < b.length; d++) {
            e = b[d]; g = a[e]; f = e.substring(0, 4); m = e.substring(4); !g && "events" == e && r && (g = r, r = ""); if (g && (!n || 0 <= n.indexOf("," + e + ","))) {
                switch (e) {
                    case "supplementalDataID": e = "sdid"; break; case "timestamp": e = "ts"; break; case "dynamicVariablePrefix": e = "D"; break; case "visitorID": e = "vid"; break; case "marketingCloudVisitorID": e = "mid"; break; case "analyticsVisitorID": e =
                    "aid"; break; case "audienceManagerLocationHint": e = "aamlh"; break; case "audienceManagerBlob": e = "aamb"; break; case "authState": e = "as"; break; case "pageURL": e = "g"; 255 < g.length && (a.pageURLRest = g.substring(255), g = g.substring(0, 255)); break; case "pageURLRest": e = "-g"; break; case "referrer": e = "r"; break; case "vmk": case "visitorMigrationKey": e = "vmt"; break; case "visitorMigrationServer": e = "vmf"; a.ssl && a.visitorMigrationServerSecure && (g = ""); break; case "visitorMigrationServerSecure": e = "vmf"; !a.ssl && a.visitorMigrationServer &&
                    (g = ""); break; case "charSet": e = "ce"; break; case "visitorNamespace": e = "ns"; break; case "cookieDomainPeriods": e = "cdp"; break; case "cookieLifetime": e = "cl"; break; case "variableProvider": e = "vvp"; break; case "currencyCode": e = "cc"; break; case "channel": e = "ch"; break; case "transactionID": e = "xact"; break; case "campaign": e = "v0"; break; case "latitude": e = "lat"; break; case "longitude": e = "lon"; break; case "resolution": e = "s"; break; case "colorDepth": e = "c"; break; case "javascriptVersion": e = "j"; break; case "javaEnabled": e = "v";
                        break; case "cookiesEnabled": e = "k"; break; case "browserWidth": e = "bw"; break; case "browserHeight": e = "bh"; break; case "connectionType": e = "ct"; break; case "homepage": e = "hp"; break; case "events": r && (g += ("" != g ? "," : "") + r); if (q) for (m = g.split(","), g = "", f = 0; f < m.length; f++) p = m[f], k = p.indexOf("="), 0 <= k && (p = p.substring(0, k)), k = p.indexOf(":"), 0 <= k && (p = p.substring(0, k)), 0 <= q.indexOf("," + p + ",") && (g += (g ? "," : "") + m[f]); break; case "events2": g = ""; break; case "contextData": c += a.L("c", a[e], n, e); g = ""; break; case "lightProfileID": e =
                        "mtp"; break; case "lightStoreForSeconds": e = "mtss"; a.lightProfileID || (g = ""); break; case "lightIncrementBy": e = "mti"; a.lightProfileID || (g = ""); break; case "retrieveLightProfiles": e = "mtsr"; break; case "deleteLightProfiles": e = "mtsd"; break; case "retrieveLightData": a.retrieveLightProfiles && (c += a.L("mts", a[e], n, e)); g = ""; break; default: a.za(m) && ("prop" == f ? e = "c" + m : "eVar" == f ? e = "v" + m : "list" == f ? e = "l" + m : "hier" == f && (e = "h" + m, g = g.substring(0, 255)))
                } g && (c += "&" + e + "=" + ("pev" != e.substring(0, 3) ? a.escape(g) : g))
            } "pev3" == e && a.e &&
            (c += a.e)
        } return c
    }; a.u = function (a) { var b = a.tagName; if ("undefined" != "" + a.Bb || "undefined" != "" + a.rb && "HTML" != ("" + a.rb).toUpperCase()) return ""; b = b && b.toUpperCase ? b.toUpperCase() : ""; "SHAPE" == b && (b = ""); b && (("INPUT" == b || "BUTTON" == b) && a.type && a.type.toUpperCase ? b = a.type.toUpperCase() : !b && a.href && (b = "A")); return b }; a.va = function (a) {
        var b = a.href ? a.href : "", d, f, e; d = b.indexOf(":"); f = b.indexOf("?"); e = b.indexOf("/"); b && (0 > d || 0 <= f && d > f || 0 <= e && d > e) && (f = a.protocol && 1 < a.protocol.length ? a.protocol : l.protocol ? l.protocol :
        "", d = l.pathname.lastIndexOf("/"), b = (f ? f + "//" : "") + (a.host ? a.host : l.host ? l.host : "") + ("/" != h.substring(0, 1) ? l.pathname.substring(0, 0 > d ? 0 : d) + "/" : "") + b); return b
    }; a.G = function (c) {
        var b = a.u(c), d, f, e = "", g = 0; return b && (d = c.protocol, f = c.onclick, !c.href || "A" != b && "AREA" != b || f && d && !(0 > d.toLowerCase().indexOf("javascript")) ? f ? (e = a.replace(a.replace(a.replace(a.replace("" + f, "\r", ""), "\n", ""), "\t", ""), " ", ""), g = 2) : "INPUT" == b || "SUBMIT" == b ? (c.value ? e = c.value : c.innerText ? e = c.innerText : c.textContent && (e = c.textContent),
        g = 3) : c.src && "IMAGE" == b && (e = c.src) : e = a.va(c), e) ? { id: e.substring(0, 100), type: g } : 0
    }; a.zb = function (c) { for (var b = a.u(c), d = a.G(c) ; c && !d && "BODY" != b;) if (c = c.parentElement ? c.parentElement : c.parentNode) b = a.u(c), d = a.G(c); d && "BODY" != b || (c = 0); c && (b = c.onclick ? "" + c.onclick : "", 0 <= b.indexOf(".tl(") || 0 <= b.indexOf(".trackLink(")) && (c = 0); return c }; a.qb = function () {
        var c, b, d = a.linkObject, f = a.linkType, e = a.linkURL, g, m; a.ha = 1; d || (a.ha = 0, d = a.clickObject); if (d) {
            c = a.u(d); for (b = a.G(d) ; d && !b && "BODY" != c;) if (d = d.parentElement ? d.parentElement :
            d.parentNode) c = a.u(d), b = a.G(d); b && "BODY" != c || (d = 0); if (d) { var p = d.onclick ? "" + d.onclick : ""; if (0 <= p.indexOf(".tl(") || 0 <= p.indexOf(".trackLink(")) d = 0 }
        } else a.ha = 1; !e && d && (e = a.va(d)); e && !a.linkLeaveQueryString && (g = e.indexOf("?"), 0 <= g && (e = e.substring(0, g))); if (!f && e) {
            var n = 0, q = 0, r; if (a.trackDownloadLinks && a.linkDownloadFileTypes) for (p = e.toLowerCase(), g = p.indexOf("?"), m = p.indexOf("#"), 0 <= g ? 0 <= m && m < g && (g = m) : g = m, 0 <= g && (p = p.substring(0, g)), g = a.linkDownloadFileTypes.toLowerCase().split(","), m = 0; m < g.length; m++) (r =
            g[m]) && p.substring(p.length - (r.length + 1)) == "." + r && (f = "d"); if (a.trackExternalLinks && !f && (p = e.toLowerCase(), a.ya(p) && (a.linkInternalFilters || (a.linkInternalFilters = k.location.hostname), g = 0, a.linkExternalFilters ? (g = a.linkExternalFilters.toLowerCase().split(","), n = 1) : a.linkInternalFilters && (g = a.linkInternalFilters.toLowerCase().split(",")), g))) { for (m = 0; m < g.length; m++) r = g[m], 0 <= p.indexOf(r) && (q = 1); q ? n && (f = "e") : n || (f = "e") }
        } a.linkObject = d; a.linkURL = e; a.linkType = f; if (a.trackClickMap || a.trackInlineStats) a.e =
        "", d && (f = a.pageName, e = 1, d = d.sourceIndex, f || (f = a.pageURL, e = 0), k.s_objectID && (b.id = k.s_objectID, d = b.type = 1), f && b && b.id && c && (a.e = "&pid=" + a.escape(f.substring(0, 255)) + (e ? "&pidt=" + e : "") + "&oid=" + a.escape(b.id.substring(0, 100)) + (b.type ? "&oidt=" + b.type : "") + "&ot=" + c + (d ? "&oi=" + d : "")))
    }; a.hb = function () {
        var c = a.ha, b = a.linkType, d = a.linkURL, f = a.linkName; b && (d || f) && (b = b.toLowerCase(), "d" != b && "e" != b && (b = "o"), a.pe = "lnk_" + b, a.pev1 = d ? a.escape(d) : "", a.pev2 = f ? a.escape(f) : "", c = 1); a.abort && (c = 0); if (a.trackClickMap || a.trackInlineStats) {
            var b =
            {}, d = 0, e = a.cookieRead("s_sq"), g = e ? e.split("&") : 0, m, p, k, e = 0; if (g) for (m = 0; m < g.length; m++) p = g[m].split("="), f = a.unescape(p[0]).split(","), p = a.unescape(p[1]), b[p] = f; f = a.account.split(","); if (c || a.e) {
                c && !a.e && (e = 1); for (p in b) if (!Object.prototype[p]) for (m = 0; m < f.length; m++) for (e && (k = b[p].join(","), k == a.account && (a.e += ("&" != p.charAt(0) ? "&" : "") + p, b[p] = [], d = 1)), g = 0; g < b[p].length; g++) k = b[p][g], k == f[m] && (e && (a.e += "&u=" + a.escape(k) + ("&" != p.charAt(0) ? "&" : "") + p + "&u=0"), b[p].splice(g, 1), d = 1); c || (d = 1); if (d) {
                    e = "";
                    m = 2; !c && a.e && (e = a.escape(f.join(",")) + "=" + a.escape(a.e), m = 1); for (p in b) !Object.prototype[p] && 0 < m && 0 < b[p].length && (e += (e ? "&" : "") + a.escape(b[p].join(",")) + "=" + a.escape(p), m--); a.cookieWrite("s_sq", e)
                }
            }
        } return c
    }; a.ib = function () {
        if (!a.vb) {
            var c = new Date, b = r.location, d, f, e = f = d = "", g = "", m = "", k = "1.2", n = a.cookieWrite("s_cc", "true", 0) ? "Y" : "N", q = "", s = ""; if (c.setUTCDate && (k = "1.3", (0).toPrecision && (k = "1.5", c = [], c.forEach))) {
                k = "1.6"; f = 0; d = {}; try {
                    f = new Iterator(d), f.next && (k = "1.7", c.reduce && (k = "1.8", k.trim && (k =
                    "1.8.1", Date.parse && (k = "1.8.2", Object.create && (k = "1.8.5")))))
                } catch (t) { }
            } d = screen.width + "x" + screen.height; e = navigator.javaEnabled() ? "Y" : "N"; f = screen.pixelDepth ? screen.pixelDepth : screen.colorDepth; g = a.w.innerWidth ? a.w.innerWidth : a.d.documentElement.offsetWidth; m = a.w.innerHeight ? a.w.innerHeight : a.d.documentElement.offsetHeight; try { a.b.addBehavior("#default#homePage"), q = a.b.Ab(b) ? "Y" : "N" } catch (u) { } try { a.b.addBehavior("#default#clientCaps"), s = a.b.connectionType } catch (x) { } a.resolution = d; a.colorDepth = f;
            a.javascriptVersion = k; a.javaEnabled = e; a.cookiesEnabled = n; a.browserWidth = g; a.browserHeight = m; a.connectionType = s; a.homepage = q; a.vb = 1
        }
    }; a.K = {}; a.loadModule = function (c, b) {
        var d = a.K[c]; if (!d) { d = k["AppMeasurement_Module_" + c] ? new k["AppMeasurement_Module_" + c](a) : {}; a.K[c] = a[c] = d; d.Na = function () { return d.Ra }; d.Sa = function (b) { if (d.Ra = b) a[c + "_onLoad"] = b, a.ba(c + "_onLoad", [a, d], 1) || b(a, d) }; try { Object.defineProperty ? Object.defineProperty(d, "onLoad", { get: d.Na, set: d.Sa }) : d._olc = 1 } catch (f) { d._olc = 1 } } b && (a[c + "_onLoad"] =
        b, a.ba(c + "_onLoad", [a, d], 1) || b(a, d))
    }; a.l = function (c) { var b, d; for (b in a.K) if (!Object.prototype[b] && (d = a.K[b]) && (d._olc && d.onLoad && (d._olc = 0, d.onLoad(a, d)), d[c] && d[c]())) return 1; return 0 }; a.lb = function () { var c = Math.floor(1E13 * Math.random()), b = a.visitorSampling, d = a.visitorSamplingGroup, d = "s_vsn_" + (a.visitorNamespace ? a.visitorNamespace : a.account) + (d ? "_" + d : ""), f = a.cookieRead(d); if (b) { f && (f = parseInt(f)); if (!f) { if (!a.cookieWrite(d, c)) return 0; f = c } if (f % 1E4 > v) return 0 } return 1 }; a.M = function (c, b) {
        var d,
        f, e, g, m, k; for (d = 0; 2 > d; d++) for (f = 0 < d ? a.oa : a.c, e = 0; e < f.length; e++) if (g = f[e], (m = c[g]) || c["!" + g]) { if (!b && ("contextData" == g || "retrieveLightData" == g) && a[g]) for (k in a[g]) m[k] || (m[k] = a[g][k]); a[g] = m }
    }; a.Ga = function (c, b) { var d, f, e, g; for (d = 0; 2 > d; d++) for (f = 0 < d ? a.oa : a.c, e = 0; e < f.length; e++) g = f[e], c[g] = a[g], b || c[g] || (c["!" + g] = 1) }; a.cb = function (a) {
        var b, d, f, e, g, m = 0, k, n = "", q = ""; if (a && 255 < a.length && (b = "" + a, d = b.indexOf("?"), 0 < d && (k = b.substring(d + 1), b = b.substring(0, d), e = b.toLowerCase(), f = 0, "http://" == e.substring(0,
        7) ? f += 7 : "https://" == e.substring(0, 8) && (f += 8), d = e.indexOf("/", f), 0 < d && (e = e.substring(f, d), g = b.substring(d), b = b.substring(0, d), 0 <= e.indexOf("google") ? m = ",q,ie,start,search_key,word,kw,cd," : 0 <= e.indexOf("yahoo.co") && (m = ",p,ei,"), m && k)))) { if ((a = k.split("&")) && 1 < a.length) { for (f = 0; f < a.length; f++) e = a[f], d = e.indexOf("="), 0 < d && 0 <= m.indexOf("," + e.substring(0, d) + ",") ? n += (n ? "&" : "") + e : q += (q ? "&" : "") + e; n && q ? k = n + "&" + q : q = "" } d = 253 - (k.length - q.length) - b.length; a = b + (0 < d ? g.substring(0, d) : "") + "?" + k } return a
    }; a.Ma = function (c) {
        var b =
        a.d.visibilityState, d = ["webkitvisibilitychange", "visibilitychange"]; b || (b = a.d.webkitVisibilityState); if (b && "prerender" == b) { if (c) for (b = 0; b < d.length; b++) a.d.addEventListener(d[b], function () { var b = a.d.visibilityState; b || (b = a.d.webkitVisibilityState); "visible" == b && c() }); return !1 } return !0
    }; a.Y = !1; a.C = !1; a.Ta = function () { a.C = !0; a.i() }; a.W = !1; a.Q = !1; a.Qa = function (c) { a.marketingCloudVisitorID = c; a.Q = !0; a.i() }; a.T = !1; a.N = !1; a.Ia = function (c) { a.analyticsVisitorID = c; a.N = !0; a.i() }; a.V = !1; a.P = !1; a.Ka = function (c) {
        a.audienceManagerLocationHint =
        c; a.P = !0; a.i()
    }; a.U = !1; a.O = !1; a.Ja = function (c) { a.audienceManagerBlob = c; a.O = !0; a.i() }; a.La = function (c) { a.maxDelay || (a.maxDelay = 250); return a.l("_d") ? (c && setTimeout(function () { c() }, a.maxDelay), !1) : !0 }; a.X = !1; a.B = !1; a.na = function () { a.B = !0; a.i() }; a.isReadyToTrack = function () {
        var c = !0, b = a.visitor; a.Y || a.C || (a.Ma(a.Ta) ? a.C = !0 : a.Y = !0); if (a.Y && !a.C) return !1; b && b.isAllowed() && (a.W || a.marketingCloudVisitorID || !b.getMarketingCloudVisitorID || (a.W = !0, a.marketingCloudVisitorID = b.getMarketingCloudVisitorID([a, a.Qa]),
        a.marketingCloudVisitorID && (a.Q = !0)), a.T || a.analyticsVisitorID || !b.getAnalyticsVisitorID || (a.T = !0, a.analyticsVisitorID = b.getAnalyticsVisitorID([a, a.Ia]), a.analyticsVisitorID && (a.N = !0)), a.V || a.audienceManagerLocationHint || !b.getAudienceManagerLocationHint || (a.V = !0, a.audienceManagerLocationHint = b.getAudienceManagerLocationHint([a, a.Ka]), a.audienceManagerLocationHint && (a.P = !0)), a.U || a.audienceManagerBlob || !b.getAudienceManagerBlob || (a.U = !0, a.audienceManagerBlob = b.getAudienceManagerBlob([a, a.Ja]), a.audienceManagerBlob &&
        (a.O = !0)), a.W && !a.Q && !a.marketingCloudVisitorID || a.T && !a.N && !a.analyticsVisitorID || a.V && !a.P && !a.audienceManagerLocationHint || a.U && !a.O && !a.audienceManagerBlob) && (c = !1); a.X || a.B || (a.La(a.na) ? a.B = !0 : a.X = !0); a.X && !a.B && (c = !1); return c
    }; a.k = q; a.o = 0; a.callbackWhenReadyToTrack = function (c, b, d) { var f; f = {}; f.Xa = c; f.Wa = b; f.Ua = d; a.k == q && (a.k = []); a.k.push(f); 0 == a.o && (a.o = setInterval(a.i, 100)) }; a.i = function () {
        var c; if (a.isReadyToTrack() && (a.o && (clearInterval(a.o), a.o = 0), a.k != q)) for (; 0 < a.k.length;) c = a.k.shift(),
        c.Wa.apply(c.Xa, c.Ua)
    }; a.Oa = function (c) { var b, d, f = q, e = q; if (!a.isReadyToTrack()) { b = []; if (c != q) for (d in f = {}, c) f[d] = c[d]; e = {}; a.Ga(e, !0); b.push(f); b.push(e); a.callbackWhenReadyToTrack(a, a.track, b); return !0 } return !1 }; a.fb = function () {
        var c = a.cookieRead("s_fid"), b = "", d = "", f; f = 8; var e = 4; if (!c || 0 > c.indexOf("-")) { for (c = 0; 16 > c; c++) f = Math.floor(Math.random() * f), b += "0123456789ABCDEF".substring(f, f + 1), f = Math.floor(Math.random() * e), d += "0123456789ABCDEF".substring(f, f + 1), f = e = 16; c = b + "-" + d } a.cookieWrite("s_fid",
        c, 1) || (c = 0); return c
    }; a.t = a.track = function (c, b) {
        var d, f = new Date, e = "s" + Math.floor(f.getTime() / 108E5) % 10 + Math.floor(1E13 * Math.random()), g = f.getYear(), g = "t=" + a.escape(f.getDate() + "/" + f.getMonth() + "/" + (1900 > g ? g + 1900 : g) + " " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds() + " " + f.getDay() + " " + f.getTimezoneOffset()); a.visitor && (a.visitor.getAuthState && (a.authState = a.visitor.getAuthState()), !a.supplementalDataID && a.visitor.getSupplementalDataID && (a.supplementalDataID = a.visitor.getSupplementalDataID("AppMeasurement:" +
        a._in, a.expectSupplementalData ? !1 : !0))); a.l("_s"); a.Oa(c) || (b && a.M(b), c && (d = {}, a.Ga(d, 0), a.M(c)), a.lb() && (a.analyticsVisitorID || a.marketingCloudVisitorID || (a.fid = a.fb()), a.qb(), a.usePlugins && a.doPlugins && a.doPlugins(a), a.account && (a.abort || (a.trackOffline && !a.timestamp && (a.timestamp = Math.floor(f.getTime() / 1E3)), f = k.location, a.pageURL || (a.pageURL = f.href ? f.href : f), a.referrer || a.Ha || (a.referrer = r.document.referrer), a.Ha = 1, a.referrer = a.cb(a.referrer), a.l("_g")), a.hb() && !a.abort && (a.ib(), g += a.gb(), a.pb(e,
        g), a.l("_t"), a.referrer = ""))), c && a.M(d, 1)); a.abort = a.supplementalDataID = a.timestamp = a.pageURLRest = a.linkObject = a.clickObject = a.linkURL = a.linkName = a.linkType = k.s_objectID = a.pe = a.pev1 = a.pev2 = a.pev3 = a.e = 0
    }; a.tl = a.trackLink = function (c, b, d, f, e) { a.linkObject = c; a.linkType = b; a.linkName = d; e && (a.j = c, a.q = e); return a.track(f) }; a.trackLight = function (c, b, d, f) { a.lightProfileID = c; a.lightStoreForSeconds = b; a.lightIncrementBy = d; return a.track(f) }; a.clearVars = function () {
        var c, b; for (c = 0; c < a.c.length; c++) if (b = a.c[c], "prop" ==
        b.substring(0, 4) || "eVar" == b.substring(0, 4) || "hier" == b.substring(0, 4) || "list" == b.substring(0, 4) || "channel" == b || "events" == b || "eventList" == b || "products" == b || "productList" == b || "purchaseID" == b || "transactionID" == b || "state" == b || "zip" == b || "campaign" == b) a[b] = void 0
    }; a.tagContainerMarker = ""; a.pb = function (c, b) {
        var d, f = a.trackingServer; d = ""; var e = a.dc, g = "sc.", k = a.visitorNamespace; f ? a.trackingServerSecure && a.ssl && (f = a.trackingServerSecure) : (k || (k = a.account, f = k.indexOf(","), 0 <= f && (k = k.substring(0, f)), k = k.replace(/[^A-Za-z0-9]/g,
        "")), d || (d = "2o7.net"), e = e ? ("" + e).toLowerCase() : "d1", "2o7.net" == d && ("d1" == e ? e = "112" : "d2" == e && (e = "122"), g = ""), f = k + "." + e + "." + g + d); d = a.ssl ? "https://" : "http://"; e = a.AudienceManagement && a.AudienceManagement.isReady(); d += f + "/b/ss/" + a.account + "/" + (a.mobile ? "5." : "") + (e ? "10" : "1") + "/JS-" + a.version + (a.ub ? "T" : "") + (a.tagContainerMarker ? "-" + a.tagContainerMarker : "") + "/" + c + "?AQB=1&ndh=1&pf=1&" + (e ? "callback=s_c_il[" + a._in + "].AudienceManagement.passData&" : "") + b + "&AQE=1"; a.ab(d); a.da()
    }; a.ab = function (c) {
        a.g || a.jb();
        a.g.push(c); a.fa = a.r(); a.Fa()
    }; a.jb = function () { a.g = a.mb(); a.g || (a.g = []) }; a.mb = function () { var c, b; if (a.ka()) { try { (b = k.localStorage.getItem(a.ia())) && (c = k.JSON.parse(b)) } catch (d) { } return c } }; a.ka = function () { var c = !0; a.trackOffline && a.offlineFilename && k.localStorage && k.JSON || (c = !1); return c }; a.wa = function () { var c = 0; a.g && (c = a.g.length); a.v && c++; return c }; a.da = function () { if (!a.v) if (a.xa = q, a.ja) a.fa > a.I && a.Da(a.g), a.ma(500); else { var c = a.Va(); if (0 < c) a.ma(c); else if (c = a.ua()) a.v = 1, a.ob(c), a.sb(c) } }; a.ma =
    function (c) { a.xa || (c || (c = 0), a.xa = setTimeout(a.da, c)) }; a.Va = function () { var c; if (!a.trackOffline || 0 >= a.offlineThrottleDelay) return 0; c = a.r() - a.Ca; return a.offlineThrottleDelay < c ? 0 : a.offlineThrottleDelay - c }; a.ua = function () { if (0 < a.g.length) return a.g.shift() }; a.ob = function (c) { if (a.debugTracking) { var b = "AppMeasurement Debug: " + c; c = c.split("&"); var d; for (d = 0; d < c.length; d++) b += "\n\t" + a.unescape(c[d]); a.nb(b) } }; a.Pa = function () { return a.marketingCloudVisitorID || a.analyticsVisitorID }; a.S = !1; var s; try { s = JSON.parse('{"x":"y"}') } catch (x) {
        s =
        null
    } s && "y" == s.x ? (a.S = !0, a.R = function (a) { return JSON.parse(a) }) : k.$ && k.$.parseJSON ? (a.R = function (a) { return k.$.parseJSON(a) }, a.S = !0) : a.R = function () { return null }; a.sb = function (c) {
        var b, d, f; a.Pa() && 2047 < c.length && ("undefined" != typeof XMLHttpRequest && (b = new XMLHttpRequest, "withCredentials" in b ? d = 1 : b = 0), b || "undefined" == typeof XDomainRequest || (b = new XDomainRequest, d = 2), b && a.AudienceManagement && a.AudienceManagement.isReady() && (a.S ? b.pa = !0 : b = 0)); !b && a.kb && (c = c.substring(0, 2047)); !b && a.d.createElement && a.AudienceManagement &&
        a.AudienceManagement.isReady() && (b = a.d.createElement("SCRIPT")) && "async" in b && ((f = (f = a.d.getElementsByTagName("HEAD")) && f[0] ? f[0] : a.d.body) ? (b.type = "text/javascript", b.setAttribute("async", "async"), d = 3) : b = 0); b || (b = new Image, b.alt = ""); b.ra = function () { try { a.la && (clearTimeout(a.la), a.la = 0), b.timeout && (clearTimeout(b.timeout), b.timeout = 0) } catch (c) { } }; b.onload = b.tb = function () { b.ra(); a.$a(); a.Z(); a.v = 0; a.da(); if (b.pa) { b.pa = !1; try { var c = a.R(b.responseText); AudienceManagement.passData(c) } catch (d) { } } }; b.onabort =
        b.onerror = b.bb = function () { b.ra(); (a.trackOffline || a.ja) && a.v && a.g.unshift(a.Za); a.v = 0; a.fa > a.I && a.Da(a.g); a.Z(); a.ma(500) }; b.onreadystatechange = function () { 4 == b.readyState && (200 == b.status ? b.tb() : b.bb()) }; a.Ca = a.r(); if (1 == d || 2 == d) { var e = c.indexOf("?"); f = c.substring(0, e); e = c.substring(e + 1); e = e.replace(/&callback=[a-zA-Z0-9_.\[\]]+/, ""); 1 == d ? (b.open("POST", f, !0), b.send(e)) : 2 == d && (b.open("POST", f), b.send(e)) } else if (b.src = c, 3 == d) {
            if (a.Aa) try { f.removeChild(a.Aa) } catch (g) { } f.firstChild ? f.insertBefore(b,
            f.firstChild) : f.appendChild(b); a.Aa = a.Ya
        } b.abort && (a.la = setTimeout(b.abort, 5E3)); a.Za = c; a.Ya = k["s_i_" + a.replace(a.account, ",", "_")] = b; if (a.useForcedLinkTracking && a.D || a.q) a.forcedLinkTrackingTimeout || (a.forcedLinkTrackingTimeout = 250), a.aa = setTimeout(a.Z, a.forcedLinkTrackingTimeout)
    }; a.$a = function () { if (a.ka() && !(a.Ba > a.I)) try { k.localStorage.removeItem(a.ia()), a.Ba = a.r() } catch (c) { } }; a.Da = function (c) { if (a.ka()) { a.Fa(); try { k.localStorage.setItem(a.ia(), k.JSON.stringify(c)), a.I = a.r() } catch (b) { } } }; a.Fa =
    function () { if (a.trackOffline) { if (!a.offlineLimit || 0 >= a.offlineLimit) a.offlineLimit = 10; for (; a.g.length > a.offlineLimit;) a.ua() } }; a.forceOffline = function () { a.ja = !0 }; a.forceOnline = function () { a.ja = !1 }; a.ia = function () { return a.offlineFilename + "-" + a.visitorNamespace + a.account }; a.r = function () { return (new Date).getTime() }; a.ya = function (a) { a = a.toLowerCase(); return 0 != a.indexOf("#") && 0 != a.indexOf("about:") && 0 != a.indexOf("opera:") && 0 != a.indexOf("javascript:") ? !0 : !1 }; a.setTagContainer = function (c) {
        var b, d, f; a.ub =
        c; for (b = 0; b < a._il.length; b++) if ((d = a._il[b]) && "s_l" == d._c && d.tagContainerName == c) {
            a.M(d); if (d.lmq) for (b = 0; b < d.lmq.length; b++) f = d.lmq[b], a.loadModule(f.n); if (d.ml) for (f in d.ml) if (a[f]) for (b in c = a[f], f = d.ml[f], f) !Object.prototype[b] && ("function" != typeof f[b] || 0 > ("" + f[b]).indexOf("s_c_il")) && (c[b] = f[b]); if (d.mmq) for (b = 0; b < d.mmq.length; b++) f = d.mmq[b], a[f.m] && (c = a[f.m], c[f.f] && "function" == typeof c[f.f] && (f.a ? c[f.f].apply(c, f.a) : c[f.f].apply(c))); if (d.tq) for (b = 0; b < d.tq.length; b++) a.track(d.tq[b]); d.s =
            a; break
        }
    }; a.Util = { urlEncode: a.escape, urlDecode: a.unescape, cookieRead: a.cookieRead, cookieWrite: a.cookieWrite, getQueryParam: function (c, b, d) { var f; b || (b = a.pageURL ? a.pageURL : k.location); d || (d = "&"); return c && b && (b = "" + b, f = b.indexOf("?"), 0 <= f && (b = d + b.substring(f + 1) + d, f = b.indexOf(d + c + "="), 0 <= f && (b = b.substring(f + d.length + c.length + 1), f = b.indexOf(d), 0 <= f && (b = b.substring(0, f)), 0 < b.length))) ? a.unescape(b) : "" } }; a.A = "supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL referrer contextData currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData pe pev1 pev2 pev3 pageURLRest".split(" ");
    a.c = a.A.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" ")); a.ga = "timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" "); a.J = a.ga.slice(0); a.oa = "account allAccounts debugTracking visitor trackOffline offlineLimit offlineThrottleDelay offlineFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData AudienceManagement".split(" ");
    for (n = 0; 250 >= n; n++) 76 > n && (a.c.push("prop" + n), a.J.push("prop" + n)), a.c.push("eVar" + n), a.J.push("eVar" + n), 6 > n && a.c.push("hier" + n), 4 > n && a.c.push("list" + n); n = "latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage".split(" "); a.c = a.c.concat(n); a.A = a.A.concat(n); a.ssl = 0 <= k.location.protocol.toLowerCase().indexOf("https"); a.charSet = "UTF-8"; a.contextData = {}; a.offlineThrottleDelay = 0; a.offlineFilename = "AppMeasurement.offline";
    a.Ca = 0; a.fa = 0; a.I = 0; a.Ba = 0; a.linkDownloadFileTypes = "exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx"; a.w = k; a.d = k.document; try { a.kb = "Microsoft Internet Explorer" == navigator.appName } catch (y) { } a.Z = function () { a.aa && (k.clearTimeout(a.aa), a.aa = q); a.j && a.D && a.j.dispatchEvent(a.D); a.q && ("function" == typeof a.q ? a.q() : a.j && a.j.href && (a.d.location = a.j.href)); a.j = a.D = a.q = 0 }; a.Ea = function () {
        a.b = a.d.body; a.b ? (a.p = function (c) {
            var b, d, f, e, g; if (!(a.d && a.d.getElementById("cppXYctnr") || c && c["s_fe_" + a._in])) {
                if (a.qa) if (a.useForcedLinkTracking) a.b.removeEventListener("click",
                a.p, !1); else { a.b.removeEventListener("click", a.p, !0); a.qa = a.useForcedLinkTracking = 0; return } else a.useForcedLinkTracking = 0; a.clickObject = c.srcElement ? c.srcElement : c.target; try {
                    if (!a.clickObject || a.H && a.H == a.clickObject || !(a.clickObject.tagName || a.clickObject.parentElement || a.clickObject.parentNode)) a.clickObject = 0; else {
                        var m = a.H = a.clickObject; a.ea && (clearTimeout(a.ea), a.ea = 0); a.ea = setTimeout(function () { a.H == m && (a.H = 0) }, 1E4); f = a.wa(); a.track(); if (f < a.wa() && a.useForcedLinkTracking && c.target) {
                            for (e = c.target; e &&
                            e != a.b && "A" != e.tagName.toUpperCase() && "AREA" != e.tagName.toUpperCase() ;) e = e.parentNode; if (e && (g = e.href, a.ya(g) || (g = 0), d = e.target, c.target.dispatchEvent && g && (!d || "_self" == d || "_top" == d || "_parent" == d || k.name && d == k.name))) {
                                try { b = a.d.createEvent("MouseEvents") } catch (n) { b = new k.MouseEvent } if (b) {
                                    try { b.initMouseEvent("click", c.bubbles, c.cancelable, c.view, c.detail, c.screenX, c.screenY, c.clientX, c.clientY, c.ctrlKey, c.altKey, c.shiftKey, c.metaKey, c.button, c.relatedTarget) } catch (q) { b = 0 } b && (b["s_fe_" + a._in] = b.s_fe =
                                    1, c.stopPropagation(), c.stopImmediatePropagation && c.stopImmediatePropagation(), c.preventDefault(), a.j = c.target, a.D = b)
                                }
                            }
                        }
                    }
                } catch (r) { a.clickObject = 0 }
            }
        }, a.b && a.b.attachEvent ? a.b.attachEvent("onclick", a.p) : a.b && a.b.addEventListener && (navigator && (0 <= navigator.userAgent.indexOf("WebKit") && a.d.createEvent || 0 <= navigator.userAgent.indexOf("Firefox/2") && k.MouseEvent) && (a.qa = 1, a.useForcedLinkTracking = 1, a.b.addEventListener("click", a.p, !0)), a.b.addEventListener("click", a.p, !1))) : setTimeout(a.Ea, 30)
    }; a.Ea()
}
function s_gi(a) { var k, q = window.s_c_il, r, n, t = a.split(","), u, s, x = 0; if (q) for (r = 0; !x && r < q.length;) { k = q[r]; if ("s_c" == k._c && (k.account || k.oun)) if (k.account && k.account == a) x = 1; else for (n = k.account ? k.account : k.oun, n = k.allAccounts ? k.allAccounts : n.split(","), u = 0; u < t.length; u++) for (s = 0; s < n.length; s++) t[u] == n[s] && (x = 1); r++ } x || (k = new AppMeasurement); k.setAccount ? k.setAccount(a) : k.sa && k.sa(a); return k } AppMeasurement.getInstance = s_gi; window.s_objectID || (window.s_objectID = 0);
function s_pgicq() { var a = window, k = a.s_giq, q, r, n; if (k) for (q = 0; q < k.length; q++) r = k[q], n = s_gi(r.oun), n.setAccount(r.un), n.setTagContainer(r.tagContainerName); a.s_giq = 0 } s_pgicq();