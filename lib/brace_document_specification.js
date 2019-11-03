/* The Batten document specification parser generates a document with the project package.json file and source code meta data.
 Copyright (c) 2020 Robert Steckroth, Bust0ut <RobertSteckroth@gmail.com>, All rights reserved */

var path = require("path")

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["bracket_print", "./package_parser"], function(print, package_parser) {
	
	return function(parser, up, cb, err) {

		// The simplest way to determine if the argument is of the bracket_print type.
		if ( up && up.parent && (up instanceof up.parent) ) {
			this.up = up = up.spawn(up.log_title+" -> ") 
		}
		else {
			if ( typeof up === "function" ) {
				err = cb 
				cb = up
			}
			this.up = up = print({level: 1, title: true, title_stamp: false})
		}

		up.log_title = up.log_title + "brace_document_specification"
		this.up_err = up.spawn({level: 2, log_title: up.log_title+" - ERROR"})	

		cb = typeof cb === "function" && cb || function(){}
		// Create the error callback which will transfer the logger from this method into the calling method error callback.
		var err_cb = function() {
			if ( typeof err === "function" )
				err.apply(err.prototype, arguments)
		}

		// Create the parser instance with the local logger so that the title and options are matched and linked.
		var api = package_parser(up)

		// The parser uses all of the option data passed into the constructor which can can also be the object returned from the cli script. Here is
		// where any additional option mis-configuration checking logic should be added.
		api.parser = parser

		parser = parser || {}
		// The option can be a commander instance or a object literal.
		if ( typeof parser.option === "object" ) 
			api.option = parser.option
		else
			api.option = parser

		this.runThrough = function(structure, data, cb, err) {
			
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() {
				if ( typeof err === "function" )
					err.apply(err.prototype, arguments)
			}

			parser.acquireMeta(function(meta) {

				// The meta object contains the information necessary to locate other information. It is passed to other methods in order to create a 
				// decoupled API.
				api.acquireContent(meta, content => {
					parser.addStructureDirectory(structure, path.dirname(api.option.specificationPath), (list) => {
						list.push(api.option.specificationPath)
						parser.addData(data, api.option.specificationPath, content, () => {
							parser.sortStructure(structure, cb, err_cb)
						}, err_cb)
					}, err_cb)
				}, err_cb)
			}, err_cb)
		}

		return this
	}
})
