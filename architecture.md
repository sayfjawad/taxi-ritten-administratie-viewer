
# Webapplicatie Architectuur

De webapplicatie zal bestaan uit een **Flask backend** en een **React frontend**.

## Backend (Flask)
-   **Functionaliteit:**
    -   Ontvangen van geüploade XML-bestanden.
    -   Parsen van de XML-data.
    -   Converteren van de geparseerde data naar een gestructureerd formaat (bijv. JSON).
    -   Tijdelijke opslag van de geconverteerde data.
    -   Aanbieden van API-endpoints voor de frontend om de data op te halen en te filteren.
-   **Technologieën:**
    -   Python 3
    -   Flask (webframework)
    -   `xml.etree.ElementTree` of `lxml` voor XML-parsing (of een andere geschikte library).
    -   `pandas` voor dataverwerking en eventueel export naar Excel (indien gewenst door de gebruiker).

## Frontend (React)
-   **Functionaliteit:**
    -   Gebruikersinterface voor het uploaden van XML-bestanden.
    -   Weergave van de geconverteerde data in een tabel.
    -   Mogelijkheid om de data te filteren en te sorteren.
    -   Downloadoptie voor de geconverteerde data (bijv. als CSV of Excel).
-   **Technologieën:**
    -   React (JavaScript library voor UI)
    -   HTML/CSS
    -   JavaScript (ES6+)
    -   Fetch API of Axios voor communicatie met de backend.
    -   Een tabelcomponent (bijv. React Table) voor dataweergave.

## API Endpoints
-   `POST /upload`: Voor het uploaden van XML-bestanden. Retourneert een ID voor de geüploade sessie en/of de geconverteerde data.
-   `GET /data/<session_id>`: Voor het ophalen van de geconverteerde data voor een specifieke sessie. Ondersteunt optionele queryparameters voor filtering en paginering.
-   `GET /download/<session_id>`: Voor het downloaden van de geconverteerde data in Excel-formaat.

## Data Flow
1.  Gebruiker uploadt XML-bestand via de React frontend.
2.  Frontend stuurt het bestand naar de `/upload` endpoint van de Flask backend.
3.  Backend ontvangt het bestand, parset de XML, converteert het naar een bruikbaar formaat en slaat het tijdelijk op.
4.  Backend stuurt een bevestiging en/of de geparseerde data terug naar de frontend.
5.  Frontend toont de data in een tabel.
6.  Gebruiker kan filteren/sorteren, wat resulteert in `GET` requests naar de backend.
7.  Gebruiker kan de data downloaden via de `/download` endpoint.


