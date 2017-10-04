const chai = require('chai');
const http = require('http');
const chaiHttp = require('chai-http');
const express = require('express');
const nock = require('nock');
const middleware = require('..');

const expect = chai.expect;

chai.use(chaiHttp);
let app, server;

describe('Aggregate middleware testing', () => {
	beforeEach(() => {
		app = express();
		app.use(middleware({
			source: 'http://localhost/',
			path: '/resources',
		}));
		app.use((req, res) => {
			res.status(404).end();
		});
		server = http.createServer(app);
	});

	afterEach(() => {
		nock.cleanAll();
		server.close();
	});

	it('should test not resource url', async () => {
		await chai.request(server)
			.get('/')
			.send()
			.catch((err) => {
				expect(err).to.have.status(404);
			});
	});

	it('should test empty resource', async () => {
		await chai.request(server)
			.get('/resources')
			.send()
			.then((res) => {
				expect(res).to.have.status(200);
				expect(JSON.stringify(res.body)).to.be.equal('{}');
			});
	});

	it('should test user resource', async () => {
		const data = [
			{ id: 1, name: 'user1'},
			{ id: 2, name: 'user2'}
		];
		nock('http://localhost/')
			.get('/api/users')
			.reply(200, data);

		await chai.request(server)
			.get('/resources?users=api/users')
			.send()
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('users');
				expect(res.body.users).to.be.eql(data);
			});
	});

	it('should test customers resource', async () => {
		const data = [
			{ id: 1, name: 'customer1'},
			{ id: 2, name: 'customer2'}
		];
		nock('http://localhost/')
			.get('/api/customers')
			.reply(200, data);

		await chai.request(server)
			.get('/resources?customers=api/customers')
			.send()
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('customers');
				expect(res.body.customers).to.be.eql(data);
			});
	});

	it('should test customer resource', async () => {
		const data = { id: 23, name: 'customer23'};
		nock('http://localhost/')
			.get('/api/customers/23')
			.reply(200, data);

		await chai.request(server)
			.get('/resources?customer=api/customers/23')
			.send()
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('customer');
				expect(res.body.customer).to.be.eql(data);
			});
	});

	it('should test country resource', async () => {
		const data = [
			{ id: 1, name: 'country'},
			{ id: 2, name: 'country2'}
		];
		nock('http://localhost/')
			.get('/api/countries')
			.reply(200, data);

		await chai.request(server)
			.get('/resources?countries=api/countries')
			.send()
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('countries');
				expect(res.body.countries).to.be.eql(data);
			});
	});

	it('should test all resources', async () => {
		const users = [
			{ id: 1, name: 'user1'},
			{ id: 2, name: 'user2'}
		];
		nock('http://localhost/')
			.get('/api/users')
			.reply(200, users);

		const customer = { id: 23, name: 'customer23'};
		nock('http://localhost/')
			.get('/api/customers/23')
			.reply(200, customer);

		const countries = [
			{ id: 1, name: 'country'},
			{ id: 2, name: 'country2'}
		];
		nock('http://localhost/')
			.get('/api/countries')
			.reply(200, countries);

		await chai.request(server)
			.get('/resources?users=api/users&customer=api/customers/23&countries=api/countries ')
			.send()
			.then((res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.property('users');
				expect(res.body.users).to.be.eql(users);

				expect(res.body).to.have.property('customer');
				expect(res.body.customer).to.be.eql(customer);

				expect(res.body).to.have.property('countries');
				expect(res.body.countries).to.be.eql(countries);
			});
	});
});
