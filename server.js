const NodeMediaServer = require('node-media-server');
const Omx = require('node-omxplayer')

const config = {
	rtmp: {
  		port: 1935,
  		chunk_size: 60000,
  		gop_cache: true,
 		ping: 30,
  		ping_timeout: 60
  	},
 	http: {
		port: 8000,
        	allow_origin: '*'
  	}
}
const nms = new NodeMediaServer(config)
nms.run();

nms.on('postConnect', async (id, args) => {
	
 		console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
	
});

nms.on('postPublish', async (id, StreamPath, args) => {

	try {
		const exec = require('child_process').exec;
		const myShellScript = await exec('./ffmpeg_audio.sh');
		myShellScript.stdout.on('data', data => {
		console.log('Run Audio Command', data);
		}); 
		myShellScript.stderr.on('data', (err) => {
			console.log("Error Running Command: ", err);
		});
	} catch(err) {
		console.log("ERROR", err);
	}
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});
