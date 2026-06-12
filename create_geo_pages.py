import os

CITIES = [
    {"city": "Pune",       "slug": "whatsapp-api-pune",       "region": "Maharashtra", "geo": "18.5204;73.8567", "rc": "MH"},
    {"city": "Bangalore",  "slug": "whatsapp-api-bangalore",  "region": "Karnataka",   "geo": "12.9716;77.5946", "rc": "KA"},
    {"city": "Mumbai",     "slug": "whatsapp-api-mumbai",     "region": "Maharashtra", "geo": "19.0760;72.8777", "rc": "MH"},
    {"city": "Delhi",      "slug": "whatsapp-api-delhi",      "region": "Delhi",       "geo": "28.6139;77.2090", "rc": "DL"},
    {"city": "Hyderabad",  "slug": "whatsapp-api-hyderabad",  "region": "Telangana",   "geo": "17.3850;78.4867", "rc": "TG"},
    {"city": "Chennai",    "slug": "whatsapp-api-chennai",    "region": "Tamil Nadu",  "geo": "13.0827;80.2707", "rc": "TN"},
]

FEATURES = [
    ("⚡", "Instant Activation",  "WhatsApp API goes live in under 5 minutes. No paperwork, no approval wait."),
    ("🤖", "No-Code Bot Builder", "Visual drag-and-drop flow builder. Build any conversation without writing code."),
    ("📢", "Broadcast Campaigns", "Send bulk WhatsApp messages to your entire contact list with one click."),
    ("💬", "Keyword Auto-Reply",  "Auto-reply when customers message specific keywords like 'hi', 'price', 'order'."),
    ("👥", "Built-in CRM",        "Every contact is saved, tagged, and searchable automatically."),
    ("🆓", "Free Forever Plan",   "Start free — no credit card needed. Pay only per broadcast message sent."),
]

pages_dir = '/var/www/yash/wpleads/wpld/src/pages'
created = []

for c in CITIES:
    city    = c["city"]
    slug    = c["slug"]
    region  = c["region"]
    rc      = c["rc"]
    lat, lon = c["geo"].split(";")
    icbm    = f"{lat}, {lon}"
    geo     = c["geo"]
    varname = city.replace(" ", "_")
    desc    = f"Get free WhatsApp Business API in {city}. WPLeads is an official Meta partner — build WhatsApp bots, automate replies, and grow leads without code. Live in 5 minutes."

    feature_cards = "\n".join(f"""            <div style={{{{background:"#fff",border:"1px solid rgba(0,0,0,0.08)",borderRadius:24,padding:"28px",display:"flex",flexDirection:"column",gap:12}}}}>
              <div style={{{{fontSize:28}}}}>{f[0]}</div>
              <h3 style={{{{fontSize:17,fontWeight:800,color:"#0a0a0a",margin:0}}}}>{f[1]}</h3>
              <p style={{{{fontSize:14,color:"rgba(0,0,0,0.55)",lineHeight:1.6,margin:0}}}}>{f[2]}</p>
            </div>""" for f in FEATURES)

    schema = '{"@context":"https://schema.org","@type":"Service","name":"WhatsApp API in ' + city + ' — WPLeads","description":"' + desc + '","provider":{"@type":"Organization","name":"WPLeads","url":"https://wpleads.in"},"serviceType":"WhatsApp Business API","areaServed":[{"@type":"City","name":"' + city + '"},{"@type":"Country","name":"India"}],"offers":{"@type":"Offer","price":"0","priceCurrency":"INR"},"url":"https://wpleads.in/' + slug + '"}'

    code = f"""import {{ useEffect }} from "react";
import {{ Helmet }} from "react-helmet-async";
import {{ Link }} from "react-router-dom";

export default function Geo_{varname}() {{
  useEffect(() => {{ window.scrollTo(0, 0); }}, []);

  return (
    <>
      <Helmet>
        <title>WhatsApp API in {city} — Free Forever | WPLeads</title>
        <meta name="description" content="{desc}" />
        <link rel="canonical" href="https://wpleads.in/{slug}" />
        <meta property="og:title" content="WhatsApp API in {city} — Free Forever | WPLeads" />
        <meta property="og:description" content="{desc}" />
        <meta property="og:url" content="https://wpleads.in/{slug}" />
        <meta name="geo.region" content="IN-{rc}" />
        <meta name="geo.placename" content="{city}, {region}, India" />
        <meta name="geo.position" content="{geo}" />
        <meta name="ICBM" content="{icbm}" />
      </Helmet>

      <div style={{{{minHeight:"100vh", background:"#fff", fontFamily:"'DM Sans',sans-serif", paddingTop:100}}}}>

        <section style={{{{padding:"clamp(60px,8vw,100px) clamp(20px,5vw,60px)", background:"linear-gradient(160deg,#f0fdf8 0%,#e8f5fd 40%,#f8f0ff 100%)", textAlign:"center"}}}}>
          <div style={{{{maxWidth:820, margin:"0 auto"}}}}>
            <div style={{{{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(37,211,102,0.1)",border:"1px solid rgba(37,211,102,0.25)",borderRadius:100,padding:"6px 16px",fontSize:11,fontWeight:700,color:"#16a34a",letterSpacing:1.5,textTransform:"uppercase",marginBottom:24}}}}>
              📍 {city}, {region}
            </div>
            <h1 style={{{{fontSize:"clamp(34px,5vw,58px)",fontWeight:900,letterSpacing:"-0.04em",lineHeight:1.08,color:"#0a0a0a",marginBottom:20}}}}>
              WhatsApp API in {city}<br/>
              <span style={{{{color:"#25d366"}}}}>Free in 5 Minutes</span>
            </h1>
            <p style={{{{fontSize:17,color:"rgba(0,0,0,0.6)",lineHeight:1.7,maxWidth:560,margin:"0 auto 36px"}}}}>
              WPLeads is an official Meta partner — get your WhatsApp Business API in {city} activated instantly. No approval wait, no setup fee, no code needed.
            </p>
            <div style={{{{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}}}>
              <Link to="/register" style={{{{display:"inline-flex",alignItems:"center",gap:10,background:"#25d366",color:"#fff",textDecoration:"none",padding:"16px 36px",borderRadius:50,fontSize:15,fontWeight:800,boxShadow:"0 10px 24px rgba(37,211,102,0.35)"}}}}>
                Get Free API Access →
              </Link>
              <a href="https://wa.me/917499835687?text=Hi! I want WhatsApp API for my business in {city}." target="_blank" rel="noopener noreferrer"
                style={{{{display:"inline-flex",alignItems:"center",gap:10,background:"#fff",color:"#075E54",border:"2px solid #25d366",textDecoration:"none",padding:"16px 36px",borderRadius:50,fontSize:15,fontWeight:800}}}}>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <section style={{{{padding:"clamp(70px,7vw,100px) clamp(20px,5vw,60px)",maxWidth:1200,margin:"0 auto"}}}}>
          <h2 style={{{{textAlign:"center",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:900,letterSpacing:"-0.03em",marginBottom:16,color:"#0a0a0a"}}}}>
            WhatsApp Automation Features for {city} Businesses
          </h2>
          <p style={{{{textAlign:"center",fontSize:16,color:"rgba(0,0,0,0.5)",maxWidth:520,margin:"0 auto 56px",lineHeight:1.7}}}}>
            From Pune startups to Chennai enterprises — WPLeads powers WhatsApp automation across India.
          </p>
          <div style={{{{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24}}}}>
{feature_cards}
          </div>
        </section>

        <section style={{{{padding:"clamp(60px,6vw,90px) clamp(20px,5vw,60px)",background:"#f8fafc"}}}}>
          <div style={{{{maxWidth:900,margin:"0 auto",textAlign:"center"}}}}>
            <h2 style={{{{fontSize:"clamp(26px,3vw,40px)",fontWeight:900,letterSpacing:"-0.03em",color:"#0a0a0a",marginBottom:16}}}}>
              Why {city} Businesses Choose WPLeads
            </h2>
            <p style={{{{fontSize:16,color:"rgba(0,0,0,0.55)",lineHeight:1.7,maxWidth:600,margin:"0 auto 48px"}}}}>
              Trusted by e-commerce stores, restaurants, real estate agencies, coaching institutes, and service businesses across {city} to automate WhatsApp.
            </p>
            <div style={{{{display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center",marginBottom:48}}}}>
              {{["✅ Official Meta Partner","✅ Free Forever Plan","✅ Live in 5 Minutes","✅ No Credit Card","✅ No Approval Wait","✅ 24/7 Automation"].map(b=>(
                <div key={{b}} style={{{{background:"#fff",border:"1px solid rgba(37,211,102,0.25)",borderRadius:100,padding:"10px 20px",fontSize:13,fontWeight:700,color:"#0a0a0a"}}}}>{{b}}</div>
              ))}}
            </div>
            <Link to="/register" style={{{{display:"inline-flex",alignItems:"center",gap:10,background:"#0f172a",color:"#fff",textDecoration:"none",padding:"16px 40px",borderRadius:50,fontSize:15,fontWeight:800,boxShadow:"0 12px 28px rgba(15,23,42,0.2)"}}}}>
              Start Free — No Card Needed →
            </Link>
          </div>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{{{__html: '{schema}'}}}} />

      </div>
    </>
  );
}}
"""
    path = os.path.join(pages_dir, f"Geo_{varname}.jsx")
    with open(path, "w") as fh:
        fh.write(code)
    created.append(slug)
    print(f"Created: Geo_{varname}.jsx")

print(f"\nTotal: {len(created)} geo pages created")
