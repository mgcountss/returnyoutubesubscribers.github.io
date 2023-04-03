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
            axios.get(process.env.ncapi + "" + req.params.id)
                .then(response => {
                    if (response.data.success == false) {
                        next()
                        console.log('next nc to xyz')
                    } else {
                        res.status(200).send({ "success": true, "count": response.data.subs, "verified": true });
                    }
                }).catch(err => {
                    next()
                    console.log('next nc to xyz')
                })
        } else {
            res.send({ "success": false, "count": null, "verified": false, "msg": "invalid channel id" })
        }
    } else {
        res.send({ "success": false, "count": null, "verified": false, "msg": "invalid channel id" })
    }
    function next() {
        axios.get(process.env.lcapi + "" + req.params.id)
            .then(response => {
                if (response.data.counts[0] == null) {
                    console.log('next xyz to mx')
                    next2()
                } else {
                    res.status(200).send({ "success": true, "count": response.data.counts[0], "verified": false });
                }
            }).catch(err => {
                console.log('next xyz to mx')
                next2()
            })
    }
    function next2() {
        axios.get(process.env.mxapi + "" + req.params.id)
            .then(response => {
                res.status(200).send({ "success": true, "count": response.data.subscribers, "verified": false });
            }).catch(err => {
              console.log('failed all', req.params.id)
                res.status(200).send({ "success": false, "count": null, "verified": false, "msg": "unknown channel" })
            })
    }
})

app.listen(process.env.port || 80)