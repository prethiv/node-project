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

<?php
/**
 * Copyright (c) iMedrix  - All Rights Reserved
 * NOTICE:  All information contained herein is, and remains the property of iMedrix
 * Author: Venakata Saikumar Bitta
 **/
include_once '/var/www/html/imedrix_backend/commonlibs/db_conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $entityBody = file_get_contents('php://input');
    $json = json_decode($entityBody, true);

    if ($json['type'] == 'operator') {

        $sql_get = "SELECT td.emailid, ul.id as log_id FROM iMedrix_administration.technicians_details as td, iMedrix_administration.users_login as ul WHERE td.emailid = ul.email_id and  td.id  = '" . $json['operator_id'] . "' and user_type = 'TC'";
        $exe = mysqli_query($conn, $sql_get);
        $row = mysqli_fetch_assoc($exe);
        $emailid = $row['emailid'];
        $log_id = $row['log_id'];

        if ($json['mark_as_delete'] == '0') {
            $invalidCount = 0;
        } else {
            $invalidCount = 2;
        }

        $update_config = "UPDATE iMedrix_administration.users_config SET cloud_enabled = '" . $json['cloud_enabled'] . "', ecg_type = '" . $json['ecg_type'] . "',  is_admin = '" . $json['is_admin'] . "', sample_freequency= '" . $json['sample_freequency'] . "', loglevel= '" . $json['loglevel'] . "',  sync= '" . $json['sync'] . "', session_time= '" . $json['session_time'] . "',  thermal_printer= '" . $json['thermal_printer'] . "', user_usage_type= '" . $json['user_usage_type'] . "', spot_moniter= '" . $json['spot_moniter'] . "', name_enabled= '" . $json['name_enabled'] . "', age_enabled= '" . $json['age_enabled'] . "', mobile_enabled= '" . $json['mobile_enabled'] . "', QR_code_enabled= '" . $json['QR_code_enabled'] . "', mode= '" . $json['mode'] . "', is_pdf_sync= '" . $json['is_pdf_sync'] . "' , reporting_required  = '" . $json['reporting_required'] . "', invalid_login_count = '$invalidCount', pdfProtect = '" . $json['protPDF'] . "', showPDFtp = '" . $json['showPDF'] . "', skipSVscreen = '" . $json['showSymt'] . "', canRegister = '" . $json['canRegister'] . "', canUpdatedetails = '" . $json['canEditRegistration'] . "', canAddVisit = '" . $json['canAddVisit'] . "', showVitals = '" . $json['vital'] . "', showSymp = '" . $json['hisSymp'] . "', showLab = '" . $json['lab'] . "', showMed = '" . $json['med'] . "', showAddressEffects = '" . $json['addeff'] . "', showGlobaImp = '" . $json['globalimpress'] . "', ecgTool = '" . $json['ecgTool'] . "', otherReport = '" . $json['otherReport'] . "', jssRehab = '" . $json['jssRehab'] . "', signature = '" . $json['signature'] . "', exacta = '" . $json['exacta'] . "', sunUser = '" . $json['sunuser'] . "'  WHERE user_id = $log_id";
        $exe_config = mysqli_query($conn, $update_config);


        $sql = "UPDATE  iMedrix_administration.technicians_details SET  mobile = '" . $json['mobile'] . "', markas_delete ='" . $json['mark_as_delete'] . "', cityname = '" . $json['cityname'] . "',  city_classification = '" . $json['city_classification'] . "',  qualification = '" . $json['qualification'] . "', speciality =  '" . $json['speciality'] . "', role = '" . $json['role'] . "', region = '" . $json['region'] . "' WHERE id  = '" . $json['operator_id'] . "'";
        $update_res = mysqli_query($conn, $sql); //or die("Error in Selecting " . mysqli_error($update_res));
        $message = 'Details are not updated Successfully';
    } else {

        $check_doc = "SELECT d.emailid as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  d.id = '" . $json['doctor_id'] . "' and user_type = 'DR'";
        $res_doc = mysqli_query($conn, $check_doc);
        if (mysqli_num_rows($res_doc) > 0) {
            while ($row_doc = mysqli_fetch_assoc($res_doc)) {
                $doctor_id = $row_doc['doctor_id'];
                $log_id = $row_doc['log_id'];
            }
        }
        $update_config = "UPDATE iMedrix_administration.users_config SET notification_enabled = '" . $json['notification_enabled'] . "', is_thirdparty_doctor = '" . $json['is_thirdparty_doctor'] . "', canRegister = '" . $json['canRegister'] . "', canUpdatedetails = '" . $json['canEditRegistration'] . "', canAddVisit = '" . $json['canAddVisit'] . "', showVitals = '" . $json['vital'] . "', showSymp = '" . $json['hisSymp'] . "', showLab = '" . $json['lab'] . "', showMed = '" . $json['med'] . "', showAddressEffects = '" . $json['addeff'] . "', showGlobaImp = '" . $json['globalimpress'] . "', ecgTool = '" . $json['ecgTool'] . "', otherReport = '" . $json['otherReport'] . "', jssRehab = '" . $json['jssRehab'] . "', signature = '" . $json['signature'] . "', exacta = '" . $json['exacta'] . "', sunUser = '" . $json['sunuser'] . "' where user_id = $log_id ";

        $exe_config = mysqli_query($conn, $update_config);

        $doc_sql = "UPDATE iMedrix_administration.doctor_details SET   speciality = '" . $json['speciality'] . "', markas_delete= '" . $json['markas_delete'] . "', phone_no = '" . $json['doctor_phone'] . "', view = '" . $json['view'] . "', comment = '" . $json['comment'] . "', forward = '" . $json['forward'] . "', closure = '" . $json['closure'] . "' where id = '" . $json['doctor_id'] . "' ";
        
        $update_res = mysqli_query($conn, $doc_sql);

        $message = 'Details are not updated Successfully';

    }
    if ($update_res && $exe_config) {

        $resultArray = array(
            'Result' => 'Success',
            'Response' => 'Details updated successfully',
        );
    } else {
        $resultArray = array(
            'Result' => 'failure',
            'Response' => $message,
        );
    }

} else {
    $resultArray = array(
        'Result' => 'failure',
        'Response' => 'Bad request please use post method',
    );
}

echo json_encode($resultArray);
