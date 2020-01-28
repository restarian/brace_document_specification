/*  Copyright (c) 2020 Robert Steckroth <RobertSteckroth@gmail.com> -- MIT license

Brace Document Specification resides under the MIT license

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:


  The Brace Document Specification parser generates a document with the project package.json file and source code meta data.

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

if (typeof define !== 'function') { var define = require('amdefine')(module) }

var fs = require("fs"),
	path = require("path")

define(["bracket_print"], function(print) {
	
	var def = function(up, cb, err) {

		// This iterator returns an instanced link of the module regardless if the new keyword is used.
		var call_instance
		if ( !(this instanceof (call_instance = def) ) )
			return new (Array.prototype.slice.call(arguments).reduce(function(accumulator, value) {
				return accumulator = accumulator.bind(accumulator.prototype, value)
			}, call_instance))()

		// The simplest way to determine if the argument is of the bracket_print type.
		if ( up && up.parent && (up instanceof up.parent) ) 
			this.up = up = up.spawn(up.log_title+" -> ") 
		else {
			if ( typeof up === "function" ) {
				err = cb 
				cb = up
			}
			this.up = up = print({title: true, title_stamp: false})
		}
		up.log_title = up.log_title + "specification_parser"
		this.up_err = up.spawn({title: true, level: 2, title_stamp: false, title: up.log_title+" - ERROR:"})	

		cb = typeof cb === "function" && cb || function(){}
		err = typeof err === "function" && err || function(){}
	

		this.parser = {}
		this.option = {
			specificationPath: "specification/package_information.md"	
		}

		cb.call(this)

	}

	def.prototype = {
	
		hasKey: function(obj, cb) {

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - hasKey()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() { if ( typeof err === "function" ) err.apply(err.prototype, arguments) } 
			// ----------------------------------------------------------------------------------------------------

			var has_key = obj !== null && typeof obj === "object" && Boolean(Object.keys(obj).length)
			cb(has_key)
			return has_key 

		},
		generateContent: function(meta, cb, err) {

			// Set the chaining logging titles to also have this member name. -------------------------------------
			var up = this.up.spawn(this.up.log_title + " - acquireContent()")
			var up_err = this.up_err.spawn(up.log_title + " - ERROR")
			cb = typeof cb === "function" && cb || function(){}
			// Create the error callback which will transfer the logger from this method into the calling method error callback.
			var err_cb = function() { if ( typeof err === "function" ) err.apply(err.prototype, arguments) } 
			// ----------------------------------------------------------------------------------------------------
		
			up.log("Generating content from package.json file")
			var package = meta.package
			var title = (this.parser && this.parser.titleize || function(s) { return s })(package.name)
			var content = print({style: false, level: 0, log_level: "", title: false, title_stamp: false}).l()

			content.l("#").s(title).l("### Package Specifications", "", "----", "", "### Document Pages", "----")

			if ( package.version )
				content.l("", "**Version**:").s(package.version)

			if ( package.description )
				content.l("", "**Description**:").s(package.description)

			if ( this.hasKey(package.author) )
				if ( typeof package.author === "object" ) {
					if ( "name" in package.author && "email" in package.author )
						content.l("", "**Author**:").a(" [", package.author.name, "](mailto:", package.author.email, ")")
					else if ( "name" in package.author )
						content.l("", "**Author**:").s(package.author.name)
					if ( "url" in package.author )
						content.a("[", package.author.url, "](", package.author.url, ")")
				}
				else {
					up_err.log("Parsing string people fields is not supported yet")
					content.l("", "**Author**:").s(package.author)
				}

			if ( this.hasKey(package.license) )
				content.l("", "**License**:").s(package.license)

			if ( this.hasKey(package.dependencies) ) {
				content.l("", "**Dependencies**:")
				for ( var dependency in package.dependencies ) 
					content.a(" [", dependency, "](https://npmjs.org/package/", dependency, ")")
			}

			if ( this.hasKey(package.devDependencies) ) {
				content.l("", "**Development dependencies**:")
				for ( var dependency in package.devDependencies ) 
					content.a(" [", dependency, "](https://npmjs.org/package/", dependency, ")")
			}

			if ( this.hasKey(package.optionalDependencies) ) {
				content.l("", "**Optional Dependencies**:")
				for ( var dependency in package.optionalDependencies ) 
					content.a(" [", dependency, "](https://npmjs.org/package/", dependency, ")")
			}

			if ( this.hasKey(package.bundleDependencies) ) {
				content.l("", "**Bundle Dependencies**:")
				for ( var dependency in package.bundleDependencies ) 
					content.a(" [", dependency, "](https://npmjs.org/package/", dependency, ")")
			}
			if ( this.hasKey(package.scripts) ) {
				content.l("", "**Package scripts**:", "")
				.l("| Name | Action |")
				.l("| ---- | ------ |")
				for ( var script in package.scripts ) 
					content.l("").s("|", script, "|", "```"+ package.scripts[script] + "```", "|")
			}

			if ( this.hasKey(package.keywords) && package.keywords.length )
				content.l("", "**Keywords**:").s("*"+package.keywords.join("*, *")+"*")

			if ( this.hasKey(package.technologies) )
				if ( package.technologies.constructor != Array )
					up_err.log("The package data has an incorrect technologies entry") 
				else {
					if ( package.technologies.length )
						content.l("", "**Technologies used in development**:")
					package.technologies.forEach(function(item) {
						if ( typeof item === "object" ) {
							if ( ! ("name" in item) )
								up_err.log("The name field is required when contentifing individual technologies:", item)
							else {
								if ( "url" in item )
									content.l("  * ").a("[", item.name, "](", item.url, ")").s(item.description||"")
								else 
									content.l("  * ").s(item.name, item.description||"")
							}
						}
						else {
							up_err.log("Parsing string technologies entries is not supported yet")
							content.l("").s("  *", item)
						}
					})
				}

			cb(content.toString())

		},

	}

	return def

})
