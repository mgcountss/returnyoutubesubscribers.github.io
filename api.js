var express = require('express')
var app = express()
const cors = require('cors')
const axios = require('axios');
app.use(cors())

app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send("ok")
})

app.get('/:id', (req, res) => {
    if (req.params.id.length == 24) {
        if (req.params.id.startsWith('UC')) {
            axios.get(process.env.lcapi + "" + req.params.id)
            .then(response => {
                if (response.data.isStudio == true) {
                    res.status(200).send({ "success": true, "count": response.data.estSubCount, "verified": true, "by": "✓ by Axern.space" });
                } else {
                    axios.get(process.env.ncapi + "" + req.params.id)
                        .then(response2 => {
                            if (response2.data.success == false) {
                    res.status(200).send({ "success": true, "count": response.data.estSubCount, "verified": false, "by": "✓ by Axern.space" });
                            } else {
                                res.status(200).send({ "success": true, "count": response2.data.subs, "verified": true, "by": "✓ by NextCounts" });
                            }
                        }).catch(err => {
                            res.status(200).send({ "success": false, "count": 0, "verified": false, "msg": "unknown channel" })
                        })
                }
            }).catch(err => {
                res.status(200).send({ "success": false, "count": 0, "verified": false, "msg": "unknown channel" })
            })
        } else {
            res.send({ "success": false, "count": null, "verified": false, "msg": "invalid channel id" })
        }
    } else {
        res.send({ "success": false, "count": null, "verified": false, "msg": "invalid channel id" })
    }
})

app.listen(process.env.port || 80)
