const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const TestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const TestModel = mongoose.model('Test', TestSchema);

module.exports = class Test {
	constructor(body) {
		this.body = body;
		this.errors = [];
		this.user = null;
	}

	async register() {
        this.valid()
        if(this.errors > 0) return this.errors;
        this.user = await TestModel.create(this.body);
    }

	valid() {
        this.cleanUp();

        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
        if(this.body.password.length < 8 || this.body.password.length > 25) {
            this.errors.push('A senha precisa ter entre 8 e 25 caracteres.');
        }

        if(!this.body.name) this.errors.push('Nome inválido.')
        if(this.errors.length > 0) return;
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido');

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);
    }

	cleanUp() {
        for(let key in this.body) {
            if(typeof this.body[key] !== 'string') this.body[key] = '';
        }

        this.body = {
            name: this.body.name,
            email: this.body.email,
            password: this.body.password
        };
    }

    static async Find(params) {
    	try {
            if(!params) {
                const all = await TestModel.find();
                return all ? all : null;
            }
            const param = {};
            param[params[0]] = params[1];
            const obj = await TestModel.find(param);
            return obj ? obj : null;
    	} catch (e) {
            console.log(e.message);
    		return { err: 'MongoDB Error - Find class Test' };
    	}
    }

    static async Update(params, update) {
        try {
            if(!params || !update) return;
            const param = {};
            param[params[0]] = params[1];
            const after = await TestModel.findOneAndUpdate(param, update.body);
            return after._id;
        } catch (e) {
            console.log(e.message);
            return { err: 'MongoDB error - Update class Test' };
        }
    }

    static async Delete(params) {
        try {
            if(!params) return;
            const param = {};
            param[params[0]] = params[1];
            const exclude = await TestModel.findOneAndDelete(param);
            return exclude._id;
        } catch (e) {
            console.log(e.message);
            return { err: 'MongoDB Error - Delete class Test' };
        }
    }
}
