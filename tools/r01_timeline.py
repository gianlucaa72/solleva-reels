"""Baut src/reels/r01-unsichtbar/timeline.json aus den Stimm-Dateien (Trim + Wortanfänge).
PAUSE = Halt nach jedem Satz (Nutzer: lieber etwas ruhiger), ENDE = Halt am Schluss."""
import json
PAUSE, ENDE = 0.40, 2.5
trim={1:(0.03,2.52),2:(0.1,2.31),3:(0.05,2.34),4:(0.08,1.44),5:(0.1,1.99),6:(0.04,1.48),7:(0.02,2.15),8:(0.09,2.47),9:(0.03,1.91)}
texte={1:"Deine Kunden suchen dich. Jeden Tag.",2:"Und finden: deine Konkurrenz.",3:"Du? Irgendwo auf Seite zwei.",4:"Da klickt niemand.",5:"Dabei machst du gute Arbeit.",6:"Nur sieht sie keiner.",7:"Solleva heisst: anheben.",8:"Genau das mache ich mit deiner Website.",9:"Sichtbar sein ist kein Zufall."}
schluessel={1:"suchen",2:"Konkurrenz",3:"zwei",4:"niemand",5:"gute",6:"keiner",7:"anheben",8:"Website",9:"Zufall"}
# Wortanfänge in Sekunden (Rohdatei), aus Energie-Hüllkurve geschätzt (±0,08 s)
roh={1:[("Deine",.03),("Kunden",.41),("suchen",.69),("dich",1.03),("Jeden",1.72),("Tag",2.17)],
2:[("Und",.10),("finden",.41),("deine",1.16),("Konkurrenz",1.55)],
3:[("Du",.05),("Irgendwo",.75),("auf",1.12),("Seite",1.54),("zwei",1.92)],
4:[("Da",.08),("klickt",.25),("niemand",.51)],
5:[("Dabei",.10),("machst",.38),("du",.69),("gute",1.00),("Arbeit",1.48)],
6:[("Nur",.04),("sieht",.64),("sie",.87),("keiner",1.06)],
7:[("Solleva",.02),("heisst",.84),("anheben",1.56)],
8:[("Genau",.09),("das",.48),("mache",.74),("ich",1.01),("mit",1.15),("deiner",1.51),("Website",1.82)],
9:[("Sichtbar",.03),("sein",.36),("ist",.55),("kein",.92),("Zufall",1.12)]}
t=0.0; out=[]
for i in range(1,10):
    a,b=trim[i]; d=b-a
    out.append({"satz":i,"text":texte[i],"schluessel":schluessel[i],"datei":f"r01/a/stimme/satz{i}.mp3","von":a,"bis":b,
                "start":round(t*30),"dauer":round(d*30),"woerter":[[wd,round((t+max(0,s-a))*30)] for wd,s in roh[i]]})
    t+=d+PAUSE
gesamt=round((t-PAUSE+ENDE)*30)
json.dump({"fps":30,"gesamt":gesamt,"saetze":out},open('src/reels/r01-unsichtbar/timeline.json','w'),indent=1,ensure_ascii=False)
print(gesamt, round(gesamt/30,2), [o["start"] for o in out])
