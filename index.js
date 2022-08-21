require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const app = express();

const spreadsheetId = process.env.DATABASE_ID;

// --- helper functions ---
// get auth token
function getAuth() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  // console.log("------- auth -------- ", auth);
  return auth;
}

// proccure googleSheet method
async function getGoogleSheet(auth) {
  const client = await auth.getClient();
  // console.log("------ client -------- ", client);
  const googleSheet = google.sheets({ version: "v4", auth: client });
  // console.log("-------- GoogleSheet --------- ", googleSheet);
  return googleSheet;
}
// --- helper functions ---

//fetches data from the spreadsheet
app.get("/", async (req, res) => {
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);

  // const getMetaData = await googleSheet.spreadsheets.get({
  //   auth,
  //   spreadsheetId,
  // });

  const getRows = await googleSheet.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:E",
    // range: "Sheet2!A2:B",
  });
  res.send(getRows.data.values);
});

//posts data to cell
app.get("/post", async (req, res) => {
  console.log("post");
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);

  const response = await googleSheet.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:E",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [["benny", "benny@gmail.com", "9398453013", "hi", "India"]],
    },
  });
  // console.log(" USER dATA Added Successfully >>>> statusCode", response.status);
  res.send("submitted Successfully");

  // await googleSheet.spreadsheets.values.append({
  //   auth,
  //   spreadsheetId,
  //   range: "Sheet2!A2:B",
  //   valueInputOption: "USER_ENTERED",
  //   resource: {
  //     values: [["NextJS", "The framework of the future"]],
  //   },
  // });

  // res.send("Submitted Successfully");
});

// deletes cell data
app.get("/delete", async (req, res) => {
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);

  const response = await googleSheet.spreadsheets.values.clear({
    auth,
    spreadsheetId,
    range: "Sheet1!A9:E9",
  });

  // console.log(response);
  res.send("Deleted Successfull");

  // await googleSheet.spreadsheets.values.clear({
  //   auth,
  //   spreadsheetId,
  //   range: "Sheet2!A5:B5",
  // });

  // res.send("Deleted Successfully");
});

// update cell data
app.get("/update", async (req, res) => {
  const auth = getAuth();
  const googleSheet = await getGoogleSheet(auth);

  const response = await googleSheet.spreadsheets.values.update({
    auth,
    spreadsheetId,
    range: "Sheet1!A9:E9",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [["stack", "stack@gmail.com", "9398453013", "Future of the Web"]],
    },
  });

  res.send("Updated Successfully");

  // await googleSheet.spreadsheets.values.update({
  //   auth,
  //   spreadsheetId,
  //   range: "Sheet2!A2:B2",
  //   valueInputOption: "USER_ENTERED",
  //   resource: {
  //     values: [["Elon", "Make a spaceship"]],
  //   },
  // });

  // res.send("Updated Successfully");
});

app.listen(3004 || process.env.PORT, () => {
  console.log("Up and running!!");
});
