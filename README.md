## Migrations

Generate a migration from entity changes (writes under `src/database/migrations/`):

```bash
npm run migration:generate -- src/database/migrations/<migration-name>
```

Example:

```bash
npm run migration:generate -- src/database/migrations/add-metadata-to-mobile-app-translation-key
```

Run pending migrations:

```bash
npm run migration:run
```

Show migration status:

```bash
npm run migration:show
```

Revert the last migration:

```bash
npm run migration:revert
```

## Postman collection

### Import in Postman

1. Start the backend (`npm run start:dev`)
2. In Postman: **Import → Link**
3. Paste: `http://localhost:3000/swagger/json`
4. Import — Postman builds the collection from your Swagger setup (Bearer auth included)
