# The Wretched Hive
## Full Stack E-commerce Sandbox Application

I created this application to practice and play around with full-stack development.

## To Run Locally:

### Client:
`cd` into the `the-wretched-hive-client` directory and run `npm run dev`

### Server:
`cd` into the `server` directory and run `npm run start`
**Note:** You may need to seed the database. I committed the binary I've used for local dev, so it __should__ work out of the box, but if not, simply run the following commands:

Install sqlite globally:
```bash
npm install -g sqlite3
```

cd into the model directory
```bash
cd server/model
```

run the seed script
```bash
sqlite3 ecommerce.db < seed.sql
```