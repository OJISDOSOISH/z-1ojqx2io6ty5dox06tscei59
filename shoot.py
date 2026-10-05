"""Banc de rendu : python3 shoot.py [dossier_sortie]
Prerequis : npm i  (installe three)  puis  pip install playwright && playwright install chromium
Sortie : une image par vue et par eclairage (dur / couvert) + stats.txt (triangles, materiaux).
Variable CHROME_PATH pour forcer un navigateur precis. Rendu logiciel (swiftshader) : lent mais fiable."""
import base64, functools, http.server, os, socketserver, sys, threading
from playwright.sync_api import sync_playwright

OUT = sys.argv[1] if len(sys.argv) > 1 else 'images/rendus'
os.makedirs(OUT, exist_ok=True)
VUES = {  # nom: (azimut, elevation, distance rel., decalage vertical)
    'avant_3q': (25, 12, 0.9, 0), 'profil': (90, 8, 0.9, 0), 'arriere': (200, 15, 0.9, 0),
    'dessus': (20, 55, 0.9, 0), 'visage': (15, 8, 0.38, 0.35), 'gauche': (-90, 8, 0.9, 0),
}
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory='.')
H.log_message = lambda *a, **k: None
srv = socketserver.TCPServer(('127.0.0.1', 0), H)
port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
opts = dict(args=['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
if os.environ.get('CHROME_PATH'):
    opts['executable_path'] = os.environ['CHROME_PATH']
with sync_playwright() as p:
    b = p.chromium.launch(**opts)
    pg = b.new_page(viewport={'width': 1400, 'height': 900})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:200]))
    pg.goto(f'http://127.0.0.1:{port}/rendu.html')
    pg.wait_for_function('window.READY===true', timeout=120000)
    errs += pg.evaluate('window.ERRS')
    st = pg.evaluate('window.STATS()')
    open(f'{OUT}/stats.txt', 'w').write(f"{st}\nerreurs JS: {errs}\n")
    print(st, 'erreurs:', errs)
    for light in ('dur', 'couvert'):
        pg.evaluate(f"window.SETLIGHT('{light}')")
        for n, (az, el, d, ty) in VUES.items():
            u = pg.evaluate(f'window.SHOOT({az},{el},{d},{ty})')
            open(f'{OUT}/{n}_{light}.png', 'wb').write(base64.b64decode(u.split(',')[1]))
    b.close()
print('ok ->', OUT)
