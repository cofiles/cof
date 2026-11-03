"""Validate catalog counts, URL uniqueness, translations and local assets. No network needed."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,collections
ROOT=Path(__file__).parent
errors=[]
translations=json.loads((ROOT/'assets/translations.js').read_text().split('=',1)[1].strip().removesuffix(';'))
class Page(HTMLParser):
 def __init__(self,path):
  super().__init__(convert_charrefs=True);self.path=path;self.stack=[];self.ids=set();self.links=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag not in ['meta','link','input','img','br','hr','source','wbr']:self.stack.append(tag)
  if 'id' in a:
   if a['id'] in self.ids:errors.append(f'{self.path.name}: duplicate id {a["id"]}')
   self.ids.add(a['id'])
  for attr in ('src','href'):
   if attr not in a:continue
   url=urlsplit(a[attr])
   if not url.scheme and not url.netloc and url.path:
    local=(self.path.parent/unquote(url.path)).resolve()
    if not local.is_file():errors.append(f'{self.path.name}: missing {a[attr]}')
  for attr in ('title','placeholder','aria-label','content'):
   if attr in a:self.check_text(a[attr])
 def handle_endtag(self,tag):
  if tag in self.stack:self.stack=self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
 def handle_data(self,data):
  if any(t in self.stack for t in ['script','style','code','pre']):return
  self.check_text(data)
 def check_text(self,text):
  text=text.strip()
  if text=='Русский':return
  if re.search('[А-Яа-яЁё]',text) and text not in translations:errors.append(f'{self.path.name}: missing translation: {text[:90]}')
for path in ROOT.rglob('*.html'):Page(path).feed(path.read_text())
audit=json.loads((ROOT/'catalog-audit.json').read_text())
assert len(audit)==109,len(audit)
url_count=collections.Counter();placements=0
for page in ['tools','python','languages','repos','windows']:
 raw=(ROOT/'assets'/f'catalog-{page}.js').read_text()
 groups=json.loads(raw.split('=',1)[1].strip().removesuffix(';'))
 blocks=re.findall(r'<section class="group">(.*?)</section>',(ROOT/(page+'.html')).read_text(),re.S)
 if len(groups)!=len(blocks):errors.append(f'{page}: group mismatch')
 for index,(g,block) in enumerate(zip(groups,blocks)):
  urls=re.findall(r'href="([^"]+)"',block)+[e['url'] for e in g['entries']]
  normalized=[u.lower().rstrip('/') for u in urls]
  if len(normalized)!=len(set(normalized)):errors.append(f'{page}/{index}: duplicate URL')
  if len(urls)<1001 or len(g['entries'])<601:errors.append(f'{page}/{index}: target not met')
  if not g['expanded_en'] or not g['expanded_ru']:errors.append(f'{page}/{index}: missing bilingual scope')
  for e in g['entries']:
   if not e['url'].startswith(('https://github.com/','https://pypi.org/','https://learn.microsoft.com/')):errors.append(f'{page}/{index}: invalid URL {e["url"]}')
   if not e['name'] or e['source'] not in ('github','pypi','microsoft'):errors.append(f'{page}/{index}: invalid record')
  url_count.update(set(normalized));placements+=len(urls)
if errors:
 print('\n'.join(errors));raise SystemExit(1)
print(json.dumps({'result':'PASS','groups':109,'placements':placements,'distinct_urls_sitewide':len(url_count),'minimum_added':min(r['added'] for r in audit),'translation_strings':len(translations),'html_pages':len(list(ROOT.rglob('*.html')))},indent=2))
