const app = require('express')()
const axios = require('axios');
const cors = require('cors');
var fetch = require('node-fetch');
require('dotenv').config();
app.use(cors());
app.get('/:id', (req, res) => {
    if (req.params.id.length == 24) {
        if (req.params.id.startsWith('UC')) {
            axios.get(process.env.ncapi + "" + req.params.id)
                .then(response => {
                    if (response.data.success == false) {
                        next()
                    } else {
                        res.status(200).send({ "success": true, "count": response.data.subs + "<br><a style='color: #FFF;' href='https://unabbreviate.nextcounts.com/'>Verified by NextCounts</a>", "verified": true });
                    }
                }).catch(err => {
                    next()
                })
        } else {
            res.send({ "success": false, "count": null, "verified": false })
        }
    } else {
        res.send({ "success": false, "count": null, "verified": false })
    }
    function next() {
        axios.get(process.env.lcapi + "" + req.params.id)
            .then(response => {
                res.status(200).send({ "success": true, "count": response.data.counts[0], "verified": false });
            }).catch(err => {
                axios.get(process.env.lcapi + "" + req.params.id)
                    .then(response => {
                        res.status(200).send({ "success": true, "count": response.data.counts[0].count, "verified": false });
                    }).catch(err => {
                        res.send({ "success": false, "count": null, "verified": false })
                    })
            })
    }
})

setInterval(function () {
    fetch(process.env.url1)
    fetch(process.env.url2)
    fetch(process.env.url3)
}, 15000)

app.listen(80);