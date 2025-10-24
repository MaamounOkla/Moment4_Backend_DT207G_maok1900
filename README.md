
# Backend med JWT-autentisering  
# moment4_backend_DT207G  

## Författare  
- Maamoun Okla  

## Senaste uppdatering  
- 2025-10-24  

Detta repository innehåller koden för ett backend-API byggt med **Node.js**, **Express** och **MongoDB (Atlas)**.  
Syftet är att skapa en webbtjänst med **autentisering och säkerhet** genom användning av **JSON Web Tokens (JWT)**.  

API:et innehåller registrering, inloggning och skyddade rutter som endast kan nås med giltig JWT-token.  

---

## Installation  
1. Klona repositoryt.  
2. Kör `npm install` för att installera alla beroenden.  
3. Skapa en `.env`-fil i projektets rotkatalog med följande innehåll:  
```

PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET_Key=<valfritt_hemligt_värde>

```
4. Starta servern med:  
```

npm run serve

```
Servern körs på `http://localhost:3000`.  

---

## Projektstruktur  
```

├── middleware/
│   └── auth.js
├── models/
│   └── User.js
├── routes/
│   ├── authed.js
│   └── protected.js
├── server.js
├── .env
├── package.json
└── README.md

````

---

## Användning  

| Metod | Ändpunkt | Beskrivning |
|-------|-----------|-------------|
| POST  | /api/register | Registrerar en ny användare (skapar konto). |
| POST  | /api/login | Loggar in användaren och returnerar JWT-token. |
| GET   | /api/me | Returnerar information om inloggad användare. |
| GET   | /api/protected | Skyddad rutt – kräver giltig JWT-token. |

Exempel på JSON-data vid registrering/inloggning:  
```json
{
  "username": "admin",
  "password": "password123"
}
````

Svar vid lyckad inloggning:

```json
{
  "message": "User logged in successfully",
  "token": "<JWT-token>"
}
```

För att komma åt skyddade rutter måste klienten skicka JWT-token i headern:

```
Authorization: Bearer <token>
```

 
