/*  Copyright (c) 2020 Robert Steckroth <RobertSteckroth@gmail.com> -- MIT license

Brace Document Specification resides under the MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


  The Brace Document Specification plugin generates a document with the project package.json file and source code meta data.

  this file is a part of Brace Document Specification 

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

var path = require("path")

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["bracket_print", "./specification_parser"], function(print, specification_parser) {
	
	return function(parser, up, cb, err) {

		// The simplest way to determine if the argument is of the bracket_print type.
		if ( up && up.parent && (up instanceof up.parent) )
			this.up = up = up.spawn(up.log_title+" -> ") 
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
		var err_cb = function() { if ( typeof err === "function" ) err.apply(err.prototype, arguments) }

		// Create the parser instance with the local logger so that the title and options are matched and linked.
		var specification = specification_parser(up)
		parser.addPlugin(specification)
		
		this.runThrough = function(structure, data, cb, err) {
			
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() { if ( typeof err === "function" ) err.apply(err.prototype, arguments) }

			parser.acquireMeta(function(meta) {
			// The meta object contains the information necessary to locate other information. It is passed to other methods in order to create a decoupled API.
				specification.generateContent(meta, content => {
					parser.addStructureEntry(structure, specification.option.specificationPath, () => {
						parser.addDataEntry(data, specification.option.specificationPath, content, () => {
							parser.sortStructure(structure, cb, err_cb)
						}, err_cb)
					}, err_cb)
				}, err_cb)
			}, err_cb)
		}

		return this
	}
})
