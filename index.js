const axios = require('axios');

const defaultSource = 'http://localhost/';
const defaultPath = '/resources';

module.exports = ({ source = defaultSource, path = defaultPath } = {}) => (req, res, next) => {
	if (req.path !== path) {
		next();
	} else {
		const resources = Object.keys(req.query);
		const requests = resources.map(key => axios.get(source + req.query[key])
			.then(response => response.data)
			.catch(() => []));

		Promise.all(requests).then((data) => {
			const response = {};
			data.forEach((item, i) => {
				response[resources[i]] = item;
			});
			res.json(response);
		}).catch(error => res.status(500).json(error));
	}
};
