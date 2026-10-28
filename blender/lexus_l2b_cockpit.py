"""L2B-R1 cockpit surfaces, traced to dealer photos 29/33/35.

All coordinates are provisional metres. No F SPORT trim or downloaded geometry.
Functions use the existing build entrypoint's mesh/material/export machinery.
"""
import math
import lexus_l2b_constants as C
from cockpit_surfaces import closed_loft, smooth_outline


def build_cockpit(stage, mesh, box, tube, leather, accent, black):
    def plate(name, controls, transform, mat, back=-.012, front=.008, steps=3, crown=False):
        outline = smooth_outline(controls, steps)
        bevel=min(.003,(front-back)*.24)
        levels = [(back, .94), (back+bevel, 1), (front-bevel, 1), (front, .96)]
        if crown: levels += [(front+.006, .65), (front+.008, .20)]
        cu=sum(u for u,v in outline)/len(outline);cv=sum(v for u,v in outline)/len(outline)
        sections = [[transform(cu+(u-cu)*s, cv+(v-cv)*s, d) for u, v in outline] for d, s in levels]
        obj = mesh(name, *closed_loft(sections), mat)
        # Planar end caps must not inherit sidewall smoothing.
        obj.data.polygons[-1].use_smooth = False
        obj.data.polygons[-2].use_smooth = False
        return obj

    def rounded(w, h, radius=.012):
        # Sample actual corner arcs; sparse splines can overshoot thin bezels.
        r=min(radius,w*.3,h*.3)
        points=[]
        for cx,cy,angle in [(w/2-r,h/2-r,0),(-w/2+r,h/2-r,90),
                            (-w/2+r,-h/2+r,180),(w/2-r,-h/2+r,270)]:
            for i in range(4):
                a=math.radians(angle+i*30)
                points.append((cx+r*math.cos(a),cy+r*math.sin(a)))
        return points

    def panel(name, centre, controls, mat, back=-.012, front=.008, steps=3, lean=0):
        x,y,z=centre
        return plate(name,controls,lambda u,v,d:(x+u,y+d-math.sin(lean)*v,z+math.cos(lean)*v),
                     mat,back,front,steps)

    if stage == 'dashboard':
        # Cross sections wrap continuously over the brow and front fascia.
        sections=[]
        for x in C.DASH_X_SECTIONS:
            edge=abs(x)/C.DASH_HALF_WIDTH
            crown=.022*math.exp(-((x+.37)/.24)**2)
            sweep=-.035*edge**2
            zoff=-.023*edge**4
            yz=[(-.96,.902),(-.91,.925),(-.76,.942+crown),(-.63,.930+crown),
                (-.562+sweep,.906),(-.535+sweep,.876),(-.538+sweep,.838),
                (-.558+sweep,.788),(-.606+sweep,.744),(-.71,.741),(-.89,.775),(-.955,.827)]
            outline=smooth_outline(yz,2)
            # Taper at the visible ends; closed end cap, no paper-thin slab.
            end_scale=.94 if edge>.99 else 1
            sections.append([(x,-.74+(y+.74)*end_scale,.84+(z-.84)*end_scale+zoff) for y,z in outline])
        deck=mesh('Continuous upper dash and rolled fascia',*closed_loft(sections),leather)
        deck.data.polygons[-1].use_smooth=False;deck.data.polygons[-2].use_smooth=False

        # Low trapezoidal hood rather than a half cylinder. Deep shrouded gauges.
        cowl=[(-.232,-.062),(.232,-.062),(.238,-.016),(.203,.072),(.125,.109),
              (0,.120),(-.142,.107),(-.222,.060)]
        outline=smooth_outline(cowl,4)
        rings=[]
        for y,s,z in [(-.815,.77,.911),(-.75,.93,.932),(-.615,1,.942),(-.547,1,.936)]:
            rings.append([(-.38+u*s,y,.0+z+v*s) for u,v in outline])
        hood=mesh('Tapered instrument cowl',*closed_loft(rings),leather)
        hood.data.polygons[-1].use_smooth=False
        panel('Recessed instrument enclosure',(-.38,-.536,.938),[(u*.91,v*.88)for u,v in cowl],black,back=-.018,front=.001,steps=4)
        lip=[(-.38+u,-.543,.936+v) for u,v in outline]
        tube('Cowl rolled lip',lip,.0045,leather,6,True)
        for x in (-.479,-.282):
            # Twin dials retain the non-F-SPORT reference layout.
            tube('Instrument satin ring',[(x+.062*math.cos(a*math.tau/40),-.524,.939+.062*math.sin(a*math.tau/40))for a in range(40)],.0017,accent,5,True)
            for i in range(9):
                a=math.radians(35+i*32)
                tube('Instrument graduations',[(x+.052*math.cos(a),-.521,.939+.052*math.sin(a)),(x+.057*math.cos(a),-.521,.939+.057*math.sin(a))],.00065,accent,3)
            tube('Instrument needle',[(x,-.518,.939),(x-.034,-.518,.906)],.0008,accent,4)

        # Shallow organically rounded tray, thin housing with gently rounded corners.
        tray=rounded(.426,.185,.035)
        plate('Display recessed tray',tray,lambda u,v,d:(C.DISPLAY_CENTER[0]+u,-.767+v,.934+d),leather,-.008,.003,3)
        panel('Display curved housing',C.DISPLAY_CENTER,rounded(.365,.143,.018),black,-.018,.013,4,math.radians(7))
        panel('Inactive display glass',(.08,-.759,1.017),rounded(.329,.112,.009),black,-.001,.003,3,math.radians(7))

        # Centre frame has a rising driver edge and a softened passenger return.
        surround=[(-.249,-.074),(.241,-.074),(.251,-.047),(.246,.060),(.228,.078),
                  (-.204,.082),(-.252,.103),(-.266,.065)]
        panel('Centre satin perimeter',(.08,-.521,.819),surround,accent,-.016,.008,3)
        panel('Centre recessed vent field',(.08,-.510,.819),[(u*.963,v*.88)for u,v in surround],black,-.014,.002,3)
        # Separate openings and clock bridge communicate the real assembly.
        for x in (-.067,.224):
            panel('Recessed vent opening',(x,-.505,.825),rounded(.193,.103,.016),black,-.005,.003,2)
            for i in range(4):
                box('Vent louvre',(x,-.497,.790+i*.022),(.181,.019,.0034),black,.001)
            box('Vent slider',(x,-.484,.823),(.026,.006,.004),accent,.001)
        panel('Clock bridge',(.08,-.499,.824),rounded(.074,.110,.008),black,-.010,.004,2)
        tube('Clock outer bezel',[(.08+.0285*math.cos(a*math.tau/40),-.486,.824+.0285*math.sin(a*math.tau/40))for a in range(40)],.0026,accent,6,True)
        for i in range(12):
            a=i*math.tau/12
            tube('Clock tick',[(.08+.021*math.cos(a),-.482,.824+.021*math.sin(a)),(.08+.025*math.cos(a),-.482,.824+.025*math.sin(a))],.00065,accent,3)
        tube('Clock hands',[(.065,-.479,.834),(.08,-.479,.824),(.087,-.479,.806)],.0009,accent,4)

        # Continuous accent rail and recessed passenger vent under the rolled brow.
        rail=[(-.18,-.522,.913),(-.125,-.515,.903),(.02,-.515,.901),(.24,-.522,.899),
              (.32,-.530,.882),(.38,-.536,.846),(.48,-.544,.845),(.63,-.550,.858),(.716,-.564,.878)]
        # Open interpolated rail: a thin closed ribbon avoids concave cap intersections.
        path=[]
        for i in range(len(rail)-1):
            p0,p1,p2,p3=rail[max(0,i-1)],rail[i],rail[i+1],rail[min(len(rail)-1,i+2)]
            for j in range(3):
                t=j/3
                path.append(tuple(.5*(2*p1[k]+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t*t+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t*t*t)for k in range(3)))
        path.append(rail[-1])
        mesh('Continuous satin ribbon',*closed_loft([[(x,y-.002,z-.006),(x,y+.002,z-.006),(x,y+.002,z+.006),(x,y-.002,z+.006)]for x,y,z in path]),accent)
        opening=[(-.108,-.025),(.103,-.025),(.114,-.008),(.107,.031),(.084,.037),(-.111,.023)]
        panel('Passenger vent satin outline',(.602,-.560,.817),opening,accent,-.010,.004,3)
        panel('Passenger recessed vent',(.602,-.552,.817),[(u*.94,v*.80)for u,v in opening],black,-.007,.003,3)
        for i in range(3):box('Passenger vane',(.602,-.543,.800+i*.015),(.194,.015,.0028),black,.0008)
        # Visible fascia separation; below this bounded edge, the console is excluded.
        tube('Passenger fascia break',[(.35,-.550,.779),(.48,-.564,.770),(.64,-.578,.780),(.73,-.595,.800)],.002,black,5)

    elif stage == 'wheel':
        tilt=math.radians(C.WHEEL_TILT_DEGREES)
        def W(u,v,d=0):
            x,y,z=C.WHEEL_CENTER
            return (x+u,y-math.sin(tilt)*v+math.cos(tilt)*d,z+math.cos(tilt)*v+math.sin(tilt)*d)
        vertices=[];faces=[];rings=112;sides=12
        for i in range(rings):
            a=i*math.tau/rings
            u=C.WHEEL_RADIUS*math.cos(a);v=C.WHEEL_RADIUS*1.035*math.sin(a)
            thick=C.WHEEL_TUBE+.0035*math.exp(-((abs(u)-.148)/.027)**2-((v-.073)/.037)**2)
            for j in range(sides):
                b=j*math.tau/sides
                vertices.append(W(u+thick*math.cos(b)*math.cos(a),v+thick*math.cos(b)*math.sin(a),thick*.96*math.sin(b)))
        for i in range(rings):
            for j in range(sides):faces.append((i*sides+j,((i+1)%rings)*sides+j,((i+1)%rings)*sides+(j+1)%sides,i*sides+(j+1)%sides))
        mesh('Round non-F-SPORT leather rim',vertices,faces,leather)
        # Swept wings start behind the shield and broaden into the rim.
        spoke=[(.054,-.065),(.153,-.051),(.164,-.011),(.153,.026),(.116,.040),(.064,.026)]
        pod=[(.075,-.037),(.144,-.028),(.148,-.006),(.135,.016),(.103,.019),(.075,.005)]
        for side in (-1,1):
            transform=lambda u,v,d,side=side:W(side*u,v,d)
            plate('Swept spoke wing',spoke,transform,leather,-.020,.015,3)
            plate('Curved satin control surround',[(.112+(u-.112)*1.14,-.010+(v+.010)*1.20)for u,v in pod],transform,accent,.016,.022,3)
            plate('Tapered control island',pod,transform,black,.024,.030,3)
            # Small separated switch faces; no arbitrary rectangular crossbars.
            for u,v in [(.092,-.015),(.119,-.010),(.135,-.008)]:
                control=[(u-.009,v-.009),(u+.008,v-.008),(u+.008,v+.009),(u-.009,v+.010)]
                plate('Individual switch',control,transform,black,.030,.033,1)
            # Legible directional chevrons; remaining exact legends are unmodeled.
            for v,sign in [(-.001,1),(-.020,-1)]:
                tube('Control chevron',[W(side*.113,v,.036),W(side*.117,v+sign*.003,.036),W(side*.121,v,.036)],.00055,accent,3)
            tube('Outer switch mark',[W(side*.135,-.010,.036),W(side*.140,-.010,.036)],.0005,accent,3)
        lower=[(-.061,-.060),(-.034,-.159),(0,-.171),(.034,-.159),(.061,-.060),(0,-.082)]
        plate('Flared lower spoke',lower,W,leather,-.024,.008,3)
        lower_trim=[(-.044,-.079),(-.031,-.150),(0,-.160),(.031,-.150),(.044,-.079),(0,-.096)]
        plate('Flared lower satin insert',lower_trim,W,accent,.010,.014,3)
        hub=[(-.078,.040),(-.087,.003),(-.069,-.065),(-.038,-.091),(0,-.100),
             (.038,-.091),(.069,-.065),(.087,.003),(.078,.040),(0,.056)]
        plate('Tapered crowned airbag shield',hub,W,leather,-.018,.041,3,True)
        # Oval badge and shaped L; source photo shows a broad, raised metallic glyph.
        tube('Lexus oval emblem',[W(.031*math.cos(i*math.tau/48),.024*math.sin(i*math.tau/48)-.007,.051)for i in range(48)],.0017,accent,6,True)
        emblem=[(-.006,.013),(.002,.016),(.008,-.020),(-.019,-.020),(-.022,-.015),(.000,-.014)]
        plate('Raised Lexus L',emblem,W,accent,.052,.054,1)
    else:
        raise ValueError('Cockpit stage must be dashboard or wheel')
