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

		it("brace_document is in the system as a program", function(done) {
			it_will.stop = true 
			expect((function() {try { require("brace_document"); return true; } catch(e) { return e;}})(), "unable to find the brace_document module").to.be.true
			it_will.stop = false 
			done()
		})

	})

	describe("is able to aquire the package.json data from the api", function(done) {

		var cwd = path.join(__dirname, "example"), requirejs, meta
		beforeEach(function() {
			cache.start()
			requirejs = require("requirejs")
			requirejs.config({baseUrl: path.join(__dirname, "..", "lib"), nodeRequire: require})
			meta = {package: require(path.join(__dirname, "..", "package.json"))}
		})
		afterEach(cache.dump.bind(cache))

		it("checking the acquireOutput API member using the entry script as the entry point", function(done) {
			
			requirejs(["./package_parser"], function(parser) {

				parser(function() {
					this.acquireContent(meta, function(content) {
						expect(content).to.include("# "+meta.package.name)
						done()	
					}, function(error) { expect(true, error).to.be.false; done() })
				}, function(error) { expect(true, error).to.be.false; done() })
			})
		})

	})
})

