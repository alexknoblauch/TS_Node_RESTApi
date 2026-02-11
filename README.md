Bemerkungen zum Projekt

## Tech Stack: Node.js & TypeScript
Express - als Webframework
Mongoose - für MongoDB
Redis - für Caching & Rate Limiting
Winston - für Logging
JWT - für Authentifizierung
Cloudinary - für Datei-Uploads
Jest - für Unit Tests


## Architektur & Design
Controllers: Http basierte Controller
Services: Business logic kapseln - Lose Kopplung
Repositories: Funktionales abstrahieren der DB
Interfaces: BaseUser, LeanUser, DocumentUser + CRUD Interfaces.
Statis Methods: Usermodel direkt anstueren.
Middleware: Authenticate, Authorize, ErrorHandling, Validation, CorrelationId
Logging: Winston mit Redis counter, correlationId, log level, file rotation.
Errors: ServiceError und HTTPError - Layer trennen.
Error Handler: Prod und Dev unterscheiden - verschiden viel Information leaken. AppError und ServerError unterscheiden.



## Features
RESTful API mit TypeScript und Express
JWT - Authentication & Authorization
2FA - zur Übung und Security-Analyse
Rate Limiting - mit Redis zur Schutz vor Abuse
Caching - von häufigen Daten über Redis
Structured Logging mit Winston (inkl. CorrelationID, File Rotation, Log-Level)
Clean Architecture: Controller → Service → Repository
Unit Tests - mit Jest und Mock-Injection


Dieses Projekt dient als Blueprint und half mir neue Techniken kennen zu lernen und Analysieren.
Ich habe über Abstrahierungen und Layers gelernt, sowie best practices in Express.
Es ist nicht als fertige API gedacht, ich habe das Postman Testing ab einem gewissen Zeitpunkt abgesetzt.
Einen grossteil der Funktionen und Files habe ich mehrmals repetiert und im Kopf abgespeichert, ein anderer Teil ist Boilerplate ready for Production.
Alle Zeilen des Codes sind anaylsiert und verstanden als auch der Datenfluss der kompletten API.
