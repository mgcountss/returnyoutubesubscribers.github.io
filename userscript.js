var currentURL = window.location.href;

check()
function check() {
    if (document.getElementById("subscriber-count")) {
        if (document.getElementById('edit-buttons').childElementCount == 2) {
            stats()
        } else {
            stats()
        }
    } else if (document.getElementById("owner-sub-count")) {
        stats2()
    } else {
        setTimeout(function () {
            check()
        }, 100)
    }
}

function stats() {
    var req = new XMLHttpRequest();
    req.open('GET', currentURL, false);
    req.send(null);
    if (req.status == 200) {
        let res = req.responseText
        cid = res.split(`,{"key":"browse_id","value":"`)[1].split(`"},`)[0]
        getCount()
        async function getCount() {
            await fetch('https://backend.mgcounts.com/' + cid + '')
                .then(response => response.json()).catch(err => {
                    console.log(err)
                    console.log('https://backend.mgcounts.com/' + cid + '')
                }).then(data => {
                    console.log(data)
                    if (data) {
                        if (data.success == true) {
                            document.querySelector("#subscriber-count").innerHTML = data.count.toLocaleString() + " subscribers"
                            document.querySelector("#subscriber-count").setAttribute("loaded", "true")
                        } else if (data.count == false) {
                            document.querySelector("#subscriber-count").innerHTML = res.split(`,"subscriberCountText":{"accessibility":{"accessibilityData":{"label":"`)[1].split(' subscribers')[0] + " subscribers"
                            document.querySelector("#subscriber-count").setAttribute("loaded", "true")
                        } else {
                            alert('error')
                        }
                    }
                }).catch(err => {
                    console.log(err)
                    console.log('https://backend.mgcounts.com/' + cid + '')
                })
        }
    }
}

function stats2() {
    var req = new XMLHttpRequest();
    req.open('GET', currentURL, false);
    req.send(null);
    if (req.status == 200) {
        let res = req.responseText
        cid = res.split(`<meta itemprop="channelId" content="`)[1].split(`">`)[0]
        getCount()
        async function getCount() {
            await fetch('https://backend.mgcounts.com/' + cid + '')
                .then(response => response.json()).catch(err => {
                    console.log(err)
                    console.log('https://backend.mgcounts.com/' + cid + '')
                }).then(data => {
                    console.log(data)
                    if (data) {
                        if (data.success == true) {
                            document.querySelector("#owner-sub-count").innerHTML = data.count.toLocaleString() + " subscribers"
                            document.querySelector("#owner-sub-count").setAttribute("loaded", "true")
                        } else if (data.success == false) {
                            location.reload()
                        }
                    }
                }).catch(err => {
                    console.log(err)
                    console.log('https://backend.mgcounts.com/' + cid + '')
                })
        }
    }
}

setInterval(function () {
    const url = window.location.href
    if ((currentURL == window.location.href) == false) {
        if (url.includes("/channel/") || url.includes("/c/") || url.includes("/user/") || url.includes("/watch?v=")) {
            if (url.includes("/channel/") || url.includes("/c/") || url.includes("/user/") || url.includes("/watch?v=")) currentURL = window.location.href;
            if (url.includes("/watch?v=")) {
                stats2()
            } else if (url.includes("/channel/") || url.includes("/c/") || url.includes("/user/")) {
                if (document.getElementById('edit-buttons').childElementCount == 2) {
                    stats()
                } else {
                    stats()
                }
            }
        }
    }
}, 500)