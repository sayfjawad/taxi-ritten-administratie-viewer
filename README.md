# Rittenadministratie Converter - Webapplicatie

Een moderne webapplicatie voor het uploaden, bekijken en converteren van XML rittenadministratie bestanden naar Excel formaat. Deze applicatie biedt een gebruiksvriendelijke interface voor het verwerken van taxi ritgegevens.

## Overzicht

Deze webapplicatie is ontwikkeld als een uitbreiding van de oorspronkelijke [rittenadministratie-converter](https://github.com/sayfjawad/rittenadministratie-converter) Java applicatie. In plaats van een desktop GUI biedt deze versie een moderne webinterface die toegankelijk is via elke webbrowser.

### Hoofdfunctionaliteiten

- **Web-gebaseerde file upload**: Sleep en drop of selecteer XML bestanden via een intuïtieve interface
- **Real-time data parsing**: Automatische verwerking van XML rittenadministratie bestanden
- **Online data viewer**: Bekijk en filter ritgegevens in een overzichtelijke tabel
- **Zoekfunctionaliteit**: Zoek door alle velden van de ritgegevens
- **Paginering**: Efficiënte weergave van grote datasets
- **Excel export**: Download de verwerkte data als Excel (.xlsx) bestand
- **Responsive design**: Werkt op desktop, tablet en mobiele apparaten

## Technische Architectuur

### Backend (Flask)
- **Python 3.11** met Flask webframework
- **XML parsing** met Python's ingebouwde `xml.etree.ElementTree`
- **Excel generatie** met pandas en openpyxl
- **CORS ondersteuning** voor frontend-backend communicatie
- **RESTful API** endpoints voor file upload en data retrieval

### Frontend (React)
- **React 18** met moderne hooks en functional components
- **Tailwind CSS** voor styling en responsive design
- **shadcn/ui** componenten voor professionele UI elementen
- **Lucide React** iconen voor visuele elementen
- **Vite** als build tool voor optimale performance

### API Endpoints

| Endpoint | Method | Beschrijving |
|----------|--------|--------------|
| `/api/upload` | POST | Upload XML bestand en krijg sessie ID |
| `/api/data/<session_id>` | GET | Haal ritgegevens op met paginering en zoekfunctie |
| `/api/download/<session_id>` | GET | Download data als Excel bestand |
| `/api/sessions` | GET | Overzicht van alle actieve sessies |
| `/api/sessions/<session_id>` | DELETE | Verwijder een sessie |

## Installatie Instructies

### Vereisten

- Python 3.11 of hoger
- Node.js 18 of hoger
- Git

### Stap 1: Repository Klonen

```bash
git clone <repository-url>
cd rittenadministratie-web
```

### Stap 2: Backend Setup

1. **Maak een virtual environment aan:**
```bash
python3 -m venv venv
source venv/bin/activate  # Op Windows: venv\\Scripts\\activate
```

2. **Installeer Python dependencies:**
```bash
pip install -r requirements.txt
```

3. **Controleer de installatie:**
```bash
python src/main.py
```

De Flask server zou moeten starten op `http://localhost:5000`

### Stap 3: Frontend Setup (Ontwikkeling)

Als u wijzigingen wilt maken aan de frontend:

1. **Navigeer naar de frontend directory:**
```bash
cd ../rittenadministratie-frontend
```

2. **Installeer Node.js dependencies:**
```bash
npm install
```

3. **Start de development server:**
```bash
npm run dev
```

4. **Build voor productie:**
```bash
npm run build
```

5. **Kopieer build naar Flask static directory:**
```bash
cp -r dist/* ../rittenadministratie-web/src/static/
```

### Stap 4: Applicatie Starten

1. **Start de Flask backend:**
```bash
cd rittenadministratie-web
source venv/bin/activate
python src/main.py
```

2. **Open uw webbrowser en ga naar:**
```
http://localhost:5000
```

## Gebruik van de Applicatie

### XML Bestand Uploaden

1. Open de webapplicatie in uw browser
2. Sleep een XML bestand naar het upload gebied of klik op "Selecteer Bestand"
3. Selecteer een geldig XML rittenadministratie bestand
4. Het bestand wordt automatisch verwerkt en u wordt doorgeleid naar de data viewer

### Data Bekijken en Filteren

1. Na het uploaden ziet u een tabel met alle ritgegevens
2. Gebruik de zoekbalk om te zoeken in alle velden
3. Navigeer door de pagina's als er veel data is
4. Klik op "Download Excel" om de data te exporteren

### Ondersteunde XML Structuur

De applicatie verwacht XML bestanden met de volgende structuur:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<envelop xmlns="http://www.taxicentrale.nl/schema/ritadministratie">
    <ritadministratie>
        <vervoerder>
            <ondernemerskaart>
                <rit>
                    <data>
                        <rtVgNr>12345</rtVgNr>
                        <datTdReg>2024-01-15T10:30:00</datTdReg>
                        <type>TAXI</type>
                        <bestuurder>
                            <chIdNr>D001</chIdNr>
                        </bestuurder>
                        <kmStdBeg>125000</kmStdBeg>
                        <kmStdEnd>125025</kmStdEnd>
                        <prijs>35.50</prijs>
                        <locBeg>
                            <lat>52.3676</lat>
                            <lon>4.9041</lon>
                        </locBeg>
                        <locEnd>
                            <lat>52.3702</lat>
                            <lon>4.8952</lon>
                        </locEnd>
                    </data>
                </rit>
                <!-- Meer ritten... -->
            </ondernemerskaart>
        </vervoerder>
    </ritadministratie>
</envelop>
```

## Voorbeeld Data

Een voorbeeld XML bestand (`sample_data.xml`) is meegeleverd voor testdoeleinden. Dit bestand bevat drie voorbeeldritten met alle ondersteunde velden.

## Deployment

### Lokale Deployment

Voor lokale deployment volgt u de installatie-instructies hierboven.

### Productie Deployment

Voor productie deployment:

1. **Gebruik een productie WSGI server zoals Gunicorn:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

2. **Configureer een reverse proxy (nginx) voor betere performance**

3. **Gebruik HTTPS in productie**

4. **Configureer environment variabelen voor gevoelige instellingen**

## Troubleshooting

### Veelvoorkomende Problemen

**1. "Geen bestand gevonden" fout**
- Controleer of u een bestand heeft geselecteerd
- Zorg ervoor dat het bestand een .xml extensie heeft

**2. "XML parsing error"**
- Controleer of het XML bestand geldig is
- Zorg ervoor dat de XML structuur overeenkomt met het verwachte schema

**3. "Netwerkfout" bij upload**
- Controleer of de Flask server draait
- Controleer of er geen firewall de verbinding blokkeert

**4. Frontend laadt niet**
- Controleer of de build bestanden correct zijn gekopieerd naar de static directory
- Controleer de browser console voor JavaScript fouten

### Logs Bekijken

Flask logs worden weergegeven in de terminal waar u de server heeft gestart. Voor meer gedetailleerde logging kunt u het log level aanpassen in `src/main.py`.

## Ontwikkeling

### Project Structuur

```
rittenadministratie-web/
├── src/
│   ├── models/          # Database modellen
│   ├── routes/          # API route handlers
│   │   ├── user.py      # Gebruiker routes (template)
│   │   └── rittenadministratie.py  # Hoofdfunctionaliteit
│   ├── static/          # Frontend build bestanden
│   ├── database/        # SQLite database
│   └── main.py          # Flask applicatie entry point
├── venv/                # Python virtual environment
└── requirements.txt     # Python dependencies

rittenadministratie-frontend/
├── src/
│   ├── components/      # React componenten
│   │   ├── ui/          # shadcn/ui componenten
│   │   ├── FileUpload.jsx
│   │   └── DataViewer.jsx
│   ├── App.jsx          # Hoofd React component
│   └── main.jsx         # React entry point
├── dist/                # Build output
└── package.json         # Node.js dependencies
```

### Bijdragen

1. Fork het project
2. Maak een feature branch (`git checkout -b feature/nieuwe-functie`)
3. Commit uw wijzigingen (`git commit -am 'Voeg nieuwe functie toe'`)
4. Push naar de branch (`git push origin feature/nieuwe-functie`)
5. Maak een Pull Request

### Code Style

- **Python**: Volg PEP 8 richtlijnen
- **JavaScript**: Gebruik ESLint configuratie
- **CSS**: Gebruik Tailwind CSS utilities waar mogelijk

## Licentie

Dit project is gelicenseerd onder de MIT License - zie het LICENSE bestand voor details.

## Ondersteuning

Voor vragen of problemen:

1. Controleer eerst de troubleshooting sectie
2. Zoek in de bestaande issues op GitHub
3. Maak een nieuwe issue aan met gedetailleerde informatie

## Changelog

### Versie 1.0.0
- Initiële release van de webapplicatie
- XML upload en parsing functionaliteit
- Online data viewer met zoek en filter opties
- Excel export functionaliteit
- Responsive design voor alle apparaten

