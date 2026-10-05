import base64,json,threading,http.server,socketserver,functools
from playwright.sync_api import sync_playwright
H=functools.partial(http.server.SimpleHTTPRequestHandler,directory='.')
H.log_message=lambda *a,**k:None
s=socketserver.TCPServer(('127.0.0.1',8777),H);threading.Thread(target=s.serve_forever,daemon=True).start()
with sync_playwright() as p:
    b=p.chromium.launch(args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
    pg=b.new_page(viewport={'width':1400,'height':900})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]));pg.on('console',lambda m:errs.append('C:'+m.text[:200]) if m.type=='error' else None)
    pg.goto('http://127.0.0.1:8777/rendu.html')
    pg.wait_for_function('window.READY===true',timeout=90000)
    print(pg.evaluate('window.ERRS'),errs[:8],pg.evaluate('window.BOX'))
    for n,(az,el,dist,ty) in {'face':(25,12,0.9,0),'profil':(90,8,0.9,0),'arriere':(200,15,0.9,0),'tete':(15,8,0.38,0.35)}.items():
        u=pg.evaluate(f'window.SHOOT({az},{el},{dist},{ty})')
        open(f'./images/{n}.png','wb').write(base64.b64decode(u.split(',')[1]))
    b.close()
