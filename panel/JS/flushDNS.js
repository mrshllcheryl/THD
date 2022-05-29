/*
[Script]
flushDNS = type=generic,timeout=10,script-path=https://github.com/mrshllcheryl/THD/blob/main/panel/JS/flushDNS.js
// use "title" or "icon" or "color" or "server" in "argument":
// flushDNS = type=generic,timeout=10,script-path=https://github.com/mrshllcheryl/THD/blob/main/panel/JS/flushDNS.js,argument=title=DNS FLush&icon=arrow.clockwise&color=#33CCFF&server=false

[Panel]
flushDNS = script-name=flushDNS,update-interval=600
*/
!(async () => {
    const { wifi, v4 } = $network;
    const v4IP = v4.primaryAddress;
    if (!v4IP) {
        $.done({
            title: "未连接网络",
            content: "请检查网络连接",
            icon: "airplane",
            "icon-color": "#00c8ff"
        });
    }

    let dnsCache = (await httpAPI("/v1/dns", "GET")).dnsCache;
    dnsCache = [...new Set(dnsCache.map((d) => d.server))].toString().replace(/,/g, "\n");
    await httpAPI("/v1/dns/flush");
    let delay = ((await httpAPI("/v1/test/dns_delay")).delay * 1000).toFixed(0);
    $done({
        title: "DNS 缓存刷新",
        content: `延迟：${delay} ms`,
        icon: "leaf.arrow.triangle.circlepath",
        "icon-color": "#33CCFF"
    });
})();

function httpAPI(path = "", method = "POST", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
            resolve(result);
        });
    });
}
