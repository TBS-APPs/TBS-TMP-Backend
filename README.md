## Migrations

```bash
typeorm migration:generate -d src\database\data-source.ts <migration-name>
```

## Postman collection

### Import in Postman

1. Start the backend (`npm run start:dev`)
2. In Postman: **Import → Link**
3. Paste: `http://localhost:3000/swagger/json`
4. Import — Postman builds the collection from your Swagger setup (Bearer auth included)
