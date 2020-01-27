/* Copyright (c) 2020 Robert Steckroth, Bust0ut <RobertSteckroth@gmail.com>, All rights reserved 
	Batten Document Mocha is a plugin for Brace Document which adds the output of the mocha unit test to the documents. */

var expect = require("chai").expect,
	path = require("path"),
	fs = require("fs"),
	utils = require("bracket_utils"),
	maybe = require("brace_maybe")

var it_will = global
global.module = module
var cache = utils.cacheManager(require)

describe("Using stop further progression methodology for dependencies in: "+path.basename(__filename), function() { 

	var it = maybe(it_will)	
	it_will.stop = !!process.env.DRY_RUN  
	it_will.quiet = !!process.env.QUIET

	describe("Checking for dependencies..", function() { 

		it("requirejs is in the system as a program", function(done) {
			it_will.stop = true 
			expect((function() {try { require("requirejs"); return true; } catch(e) { return e;}})(), "unable to find the requirejs module").to.be.true
			it_will.stop = false 
			done()
		})
		it("the brace_document module is install on the system", function(done) {
			it_will.stop = true 
			expect((function() {try { require("brace_document"); return true }catch(e) { return !!console.log(e) }})(), "unable to find the brace_document module").to.be.true
			it_will.stop = false 
			done()
		})
	})

	describe("is able to aquire the package.json data from the api", function(done) {

		var requirejs, parser, opt
		beforeEach(function(done) {
			parser = null
			cache.start()
			opt = { 
				pluginRegex: "^brace_document_specification$", 
				pluginPath: __dirname,
				//input: path.join("test", "example") 
				projectLocation: path.join(__dirname, "example", "cooljoes") 
			}
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
			done()
		})
		afterEach(cache.dump.bind(cache))

		var err_cb = function(error) { expect(false, error).to.be.true; done() }

		it(".............", function(done) {
			
			requirejs(["brace_document"], function(document_parse) { 
				parser = document_parse(opt, function() {

					console.log(this.parser.plugin.collect)
					//expect(this.plugin.collect."The plugin should have errored.").to.be.true
					done()
				}, function(msg, a, b) {
					done()
				})
			}, err_cb)
		})

	})
})

