# L'Antro — sito di recensioni di cinema

Sito statico in italiano (HTML5 + CSS + JS vanilla, **nessun build step**): apri `index.html` con doppio click.

```
Sito Cinema/
├─ index.html            Home: anteprima con gli ultimi 3 di ogni sezione
├─ recensioni.html       tutte le recensioni a schede, in ordine di caricamento
├─ archivio.html         tutte le recensioni a elenco, in ordine di uscita internazionale
├─ registi.html          tutti i registi
├─ autori.html           tutti gli autori (Chi siamo)
├─ gallery.html          tutti i fotogrammi, con lightbox
├─ movies/               una pagina per recensione, in ordine di pubblicazione
│  ├─ hokum.html         Hokum (Damian McCarthy, 2026)             — 7 ago 2026  ← ultima
│  ├─ the-vvitch.html    The VVitch (Robert Eggers, 2015)          — 5 ago 2026
│  ├─ it-follows.html    It Follows (David Robert Mitchell, 2014)  — 29 lug 2026
│  ├─ babadook.html      The Babadook (Jennifer Kent, 2014)        — 22 lug 2026
│  ├─ hereditary.html    Hereditary (Ari Aster, 2018)              — 15 lug 2026
│  ├─ midsommar.html     Midsommar (Ari Aster, 2019)               — 8 lug 2026
│  ├─ get-out.html       Scappa – Get Out (Jordan Peele, 2017)     — 1 lug 2026
│  ├─ noi.html           Noi (Jordan Peele, 2019)                  — 24 giu 2026
│  ├─ barbarian.html     Barbarian (Zach Cregger, 2022)            — 17 giu 2026
│  ├─ weapons.html       Weapons (Zach Cregger, 2025)              — 10 giu 2026
│  ├─ oddity.html        Oddity (Damian McCarthy, 2024)            — 27 mag 2026
│  ├─ obsession.html     Obsession (Curry Barker, 2026)            — 20 mag 2026
│  ├─ backrooms.html     Backrooms (Kane Parsons, 2026)            — 13 mag 2026
│  ├─ the-lighthouse.html The Lighthouse (Robert Eggers, 2019)     — 6 mag 2026
│  └─ nosferatu.html     Nosferatu (Robert Eggers, 2024)           — 29 apr 2026
├─ assets/
│  ├─ css/style.css      design system (variabili CSS) + responsive
│  └─ js/main.js         header, menu, ricerca, lightbox, barra di lettura
└─ README.md
```

## Struttura

La **home è un'anteprima**: ogni sezione mostra soltanto **gli ultimi tre caricamenti** e un bottone rosso verso la pagina con l'elenco completo. Le voci di menu puntano direttamente alle pagine complete. Tutto si apre nella stessa scheda del browser.

| Sezione in home | Mostra | Bottone | Pagina completa |
|---|---|---|---|
| Recensioni | le 3 più recenti | *Tutte le recensioni* | `recensioni.html` |
| Registi | i 3 più recenti | *Tutti i Registi* | `registi.html` |
| Chi siamo | le 3 firme più recenti | *Tutti gli Autori* | `autori.html` |
| Gallery | 3 fotogrammi | *Tutte le Immagini* | `gallery.html` |

- **Home** — l'ultima recensione a tutto schermo (titolo, autore, tempo di lettura, data, abstract) con la locandina ufficiale del film accanto e il bottone rosso *Leggi la recensione* verso l'articolo completo, poi le quattro anteprime.
- **Recensioni** (`recensioni.html`) — tutte e quindici a schede, stesso formato della home: immagine orizzontale, data, autore, titolo, estratto, tempo di lettura e regia. In **ordine di caricamento, dall'ultima pubblicata alla prima**.
- **Archivio** (`archivio.html`) — le stesse quindici a elenco: locandina originale a sinistra, titolo cliccabile a destra, con film, regista, firma e tempo di lettura. In **ordine di uscita internazionale, dalla più recente alla più vecchia**. La data mostrata è quella della prima uscita in sala nel paese di produzione (USA, tranne *Oddity* → Irlanda/Regno Unito e *The Babadook* → Australia), non quella italiana.
- **Registi** (`registi.html`) — nove: Damian McCarthy, Robert Eggers, David Robert Mitchell, Jennifer Kent, Ari Aster, Jordan Peele, Zach Cregger, Curry Barker e Kane Parsons. Ritratto, generi, nota biografica e link alle recensioni relative. L'ordine segue la prima comparsa nella griglia Recensioni.
- **Chi siamo** (`autori.html`) — i cinque autori de L'Antro, ordinati per firma più recente: monogramma, specialità, motto e biografia. Nessuna foto: sono personaggi inventati.
- **Gallery** (`gallery.html`) — mosaico di 31 fotogrammi con lightbox: click per ingrandire, frecce ← → per scorrere, ESC per chiudere. Copre tutti i film recensiti, uno o due a testa, nello stesso ordine della pagina Recensioni.

Niente player video, niente stelline, niente punteggi. Il footer ripete le sei voci di menu.

Ogni pagina recensione ha la stessa impaginazione: briciole di pane, occhiello, testata, **locandina ufficiale in apertura** (su un fotogramma sfocato del film), testo lungo con capolettera, fotogrammi intervallati con didascalia e citazione in evidenza, scheda film laterale sticky (regia, anno, durata, cast, musiche, anteprima), box autore, barra di avanzamento lettura e le altre due recensioni in coda.

**Sui contenuti**: i dati delle schede film (regia, anno, durata, cast, musiche, festival), le locandine, i fotogrammi e i ritratti dei registi sono reali e verificati; i testi delle recensioni e i cinque recensori che le firmano (Elena Vos, Adam Pryce, Sofia Ricci, Nico Baldan, Marta Cinti) sono inventati per popolare il template.

## Style guide

| Token | Valore | Uso |
|---|---|---|
| `--surface` | `#121212` | sfondo sezioni |
| `--black` | `#000000` | header, footer, hero |
| `--red` | `#E50914` | CTA, hover, dettagli |
| `--white` | `#FFFFFF` | titoli |
| `--text` | `#d8d8d8` | corpo dell'articolo |
| `--muted` | `#B3B3B3` | descrizioni e metadati |
| font | Poppins (fallback Inter / system-ui) | tutto |

Tutti i token stanno in `:root` in cima a `style.css`: cambiare palette = cambiare quelle righe.

## Funzioni

- **Ricerca** — la lente nell'header apre il campo: filtra in tempo reale gli elementi **della pagina in cui ti trovi**, con conteggio per tipo, anche da URL (`recensioni.html?q=peele`). Funziona su tutte le pagine di elenco; sulla home filtra solo i tre elementi in anteprima per sezione, quindi per cercare nell'intero archivio conviene partire da `recensioni.html`. Dalla pagina articolo rimanda alla home con la query già applicata.
- **Lightbox** — focus trap, navigazione da tastiera, chiusura con click fuori o ESC, contatore nella didascalia.
- **Accessibilità** — skip-link, `aria-*` coerenti, focus visibile, `prefers-reduced-motion`, menu mobile accessibile.
- **SEO** — meta e Open Graph in italiano, `lang="it"`, JSON-LD: `WebSite` + `SearchAction`, `Blog` con tutti e quindici i `BlogPosting`, `ItemList` dei nove registi in home; `CollectionPage` + `ItemList` su `recensioni.html` e `archivio.html` (ognuna nel proprio ordine); `BlogPosting` completo (`author`, `timeRequired`, `about: Movie` con `director`) nell'articolo. Nessun `aggregateRating`, coerente con la scelta di non dare voti.
- **Performance** — immagini con `loading="lazy"` e `width`/`height` dichiarati (niente layout shift), font con `display=swap`, zero librerie esterne.

## Immagini

Tutte le immagini sono ospitate su **TMDB** (`https://image.tmdb.org/t/p/<size><path>`) e sono coerenti con il film di cui si parla:

| Dove | Cosa |
|---|---|
| Apertura di ogni recensione | locandina ufficiale (`w500`) su un fotogramma sfocato dello stesso film |
| Hero della Home | fotogramma del film in evidenza + locandina ufficiale accanto al testo |
| Card recensione, figure nell'articolo, gallery | fotogrammi reali scelti per corrispondere alla didascalia |
| Elenco in `archivio.html` | locandina originale (`w300`) accanto al titolo della recensione |
| Ritratti registi | foto profilo TMDB dei nove registi |
| Recensori (Chi siamo, box autore) | monogramma CSS — sono personaggi inventati, niente foto di persone vere |

Le `size` usate: `w300` (ritratti), `w500` (locandine), `w780` (card e gallery), `w1280` (figure e hero), `original` (immagine grande della lightbox). Per passare a file locali basta sostituire gli `src`: se un'immagine non carica, `main.js` genera al volo un segnaposto SVG e il layout non si rompe, nemmeno offline.

## Personalizzare

Ogni sezione vive in **due posti**: l'anteprima in `index.html` (3 elementi) e la pagina completa. Aggiungendo qualcosa vanno toccati entrambi — l'anteprima è sempre una copia dei primi elementi della pagina completa.

**Nuova recensione.** Duplica una delle pagine in `movies/`, rinominala e aggiorna testo, locandina in apertura (`.poster-stage`, con `--stage-bg` sul fotogramma di sfondo), immagini intervallate (`<figure class="article__figure">`), scheda laterale, meta e JSON-LD. Poi:
1. in `recensioni.html` aggiungi un `<article class="card">` **in cima** al `#reviewGrid` (l'ordine è di caricamento), con `href`, `data-tags` (le parole chiave della ricerca), immagine, occhiello, titolo, estratto, minuti e regia;
2. copia la stessa scheda in cima al `#reviewGrid` di `index.html` e togli la più vecchia delle tre;
3. in `archivio.html` aggiungi un `<li class="revrow">` **al posto giusto secondo la data di uscita internazionale**;
4. se è la più recente, aggiorna l'hero della home (fondo **e** `.hero__poster`) e il bottone *Ultima recensione* nell'header di tutte le pagine.

**Nuovo autore.** Duplica un `<article class="crew">` in `autori.html` e, se è tra i tre più recenti, anche in `index.html`: iniziali nel monogramma, specialità, motto, biografia e `data-tags`.

**Nuovo regista.** Duplica un `<article class="dir">` in `registi.html` (e nell'anteprima della home se rientra nei tre): foto, generi, nome, nota e link ai film recensiti. La griglia è a 3 colonne e va a capo da sola.

**Nuova foto in gallery.** Duplica un `<li class="shot">` in `gallery.html`: `data-full` è l'immagine grande della lightbox, `data-caption` la didascalia. Le classi `shot--wide` e `shot--tall` allargano la cella nel mosaico; il mosaico si chiude senza buchi con blocchi di 5 celle `wide, normale, tall, wide, normale`, più una coda `wide, normale, normale` ripetuta per riempire le righe che avanzano. L'anteprima in home usa `gallery--preview`, tre celle uguali senza `shot--wide`/`shot--tall`.

**Nuova voce di menu.** Header e footer hanno la stessa lista in tutte le 17 pagine: vanno aggiornati insieme, ricordando il prefisso `../` nelle pagine dentro `movies/`.

## Prima di andare in produzione

- Sostituire `https://www.lantro.example/` in `canonical`, Open Graph e JSON-LD con il dominio reale.
- Testi delle recensioni, nomi e biografie dei recensori sono inventati: vanno rimpiazzati con contenuti veri.
- Locandine e fotogrammi arrivano da TMDB: verificare licenze e attribuzione prima di pubblicare, o scaricarli in `assets/img/`.
- Servire via HTTPS con compressione e cache lunga su `assets/`.
