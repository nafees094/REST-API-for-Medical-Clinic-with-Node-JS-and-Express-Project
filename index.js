const express = require("express");
const bodyParser = require("body-parser")
const app = express();
app.use(bodyParser.json());

// Create patients in an object with information within an array
let patients = new Object();
patients["9999991234"] = ["Anwar", "Syed", "123-456-7891"]
patients["9999995678"] = ["Rob", "Stewart", "987-741-1234"]

// Create records in an object with status of health within an array
let records = new Object();
records["9999991234"] = "Status: Healthy"
records["9999995678"] = "Status: Slight Fever"


// Get patient medical records
app.get("/records", (req, res) => {

    // Verify Patient Exists
    if (records[req.headers.sin] === undefined) {
        res.status(404).send({"msg":"Patient not found."})
        return;
    }
    
    // Verify SIN matches First and Last Name
    if (req.headers.firstname == patients[req.headers.sin][0] && req.headers.lastname == patients[req.headers.sin][1]) {
        if (req.body.reasonforvisit == "medicalrecords") {
            // if first and last name match, return medical records
            res.status(200).send(records[req.headers.sin])
            return;
        }
        else {
            // return error
            res.status(501).send({"msg":"Unable to complete request at this time: " + req.body.reasonforvisit})
            return;
        }
    }
    else {
        res.status(401).send({"msg": "First or Last name doesnt match the SIN"})
        return;
    }

    // Return Appropriate Record
    res.status(200).send({"msg": "HTTP GET - SUCCESS!"})
});


// Create a new patient
app.post("/newpatient", (req, res) => {
    
    // Create patient in database
    patients[req.headers.sin] = [req.headers.firstname, req.headers.lastname, req.headers.phone]
    res.status(200).send(patients)
});


// Update existing patient phone number
app.put("/updatephone", (req, res) => {
     
    // Verify Patient Exists
      if (records[req.headers.sin] === undefined) {
        res.status(404).send({"msg":"Patient not found."})
        return;
    }

      // Verify SIN matches First and Last Name
      if (req.headers.firstname == patients[req.headers.sin][0] && req.headers.lastname == patients[req.headers.sin][1]) {
        
        // Update the phone number and return patient info
        patients[req.headers.sin] = [req.headers.firstname, req.headers.lastname, req.body.phone];
        res.status(200).send(patients[req.headers.sin]);
        return;
      }
      else {
        res.status(401).send({"msg": "First or Last name doesnt match the SIN"})
        return;
    }

    // Make sure 
    res.status(200).send({"msg": "HTTP PUT - SUCCESS!"})
});


// Delete patient records
app.delete("/deleterecords", (req, res) => {
      
    // Verify Patient Exists
      if (records[req.headers.sin] === undefined) {
        res.status(404).send({"msg":"Patient not found."})
        return;
    }
    
    // Verify SIN matches First and Last Name
    if (req.headers.firstname == patients[req.headers.sin][0] && req.headers.lastname == patients[req.headers.sin][1]) {
        
        //Delete patient and medical records from database

        delete patients[req.headers.sin]
        delete records[req.headers.sin]

        res.status(200).send(patients);
        return;
    }
    else {
        res.status(401).send({"msg": "First or Last name doesnt match the SIN. (Trying to delete)"})
        return;
    }
});


app.listen(3000);
