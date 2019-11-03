module.exports = [
	{ 
		"usage": 
`  Creates a document page from a package.json file. The file is located from the project root directory. The --package 
option will need If the project root does not contain a package.json file. Otherwise this plugin will return with an
error.
`
	},
	{
		"flag": "-c, --package <dir>", 
		"help": "The location of a package.json file to use. This does not need to be set unless the package.json file is outside the project root."
	},
	{
		"flag": "--specification-path <path>", 
		"help": "The location and file name of the specification file. The directory will on be created if nessesary and is relative to the docs directory.",
		"default": "specification/package_information.md"
	},
]

