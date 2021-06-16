const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) =>{
	const friends = [];
	res.send({friends: friends});
});

module.exports = router;