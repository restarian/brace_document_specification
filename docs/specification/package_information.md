# Brace Document Specification
### Package Specifications
 
----
### Brace Document Specification help pages
* [Synopsis](https://github.com/restarian/batten_document_specification/blob/master/docs/synopsis.md)
* Specification
  * [License information](https://github.com/restarian/batten_document_specification/blob/master/docs/specification/license_information.md)
  * **Package information**
  * **Package information**
  * [Unit test output](https://github.com/restarian/batten_document_specification/blob/master/docs/specification/unit_test_output.md)
----
 
**Version**: 1.0.0

**Description**: A plugin for Brace Document which generates data from the project source code and package.json file.

**Author**: [Robert Steckroth](mailto:RobertSteckroth@gmail.com)

**Dependencies**: [amdefine](https://npmjs.org/package/amdefine) [bracket_print](https://npmjs.org/package/bracket_print)

**Development dependencies**: [mocha](https://npmjs.org/package/mocha) [chai](https://npmjs.org/package/chai) [brace_maybe](https://npmjs.org/package/brace_maybe) [bracket_utils](https://npmjs.org/package/bracket_utils) [requirejs](https://npmjs.org/package/requirejs)

**Package scripts**:

| Name | Action |
| ---- | ------ |
 | test | ```mocha``` |
 | make_docs | ```brace_document -i docs_raw -b docs --navlink -r --specification --link --link-dest README.md --link-path docs/synopsis.md --force-title --title "Brace Document Specification help pages" --sort depth``` |
 | make_docs_extra | ```npm run make_docs -- --mocha``` |

**Technologies used in development**:
  * [VIM](https://www.vim.org) As the primary IDE
  * [Windows 10](https://www.microsoft.com/en-us/software-download/windows10) As the development operating environment
  * [Ubuntu on Windows](https://www.microsoft.com/en-us/store/p/ubuntu/9nblggh4msv6) For unit testing
  * [Git](https://git-scm.com) For repository management
  * [Github](https://github.com) For repository storage
  * [NPM](https://npmjs.org) For module storage
  * [Blender](https://blender.org) For logo design and art rendering