# Exporting Firestore data to a Google Sheet

From the guide on my [dev site](https://itsthesteve.dev/scratch/exporting-firestore-to-google-sheets).

After installing the dependencies, you'll need to create a `.env` file with the following:

```
GOOGLE_APPLICATION_CREDENTIALS=<service-account-file-path>
SHEET_ID=<google-sheet-id>
SHEET_NAME=<google-sheet-name>
```

...where `SHEET_ID` is the alphanumeric string in the URL of the spreadsheet and `SHEET_NAME` is the title of the workbook/sheet itself.

Run the server and open `http://localhost:8080`.
