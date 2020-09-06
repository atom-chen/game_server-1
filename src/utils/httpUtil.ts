import * as https from 'https';
import * as http from "http";
import querystring from 'querystring';
import * as util from 'util';
import Log from './Log';

class HttpUtil {

	public static post(host:string, port:string, path:string, data:any, callback:Function) {
		let content = querystring.stringify(data);
		let options = {
			hostname: host,
			port: port,
			path: path + '?' + content,
			method: 'GET'
		};
		let req = http.request(options, function (res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				callback(chunk);
			});
		});

		req.on('error', function (e) {
			Log.error('problem with request: ' + e.message);
		});
		req.end(); 
	}

	public static get(host:string, port:string, path:string, data:any, callback:Function, safe?:boolean) {
		let content = querystring.stringify(data);
		let options = {
			hostname: host,
			path: path + '?' + content,
			method: 'GET',
			port: port,
		};
		safe = util.isNullOrUndefined(safe) ? false : true;
		let proto:any = http;
		if (safe) {
			proto = https;
		}
		let req = proto.request(options, function (res:any) {
			res.setEncoding('utf8');
			res.on('data', function (chunk:any) {
				try {
					let json = JSON.parse(chunk);
					callback(true, json);
				} catch (error) {
					Log.error(error);
				}
			});
		});

		req.on('error', function (e:any) {
			Log.error('problem with request: ' + e.message);
			callback(false, e);
		});
		req.end();
	};

	public static get2(url:string, data:any, callback:Function, safe?:boolean) {
		let content = querystring.stringify(data);
		url = url + '?' + content;
		let proto:any = http;
		safe = util.isNullOrUndefined(safe) ? false : true;
		if (safe) {
			proto = https;
		}
		let req = proto.get(url, function (res:any) {
			res.setEncoding('utf8');
			res.on('data', function (chunk:any) {
				try {
					let json = JSON.parse(chunk);
					callback(true, json);
				} catch (error) {
					Log.error(error);
				}
			});
		});

		req.on('error', function (e:any) {
			Log.error('problem with request: ' + e.message);
			callback(false, e);
		});
		req.end();
	};

}

export default HttpUtil;