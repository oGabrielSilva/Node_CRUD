const TestDB = require('../../models/Test/');
const { version } = require('../../../package.json');

exports.form = (req, res) => res.render('form');

exports.index = async (req, res) => {
	try {
		const db = await TestDB.Find();
		return res.json({ 
			name: 'Server_NodeJS',
			route: [
			{ current: '/' },
			{ 
				register: '/form',
				loginRequired: false,
			},
			{ 
				find: '/find',
				loginRequired: false, 
				exemple: "'/find/name=Tester', '/find', '/find/_id=617eb10affff070eb6f44992'" 
			},
			{ 
				delete: '/delete',
				loginRequired: true,
				exemple: "'/delete/name=Tester', '/delete/_id=617eb10affff070eb6f44992'" 
			},
			{ 
				update: '/update',
				loginRequired: true,
				method: 'post' 
			} 
			],
			res: 'Json',
			db,
			version,
		});
	} catch (e) {
		res.status(400).json({ err: true, catch: true });
		return;
	}
}

exports.find = async (req, res) => {
	try {
		const { id, value } = req.params;
		let params = 1;
		if(!id || !value) params = null;
		const docs = params ? await TestDB.Find([id, value]) : await TestDB.Find();
		return res.json({ docs });
	} catch (e) {
		res.status(400).json({ err: true, catch: true });
		return;
	}
}

exports.post = async (req, res) => {
	try {
		const body = new TestDB(req.body);
		await body.register();
		console.log(body);
		if(body.user) return res.status(200).json({ success: true });
		return res.status(400).json({ error: true });
	} catch (e) {
		res.status(400).json({ err: true, catch: true });
		return;
	}
}

exports.delete = async (req, res) => {
	try {
		const { id, value } = req.params;
		const doc = await TestDB.Delete([id, value]);
		if(doc) return res.status(200).json({ success: true, _id: doc });
		return res.status(400).json({ error: true, update: false });
	} catch (e) {
		res.status(400).json({ err: true, catch: true });
		return;
	}
}

exports.updateGet = async (req, res) => {
	try {
		const { id, value } = req.params;
		const doc = await TestDB.Find([id, value]);
		const { name, email } = doc[0];
		const info = { name, email };
		return res.render('form', { info });
	} catch (e) {
		res.status(400).json({ err: true, catch: true });
		return;
	}
}

exports.update = async (req, res) => {
	try {
		const { id, value } = req.params;
		const body = new TestDB(req.body);
		body.valid();
		if(body.errors.length > 0) return console.log(body.errors);
		const doc = await TestDB.Update([id, value], body);
		if(doc) return res.status(200).json({ success: true, _id: doc });
		return res.status(400).json({ error: true, update: false });
	} catch (e) {
		res.status(400).json({ err: true, catch: true });
		return;
	}
}
