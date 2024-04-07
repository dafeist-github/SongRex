**SongRex** ist eine Plattform, wo Personen für z.B. private Partys Songs einreichen kann, die dann von einem Admin verwaltet werden können
Man kann es mit Docker-Compose sehr simpel aufsetzen, verwendet wird standardmäßig eine MariaDB-Datenbank und ein SvelteKit + ExpressJS Stack

---- Vorraussetzungen ----

Beliebiges System mit Git, Docker und Docker-Compose

---- Installation ----

git clone https://github.com/dafeist-github/SongRex.git

cd /SongRex

mv compose-example.yml compose.yml
**Wichtig: Hier nun die compose konfigurieren, wie weiter unten beschrieben!**
docker compose up -d --build

Der Service sollte nun unter dem festgelegten Port erreichbar sein

---- Konfiguration ----

In *compose-example.yml* ist ein Template beigelegt, welches abgeändert werden soll

Für den Service MariaDB soll der Datenbankname sowie das Root-Passwort angegeben werden, welches genau gleich unter SongRex-Server genannt sein muss

PUBLIC_URL=http://exampleurl.com:port | Spezifiziert die URL, unter welcher das Backend erreichbar ist

ADMIN_PASSWORD=examplepw | Das Passwort für den Verwaltungsaccount

MYSQL_HOST=mariadb | Gibt den Containernamen/Das Netzwerk an, worunter die Datenbank läuft

SECRET_KEY=examplekey | Gibt einen Key an, der für die Validierung von Session-Tokens benötigt wird. Generiere am besten ein zufälliges Passwort dafür

X_FORWARD_ENABLED=false | Sollte nur aktiviert werden, wenn der Service hinter einer Reverse-Proxy öffentlich ist
