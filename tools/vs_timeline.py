# Baut die Stimmspur «4 Schichten» und timeline.json (30 fps).
# Satzweise: Anfangs-/Endstille weg, lange Pausen im Satz kürzen, 0,22 s zwischen Sätzen, Tempo 1,05, 2 s Halt am Schluss.
import numpy as np, subprocess, json, sys
D = 'assets/reels/vier-schichten/stimme'
SR = 48000; TEMPO = 1.05; PAUSE = 0.22; HALT = 1.6
MAXLUECKE = {6: 0.45}  # Satz 6: Spannungspause behalten
def lade(f):
    raw = subprocess.run(['ffmpeg','-v','error','-i',f,'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True).stdout
    return np.frombuffer(raw, np.float32).copy()
def gruppen(a):
    w = SR//100; n = len(a)//w
    db = 20*np.log10(np.sqrt((a[:n*w].reshape(n,w)**2).mean(1))+1e-7)
    on = np.where(db > -40)[0]; segs=[]; cur=[on[0],on[0]]
    for k in on[1:]:
        if k-cur[1] > 8: segs.append(cur); cur=[k,k]
        else: cur[1]=k
    segs.append(cur)
    return [(a0*w, (b0+1)*w) for a0,b0 in segs]
spur = []; t = 0.0; tl = {'fps':30,'saetze':[]}
for i in range(1,11):
    a = lade(f'{D}/satz-{i:02d}.wav'); g = gruppen(a); maxl = MAXLUECKE.get(i, 0.25)
    teile=[]; on=[]; pos=0.0
    pad = int(0.03*SR)
    for j,(s,e) in enumerate(g):
        s2=max(0,s-pad); e2=min(len(a),e+pad)
        if j>0:
            luecke = (s2 - prev_e)/SR
            if luecke>maxl: luecke=maxl
            if luecke>0: teile.append(np.zeros(int(luecke*SR),np.float32)); pos+=luecke
        on.append(pos+(s-s2)/SR)
        teile.append(a[s2:e2]); pos+=(e2-s2)/SR; prev_e=e2
    seg = np.concatenate(teile)
    tl['saetze'].append({'nr':i,'start':t,'dauer':len(seg)/SR,'gruppen':[t+o for o in on]})
    spur.append(seg); t += len(seg)/SR
    if i<10: spur.append(np.zeros(int(PAUSE*SR),np.float32)); t+=PAUSE
roh = np.concatenate(spur)
subprocess.run(['ffmpeg','-v','error','-y','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af',f'atempo={TEMPO}','-ar',str(SR),f'{D}/stimme-gesamt.wav'],input=roh.tobytes())
F = lambda x: round(x/TEMPO*30)
out={'fps':30,'tempo':TEMPO,'saetze':[]}
for s in tl['saetze']:
    out['saetze'].append({'nr':s['nr'],'start':F(s['start']),'ende':F(s['start']+s['dauer']),'gruppen':[F(x) for x in s['gruppen']]})
gesamt = F(t)+round(HALT*30)
out['dauer']=gesamt
json.dump(out, open('src/reels/vierSchichten/timeline.json','w'), indent=1)
for s in out['saetze']: print(s)
print('Dauer', gesamt, 'Frames =', gesamt/30, 's')
