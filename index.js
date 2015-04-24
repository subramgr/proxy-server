let http = require('http')
let request = require('request')
let argv = require('yargs')
    .default('host', '127.0.0.1')
    .argv
let scheme = 'http://'
let port = argv.port || argv.host === '127.0.0.1' ? 8000 : 80
let destinationUrl = argv.url || scheme + argv.host + ':' + port


http.createServer((req, res) => {
  	console.log(`Proxying request to: ${destinationUrl + req.url}`)
  	let url = destinationUrl
  	let options = {
    	headers: req.headers,
    	url: url + req.url
	}
	let destinationResponse = req.pipe(request(options))
	process.stdout.write(JSON.stringify(destinationResponse.headers))
	destinationResponse.pipe(res)
}).listen(8001)

http.createServer((req, res) => {
    console.log(`Request received at: ${req.url}`)
    for (let header in req.headers) {
    	res.setHeader(header, req.headers[header])
	}
	req.pipe(process.stdout)
    req.pipe(res)
}).listen(8000)
