const mysql = require("mysql");
const bcrypt = require("bcrypt");
const util = require("util");
const express = require("express");
const app = express();
const bodyparser = require("body-parser");

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
  host: "106.51.126.124",
  user: "root",
  password: "grant123",
  database: "iMedrix_administration",
});
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

mysqlConnection.connect((err) => {
  if (!err) console.log("DB connection succeded.");
  else
    console.log(
      "DB connection failed \n Error :" + JSON.stringify(err, undefined, 2)
    );
});

app.listen(3000, () => console.log("Express is running at port no : 3000"));

app.post("/edit", async (req, res) => {
  if (req.method === "POST") {
    // let entityBody = file_get_contents('php://input');
    let json = req.body;

    let update_res;
    let exe_config;
    let message;

    if (json["type"] === "operator") {
      let sql_get =
        "SELECT td.emailid, ul.id as log_id FROM iMedrix_administration.technicians_details as td, iMedrix_administration.users_login as ul WHERE td.emailid = ul.email_id and  td.id  = '" +
        json["operator_id"] +
        "' and user_type = 'TC'";

      let row;
      await query(sql_get)
        .then((res) => {
          console.log("Response in SQL GET ", res);
          row = res;
        })
        .catch((err) => {
          console.log("Error in SQL GET ", err);
        });
      // $exe = mysqli_query($conn, $sql_get);
      // $row = mysqli_fetch_assoc($exe);
      let emailid = row[0]["emailid"];
      let log_id = row[0]["log_id"];

      let invalidCount;

      if (json["mark_as_delete"] == "0") {
        invalidCount = 0;
      } else {
        invalidCount = 2;
      }

      let update_config =
        "UPDATE iMedrix_administration.users_config SET cloud_enabled = '" +
        json["cloud_enabled"] +
        "', ecg_type = '" +
        json["ecg_type"] +
        "',  is_admin = '" +
        json["is_admin"] +
        "', sample_freequency= '" +
        json["sample_freequency"] +
        "', loglevel= '" +
        json["loglevel"] +
        "',  sync= '" +
        json["sync"] +
        "', session_time= '" +
        json["session_time"] +
        "',  thermal_printer= '" +
        json["thermal_printer"] +
        "', user_usage_type= '" +
        json["user_usage_type"] +
        "', spot_moniter= '" +
        json["spot_moniter"] +
        "', name_enabled= '" +
        json["name_enabled"] +
        "', age_enabled= '" +
        json["age_enabled"] +
        "', mobile_enabled= '" +
        json["mobile_enabled"] +
        "', QR_code_enabled= '" +
        json["QR_code_enabled"] +
        "', mode= '" +
        json["mode"] +
        "', is_pdf_sync= '" +
        json["is_pdf_sync"] +
        "' , reporting_required  = '" +
        json["reporting_required"] +
        "', invalid_login_count = '" +
        invalidCount +
        "', pdfProtect = '" +
        json["protPDF"] +
        "', showPDFtp = '" +
        json["showPDF"] +
        "', skipSVscreen = '" +
        json["showSymt"] +
        "', canRegister = '" +
        json["canRegister"] +
        "', canUpdatedetails = '" +
        json["canEditRegistration"] +
        "', canAddVisit = '" +
        json["canAddVisit"] +
        "', showVitals = '" +
        json["vital"] +
        "', showSymp = '" +
        json["hisSymp"] +
        "', showLab = '" +
        json["lab"] +
        "', showMed = '" +
        json["med"] +
        "', showAddressEffects = '" +
        json["addeff"] +
        "', showGlobaImp = '" +
        json["globalimpress"] +
        "', ecgTool = '" +
        json["ecgTool"] +
        "', otherReport = '" +
        json["otherReport"] +
        "', jssRehab = '" +
        json["jssRehab"] +
        "', signature = '" +
        json["signature"] +
        "', exacta = '" +
        json["exacta"] +
        "', sunUser = '" +
        json["sunuser"] +
        "'  WHERE user_id = " +
        log_id +
        "";
      // $exe_config = mysqli_query($conn, $update_config);
      //   let exe_config;
      await query(update_config)
        .then((res) => {
          console.log("Response in Update Config ", res);
          exe_config = res;
        })
        .catch((err) => {
          console.log("Error in Update Config ", err);
        });

      let sql =
        "UPDATE  iMedrix_administration.technicians_details SET  mobile = '" +
        json["mobile"] +
        "', markas_delete ='" +
        json["mark_as_delete"] +
        "', cityname = '" +
        json["cityname"] +
        "',  city_classification = '" +
        json["city_classification"] +
        "',  qualification = '" +
        json["qualification"] +
        "', speciality =  '" +
        json["speciality"] +
        "', role = '" +
        json["role"] +
        "', region = '" +
        json["region"] +
        "' WHERE id  = '" +
        json["operator_id"] +
        "'";
      //   let update_res;
      await query(sql)
        .then((res) => {
          console.log("Response in Update Res ", res);
          update_res = res;
        })
        .catch((err) => {
          console.log("Error in Update Res ", err);
        });
      // $update_res = mysqli_query($conn, $sql); //or die("Error in Selecting " . mysqli_error($update_res));
      let message = "Details are not updated Successfully";
    } else {
      let check_doc =
        "SELECT d.emailid as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  d.id = '" +
        json["doctor_id"] +
        "' and user_type = 'DR'";
      let res_doc;
      await query(check_doc)
        .then((res) => {
          console.log("Response in Check Doc ", res);
          res_doc = res;
        })
        .catch((err) => {
          console.log("Error in check doc ", err);
        });
      // $res_doc = mysqli_query($conn, $check_doc);

      let doctor_id;
      let log_id;

      if (res_doc.length > 0) {
        let i = 0;

        while (i < res_doc.length) {
          doctor_id = res_doc[i].doctor_id;
          log_id = res_doc[i].log_id;
          i++;
        }
      }
      let update_config =
        "UPDATE iMedrix_administration.users_config SET notification_enabled = '" +
        json["notification_enabled"] +
        "', is_thirdparty_doctor = '" +
        json["is_thirdparty_doctor"] +
        "', canRegister = '" +
        json["canRegister"] +
        "', canUpdatedetails = '" +
        json["canEditRegistration"] +
        "', canAddVisit = '" +
        json["canAddVisit"] +
        "', showVitals = '" +
        json["vital"] +
        "', showSymp = '" +
        json["hisSymp"] +
        "', showLab = '" +
        json["lab"] +
        "', showMed = '" +
        json["med"] +
        "', showAddressEffects = '" +
        json["addeff"] +
        "', showGlobaImp = '" +
        json["globalimpress"] +
        "', ecgTool = '" +
        json["ecgTool"] +
        "', otherReport = '" +
        json["otherReport"] +
        "', jssRehab = '" +
        json["jssRehab"] +
        "', signature = '" +
        json["signature"] +
        "', exacta = '" +
        json["exacta"] +
        "', sunUser = '" +
        json["sunuser"] +
        "' where user_id = " +
        log_id +
        "";

      console.log("Update Config Query :", update_config);

      //   let exe_config;

      await query(update_config)
        .then((res) => {
          console.log("Response in Update Config ", res);
          exe_config = res;
        })
        .catch((err) => {
          console.log("Error in Update Config ", err);
        });

      // $exe_config = mysqli_query($conn, $update_config);

      let doc_sql =
        "UPDATE iMedrix_administration.doctor_details SET   speciality = '" +
        json["speciality"] +
        "', markas_delete= '" +
        json["markas_delete"] +
        "', phone_no = '" +
        json["doctor_phone"] +
        "', view = '" +
        json["view"] +
        "', comment = '" +
        json["comment"] +
        "', forward = '" +
        json["forward"] +
        "', closure = '" +
        json["closure"] +
        "' where id = '" +
        json["doctor_id"] +
        "' ";

      await query(doc_sql)
        .then((res) => {
          console.log("Response in DOC SQL ", res);
          update_res = res;
        })
        .catch((err) => {
          console.log("Error in DOC SQL ", err);
        });

      // $update_res = mysqli_query($conn, $doc_sql);

      message = "Details are not updated Successfully";
    }
    if (update_res && exe_config) {
      let resultArray = {
        Result: "Success",
        Response: "Details updated successfully",
      };

      console.log("Result Array :", resultArray);

      res.send({ Status: "Updated Succeefully" });
    } else {
      let resultArray = {
        Result: "failure",
        Response: message,
      };

      console.log("Result Array :", resultArray);

      res.send({ Status: "Failed to Update" });
    }
  } else {
    let resultArray = {
      Result: "failure",
      Response: "Bad request please use post method",
    };

    console.log("Result Array :", resultArray);
    res.send({ Status: "Update Failed Please Use Post Method" });
  }

  // echo json_encode($resultArray);
});
