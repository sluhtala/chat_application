const express = require("express");
const router = express.Router();
const login_handler = require("../login_handler");

const fs = require("fs");

const testRest = `GET http://localhost:3001/test 
Authorization: Bearer `;

router.post("/", async (req, res) => {
    console.log("logging in");
    try {
        const body = req.body;
        const user = await login_handler.login(body);

        //debug
        fs.writeFileSync("src/test.rest", `${testRest}${user.token}`);
        res.send(user);
    } catch (e) {
        console.log(e.message);
        res.status(401).send({ error: 'invalid username or password' });
    }
});

module.exports = router;
