import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(cors())

app.get('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.redirect('https://ryts.mgcounts.com')
})

app.get('/:id', (req, res) => {
    if (req.params.id.length == 24) {
        if (req.params.id.startsWith('UC')) {
            try {
            axios.get(process.env.axapi + "" + req.params.id)
                .then(response => {
                    if (response.data.isStudio == true) {
                        res.status(200).send({ "success": true, "count": response.data.estSubCount, "verified": true, "by": "✓" });
                    } else {
                        axios.get(process.env.yabapi.replace('{channel}', req.params.id))
                            .then(response2 => {
                                if ((response2) && (response2.data.statistics) && (response2.data.statistics.subscriberCount)) {
                                    res.status(200).send({ "success": true, "count": response2.data.statistics.subscriberCount, "verified": false, "by": "| yabcounts.com" });
                                } else {
                                    res.status(200).send({ "success": true, "count": response.data.estSubCount, "verified": false, "by": "axern.space" });
                                }
                            }).catch(err => {
                                console.log(err)
                                if (response.data.estSubCount) {
                                    res.status(200).send({ "success": true, "count": response.data.estSubCount, "verified": false, "by": "axern.space" });
                                } else {
                                    res.status(200).send({ "success": false, "count": 0, "verified": false, "msg": "unknown channel" })
                                }
                            })
                    }
                }).catch(err => {
                    console.log(err)
                    res.status(200).send({ "success": false, "count": 0, "verified": false, "msg": "unknown channel" })
                })
            } catch (err) {
                res.status(200).send({ "success": false, "count": 0, "verified": false, "msg": "unknown channel" })
            }
        } else {
            res.send({ "success": false, "count": null, "verified": false, "msg": "invalid channel id" })
        }
    } else {
        res.send({ "success": false, "count": null, "verified": false, "msg": "invalid channel id" })
    }
})

app.listen(1111)
