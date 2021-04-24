app.post('/nagaprasath', (req,res)=>{

    if (req.method === 'POST') {
        // $entityBody = file_get_contents('php://input');
        let json = req.body;
    
        let get_hosp = "SELECT * FROM iMedrix_administration.hospital_details where hospital_code = '" + json['hospital_code'] + "'";
        mysqlConnection.connect(function(err) {
            var sql = "SELECT id FROM iMedrix_administration.hospital_details where hospital_code = '"+hospital_code+"' ";
            console.log(sql);
            mysqlConnection.query(sql, function (err, rowsb, fields) {
                if (err) throw err;
                console.log(rowsb[0]); 
                h_id = rowsb[0].id;
                console.log(h_id);
                res.send(rowsb);
    
            })
        });
        $exe = mysqli_query($conn, $get_hosp);
        $row_hosp = mysqli_fetch_assoc($exe);
        $h_id = $row_hosp['id'];
    
        if ($json['type'] == 'operator') {
    
            $check = "SELECT td.id as tech_id, ul.id as log_id FROM iMedrix_administration.users_login as ul,iMedrix_administration.technicians_details as td  where td.emailid = ul.email_id and (td.emailid = '" . $json['emailid'] . "' or ul.user_name = '".$json['username']."') and ul.user_type = 'TC'";
            $check_res = mysqli_query($conn, $check);
            if (mysqli_num_rows($check_res) == 0) {
    
                $password = md5($json['password']);
    
                $insert_op = "INSERT INTO iMedrix_administration.technicians_details  (full_name, emailid, mobile,cityname, city_classification, qualification, speciality, role, region) VALUES ('" . $json['name'] . "','" . $json['emailid'] . "','" . $json['mobile'] . "', '" . $json['cityname'] . "',  '" . $json['city_classification'] . "',  '" . $json['qualification'] . "',  '" . $json['speciality'] . "', '" . $json['role'] . "','" . $json['region'] . "') ";
                $result = mysqli_query($conn, $insert_op);
    
                $insert_ul = "INSERT INTO iMedrix_administration.users_login (user_type, email_id, user_name, password, last_password1, last_password2, last_password3) VALUES ('TC', '" . $json['emailid'] . "', '" . $json['username'] . "', '$password','$password','$password','$password') ";
                $exe_ul = mysqli_query($conn, $insert_ul);
    
                $login = "SELECT td.id as tech_id, ul.id as log_id FROM iMedrix_administration.users_login as ul,iMedrix_administration.technicians_details as td  where td.emailid = ul.email_id and td.emailid = '" . $json['emailid'] . "'";
                $exe_get = mysqli_query($conn, $login);
                $row_log = mysqli_fetch_assoc($exe_get);
                $log_id = $row_log['log_id'];
                $tech_id = $row_log['tech_id'];
    
                $insert_hosp_map = "INSERT INTO iMedrix_administration.hospital_technicians (operator_id, hospital_code, user_id) VALUES ($tech_id,$h_id, $log_id)";
    
                $insert_uc = "INSERT INTO iMedrix_administration.users_config (cloud_enabled, ecg_type, user_id, user_type, is_admin, sample_freequency, loglevel,  sync, session_time, thermal_printer, user_usage_type, spot_moniter, name_enabled, age_enabled, mobile_enabled, QR_code_enabled, mode, is_pdf_sync, country_code, pdfProtect, showPDFtp, skipSVscreen, canRegister, canUpdatedetails, canAddVisit, showVitals, showSymp, showLab, showMed, showAddressEffects, showGlobaImp, ecgTool, otherReport, jssRehab, signature, exacta, sunUser) VALUES('" . $json['cloud_enabled'] . "', '" . $json['ecg_type'] . "', '$log_id', 'TC', '0', '" . $json['sample_freequency'] . "', '" . $json['loglevel'] . "', '" . $json['sync'] . "', '" . $json['session_time'] . "', '" . $json['thermal_printer'] . "', '" . $json['user_usage_type'] . "', '" . $json['spot_moniter'] . "', '" . $json['name_enabled'] . "', '" . $json['age_enabled'] . "', '" . $json['mobile_enabled'] . "', '" . $json['QR_code_enabled'] . "', '" . $json['mode'] . "', '" . $json['is_pdf_sync'] . "','" . $json['country_code'] . "', '" . $json['protPDF'] . "', '" . $json['showPDF'] . "', '" . $json['showSympt'] . "','" . $json['canRegister'] . "', '" . $json['canEditRegister'] . "', '" . $json['canAddVisit'] . "', '" . $json['vital'] . "', '" . $json['hisSymp'] . "', '" . $json['lab'] . "', '" . $json['med'] . "', '" . $json['addeff'] . "', '" . $json['globalimpress'] . "', '" . $json['ecgTool'] . "', '" . $json['otherReport'] . "', '" . $json['jssRehab'] . "', '" . $json['signature'] . "', '" . $json['exacta'] . "', '" . $json['sunuser'] . "')";
                $exe_uc = mysqli_query($conn, $insert_uc);
            } else {
                $resultArray = array(
                    'Result' => 'failure',
                    'Response' => 'Username or EmailId already exist',
                );
            }
    
        } else {
            $password = md5($json['password']);
            $check_doc = "SELECT d.id as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  (d.emailid = '" . $json['doctor_email'] . "' or ul.user_name = '" . $json['username'] . "')";
            $res_doc = mysqli_query($conn, $check_doc);
            if (mysqli_num_rows($res_doc) > 0) {
                while ($row_doc = mysqli_fetch_assoc($res_doc)) {
                    $doctor_id = $row_doc['doctor_id'];
                    $log_id = $row_doc['log_id'];
                }
                $check_map = "SELECT * FROM iMedrix_administration.hospital_doctor where doctor_id = '" . $doctor_id . "' and hospital_name = $h_id ";
                $res_map = mysqli_query($conn, $check_map);
                if (mysqli_num_rows($res_map) == 0) {
                    $insert_map = "INSERT INTO iMedrix_administration.hospital_doctor (doctor_id,user_id, hospital_code) VALUES ($doctor_id, $log_id, $h_id)";
                   
                    $result = mysqli_query($conn, $insert_map);
                } else {
                    $message = 'doctor emaild already exists for this hospital';
                }
            } else {
                $check_doc = "SELECT d.id as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  (d.emailid = '" . $json['doctor_email'] . "' or ul.user_name = '" . $json['username'] . "')";           
                $res_doc = mysqli_query($conn, $check_doc);
                if (mysqli_num_rows($res_doc) == 0) {
    
                    $doctor_query = "INSERT INTO iMedrix_administration.doctor_details (firstname, lastname, emailid,speciality, phone_no, view, comment, forward, closure) VALUES ('" . $json['doctor_name'] . "','" . $json['lastname'] . "', '" . $json['doctor_email'] . "', '" . $json['speciality'] . "','" . $json['doctor_phone'] . "', '" . $json['view'] . "','" . $json['comment'] . "','" . $json['forward'] . "','" . $json['closure'] . "') ";
                    $result_doc = mysqli_query($conn, $doctor_query); //or die("Error in Selecting doc " .$result_doc. mysqli_error($conn));
                    if ($result_doc) {
                        $insert_ul = "INSERT INTO iMedrix_administration.users_login (user_type, email_id, user_name, password, last_password1, last_password2, last_password3) VALUES ('DR', '" . $json['doctor_email'] . "', '" . $json['username'] . "', '$password','$password','$password','$password') ";
                        $exe_ul = mysqli_query($conn, $insert_ul);
    
                        $check_doc = "SELECT d.id as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  d.emailid = '" . $json['doctor_email'] . "' ";
                        $res_doc = mysqli_query($conn, $check_doc);
                        
                        if (mysqli_num_rows($res_doc) > 0) {
                            while ($row_doc = mysqli_fetch_assoc($res_doc)) {
                                $doctor_id = $row_doc['doctor_id'];
                                $log_id = $row_doc['log_id'];
                            }
                        }
                    }
                    $insert_map = "INSERT INTO iMedrix_administration.hospital_doctor (doctor_id,user_id, hospital_code) VALUES ($doctor_id, $log_id, $h_id)";
                    $result = mysqli_query($conn, $insert_map);
    
                    $insert_uc = "INSERT INTO iMedrix_administration.users_config (user_type,notification_enabled, user_id, is_thirdparty_doctor, canRegister, canUpdatedetails, canAddVisit, showVitals, showSymp, showLab, showMed, showAddressEffects, showGlobaImp, ecgTool, otherReport, jssRehab, signature, exacta, sunUser) VALUES ('DR','" . $json['notification_enabled'] . "', $log_id, '" . $json['is_thirdparty_doctor'] . "', '" . $json['canRegister'] . "', '" . $json['canEditRegister'] . "', '" . $json['canAddVisit'] . "', '" . $json['vital'] . "', '" . $json['hisSymp'] . "', '" . $json['lab'] . "', '" . $json['med'] . "', '" . $json['addeff'] . "', '" . $json['globalimpress'] . "', '" . $json['ecgTool'] . "', '" . $json['otherReport'] . "', '" . $json['jssRehab'] . "', '" . $json['signature'] . "', '" . $json['exacta'] . "', '" . $json['sunuser'] . "')";
                    $exe_uc = mysqli_query($conn, $insert_uc);
                } else {
                    $resultArray = array(
                        'Result' => 'failure',
                        'Response' => 'Email already exists',
                    );
                }
            }
    
        }
        if ($result) {
            $resultArray = array(
                'Result' => 'Success',
                'Response' => 'Details added successfully',
            );
        } else {
            $resultArray = array(
                'Result' => 'failure',
                'Response' => 'Useranme or EmailId already exists',
            );
    
        }
    } else {
        $resultArray = array(
            'Result' => 'failure',
            'Response' => 'Bad request please use post method',
        );
    
    }
    echo json_encode($resultArray);
    
    })
    