# Stap-voor-Stap Installatie Gids
## Rittenadministratie Converter Webapplicatie

Deze gids helpt u bij het installeren en configureren van de Rittenadministratie Converter webapplicatie op uw systeem.

## Systeemvereisten

### Minimale Vereisten
- **Besturingssysteem**: Windows 10/11, macOS 10.15+, of Linux (Ubuntu 18.04+)
- **RAM**: Minimaal 4GB, aanbevolen 8GB
- **Schijfruimte**: Minimaal 1GB vrije ruimte
- **Internetverbinding**: Vereist voor het downloaden van dependencies

### Software Vereisten
- **Python**: Versie 3.11 of hoger
- **Node.js**: Versie 18 of hoger (alleen nodig voor frontend ontwikkeling)
- **Git**: Voor het klonen van de repository

## Voorbereiding

### Python Installatie Controleren

Open een terminal of command prompt en voer uit:

```bash
python3 --version
```

Als Python niet is geïnstalleerd, download het van [python.org](https://www.python.org/downloads/).

### Node.js Installatie (Optioneel)

Alleen nodig als u de frontend wilt aanpassen:

```bash
node --version
npm --version
```

Download van [nodejs.org](https://nodejs.org/) indien niet geïnstalleerd.

## Installatie Proces

### Stap 1: Project Downloaden

#### Optie A: Git Clone (Aanbevolen)
```bash
git clone <repository-url>
cd rittenadministratie-web
```

#### Optie B: ZIP Download
1. Download de ZIP van de repository
2. Pak uit naar gewenste locatie
3. Open terminal in de uitgepakte map

### Stap 2: Python Virtual Environment

Een virtual environment zorgt ervoor dat de project dependencies geïsoleerd blijven.

#### Op Windows:
```cmd
python -m venv venv
venv\Scripts\activate
```

#### Op macOS/Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

**Verificatie**: Uw terminal prompt zou moeten beginnen met `(venv)`.

### Stap 3: Python Dependencies Installeren

Met de virtual environment geactiveerd:

```bash
pip install -r requirements.txt
```

Dit installeert alle benodigde Python packages:
- Flask (webframework)
- Flask-CORS (cross-origin requests)
- pandas (data verwerking)
- openpyxl (Excel bestanden)
- SQLAlchemy (database)

### Stap 4: Applicatie Testen

Start de Flask server:

```bash
python src/main.py
```

U zou de volgende output moeten zien:
```
* Serving Flask app 'main'
* Debug mode: on
* Running on all addresses (0.0.0.0)
* Running on http://127.0.0.1:5000
* Running on http://[uw-ip]:5000
```

### Stap 5: Applicatie Openen

1. Open uw webbrowser
2. Ga naar: `http://localhost:5000`
3. U zou de Rittenadministratie Converter homepage moeten zien

## Frontend Ontwikkeling (Optioneel)

Als u wijzigingen wilt maken aan de gebruikersinterface:

### Stap 1: Frontend Dependencies

```bash
cd rittenadministratie-frontend
npm install
```

### Stap 2: Development Server

```bash
npm run dev
```

Dit start een development server op `http://localhost:5173` met hot-reload.

### Stap 3: Build voor Productie

```bash
npm run build
```

### Stap 4: Deploy naar Flask

```bash
cp -r dist/* ../rittenadministratie-web/src/static/
```

## Configuratie

### Database Configuratie

De applicatie gebruikt standaard SQLite. De database wordt automatisch aangemaakt in:
```
src/database/app.db
```

### Environment Variabelen (Optioneel)

Maak een `.env` bestand voor gevoelige configuratie:

```env
SECRET_KEY=uw-geheime-sleutel-hier
DEBUG=False
DATABASE_URL=sqlite:///app.db
```

### CORS Configuratie

CORS is standaard ingeschakeld voor alle origins. Voor productie kunt u dit beperken in `src/main.py`:

```python
CORS(app, origins=['http://localhost:3000', 'https://uw-domain.com'])
```

## Productie Deployment

### Gunicorn Setup

Voor productie gebruik:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
```

### Nginx Configuratie (Optioneel)

Voorbeeld nginx configuratie:

```nginx
server {
    listen 80;
    server_name uw-domain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Systemd Service (Linux)

Maak `/etc/systemd/system/rittenadministratie.service`:

```ini
[Unit]
Description=Rittenadministratie Converter
After=network.target

[Service]
User=www-data
WorkingDirectory=/pad/naar/rittenadministratie-web
Environment=PATH=/pad/naar/rittenadministratie-web/venv/bin
ExecStart=/pad/naar/rittenadministratie-web/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 src.main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Activeer met:
```bash
sudo systemctl enable rittenadministratie
sudo systemctl start rittenadministratie
```

## Troubleshooting

### Probleem: "ModuleNotFoundError"

**Oplossing**: Controleer of de virtual environment is geactiveerd:
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

### Probleem: "Permission denied" op poort 5000

**Oplossing**: Gebruik een andere poort:
```bash
python src/main.py --port 8000
```

Of wijzig in `src/main.py`:
```python
app.run(host='0.0.0.0', port=8000, debug=True)
```

### Probleem: Frontend laadt niet

**Oplossing**: 
1. Controleer of build bestanden bestaan in `src/static/`
2. Rebuild de frontend:
```bash
cd rittenadministratie-frontend
npm run build
cp -r dist/* ../rittenadministratie-web/src/static/
```

### Probleem: XML parsing fouten

**Oplossing**: 
1. Controleer XML bestand validiteit
2. Zorg voor correcte namespace: `http://www.taxicentrale.nl/schema/ritadministratie`
3. Test met het meegeleverde `sample_data.xml`

### Probleem: Database fouten

**Oplossing**: 
1. Verwijder `src/database/app.db`
2. Herstart de applicatie (database wordt opnieuw aangemaakt)

## Performance Optimalisatie

### Voor Grote XML Bestanden

1. **Verhoog upload limiet** in `src/main.py`:
```python
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB
```

2. **Gebruik streaming parsing** voor zeer grote bestanden
3. **Implementeer background processing** met Celery

### Voor Veel Gebruikers

1. **Gebruik Redis** voor sessie opslag
2. **Implementeer database connection pooling**
3. **Gebruik een load balancer** voor meerdere instances

## Backup en Onderhoud

### Database Backup

```bash
cp src/database/app.db backup/app_$(date +%Y%m%d).db
```

### Log Rotatie

Configureer log rotatie in productie:

```python
import logging
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler('logs/app.log', maxBytes=10000000, backupCount=5)
app.logger.addHandler(handler)
```

### Updates

1. **Backup huidige installatie**
2. **Pull nieuwe versie**:
```bash
git pull origin main
```
3. **Update dependencies**:
```bash
pip install -r requirements.txt
```
4. **Rebuild frontend** indien nodig
5. **Herstart applicatie**

## Ondersteuning

### Log Bestanden

- **Flask logs**: Terminal output of configureer file logging
- **Browser logs**: F12 → Console tab
- **Nginx logs**: `/var/log/nginx/error.log`

### Debug Mode

Voor ontwikkeling, zet debug mode aan in `src/main.py`:
```python
app.run(host='0.0.0.0', port=5000, debug=True)
```

**Waarschuwing**: Zet debug mode UIT in productie!

### Contact

Voor technische ondersteuning:
1. Controleer deze gids
2. Zoek in GitHub issues
3. Maak nieuwe issue met:
   - Besturingssysteem
   - Python versie
   - Error logs
   - Stappen om te reproduceren

## Volgende Stappen

Na succesvolle installatie:

1. **Test met voorbeeld data**: Upload `sample_data.xml`
2. **Configureer voor uw omgeving**: Pas instellingen aan
3. **Train gebruikers**: Deel gebruikershandleiding
4. **Monitor performance**: Houd logs in de gaten
5. **Plan updates**: Houd repository in de gaten voor updates

