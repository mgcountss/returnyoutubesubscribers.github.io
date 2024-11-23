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
                axios.get(process.env.niaapi + "" + req.params.id, {
                    timeout: 1750
                }).then(response => {
                    res.status(200).send({ "success": true, "count": response.data.estSubCount, "verified": response.data.isStudio, "by": "nia-statistics.com" });
                }).catch(err => {
                    axios.get(process.env.axapi + "" + req.params.id, {
                        timeout: 1750
                    }).then(response => {
                        res.status(200).send({ "success": true, "count": response.data.estSubCount, "verified": response.data.verified, "by": "axern.space" });
                    }).catch(err => {
                        res.status(200).send({ "success": false, "count": 0, "verified": false, "msg": "unknown channel" });
                    })
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

app.listen(1111);
