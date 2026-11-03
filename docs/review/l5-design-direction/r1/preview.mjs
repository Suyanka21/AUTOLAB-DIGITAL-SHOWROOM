// Read-only localhost server for the review directory; no production routes.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,relative,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webm':'video/webm','.md':'text/plain; charset=utf-8','.json':'application/json'};
const server=createServer(async(req,res)=>{
 try{
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);res.end();return;}
  const requested=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const path=resolve(root,`.${requested==='/'?'/r1/index.html':requested}`),rel=relative(root,path);
  if(rel.startsWith('..')||rel.includes(':')||!mime[extname(path)]){res.writeHead(404);res.end('Not found');return;}
  const bytes=await readFile(path);res.writeHead(200,{'Content-Type':mime[extname(path)],'Content-Length':bytes.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.on('error',e=>{console.error(e.message);process.exitCode=1;});
server.listen(3105,'127.0.0.1',()=>console.log('Review only: http://127.0.0.1:3105/r1/index.html'));
