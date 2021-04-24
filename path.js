app.post('/nagaprasath', (req,res)=>{

    if (req.method === 'POST') {
        // $entityBody = file_get_contents('php://input');
        let json = req.body;

        let get_hosp = "SELECT * FROM iMedrix_administration.hospital_details where hospital_code = '" + json['hospital_code'] + "'";
        let h_id;
        mysqlConnection.connect(function(err) {
            mysqlConnection.query(get_hosp, function (err, row_hosp, fields) {
                if (err) throw err;
                // console.log(row_hosp[0]);
                h_id = row_hosp[0].id;
                // console.log(h_id);
            })
        });
        // $exe = mysqli_query($conn, $get_hosp);
        // $row_hosp = mysqli_fetch_assoc($exe);
        // $h_id = $row_hosp['id'];

        if (json['type'] == 'operator') {

            let check = "SELECT td.id as tech_id, ul.id as log_id FROM iMedrix_administration.users_login as ul,iMedrix_administration.technicians_details as td  where td.emailid = ul.email_id and (td.emailid = '" + json['emailid'] + "' or ul.user_name = '"+json['username']+"') and ul.user_type = 'TC'";
            let check_res;
            mysqlConnection.connect(function(err) {
                mysqlConnection.query(check, function (err, response) {
                    if (err) throw err;
                    // console.log(row_hosp[0]);
                    check_res=response;
                    console.log("Check Result :",check_res);
                    // console.log(h_id);
                })
            });
            // mysqli_query($conn, $check);
            if (check_res.length == 0) {

                let password = json['password'];

                const encryptedPassword = await bcrypt.hash(password, 10);

                let users = {
                    "user_type":'TC',
                    "email_id" : json['email_id'],
                    "user_name" :json['user_name'],
                    "password" : encryptedPassword,
                    "last_password1" :encryptedPassword,
                    "last_password2" : encryptedPassword,
                    "last_password3" : encryptedPassword
                };

                let insert_op = "INSERT INTO iMedrix_administration.technicians_details  (full_name, emailid, mobile,cityname, city_classification, qualification, speciality, role, region) VALUES ('" + json['name'] + "','" + json['emailid'] + "','" + json['mobile'] + "', '" + json['cityname'] + "',  '" + json['city_classification'] + "',  '" + json['qualification'] + "',  '" + json['speciality'] + "', '" + json['role'] + "','" + json['region'] + "') ";
                // $result = mysqli_query($conn, $insert_op);

                let result;

                mysqlConnection.connect(function(err) {
                    mysqlConnection.query(insert_op, function (err, response) {
                        if (err) throw err;
                        // console.log(row_hosp[0]);
                        result=response;
                        console.log("Insert OP :",result);
                        // console.log(h_id);
                    })
                });


                let insert_ul = "INSERT INTO iMedrix_administration.users_login (user_type, email_id, user_name, password, last_password1, last_password2, last_password3) VALUES ('TC', '" + json['emailid'] + "', '" + json['username'] + "', '"+encryptedPassword+"','"+encryptedPassword+"','"+encryptedPassword+"','"+encryptedPassword+"') ";
                let exe_ul;
                // = mysqli_query($conn, $insert_ul);

                mysqlConnection.connect(function(err) {
                    mysqlConnection.query(insert_ul, function (err, response) {
                        if (err) throw err;
                        // console.log(row_hosp[0]);
                        exe_ul=response;
                        console.log("Insert UL :",exe_ul);
                        // console.log(h_id);
                    })
                });


                let login = "SELECT td.id as tech_id, ul.id as log_id FROM iMedrix_administration.users_login as ul,iMedrix_administration.technicians_details as td  where td.emailid = ul.email_id and td.emailid = '" + json['emailid'] + "'";
                let exe_get;
                mysqlConnection.connect(function(err) {
                    mysqlConnection.query(login, function (err, response) {
                        if (err) throw err;
                        // console.log(row_hosp[0]);
                        exe_get=response;
                        console.log("Insert EXE GET :",exe_get);
                        // console.log(h_id);
                    })
                });
                //  = mysqli_query($conn, $login);
                // $row_log = mysqli_fetch_assoc($exe_get);
                let log_id = exe_get['log_id'];
                let tech_id = exe_get['tech_id'];

                let insert_hosp_map = "INSERT INTO iMedrix_administration.hospital_technicians (operator_id, hospital_code, user_id) VALUES ("+tech_id+","+h_id+","+log_id+")";

                let insert_uc = "INSERT INTO iMedrix_administration.users_config (cloud_enabled, ecg_type, user_id, user_type, is_admin, sample_freequency, loglevel,  sync, session_time, thermal_printer, user_usage_type, spot_moniter, name_enabled, age_enabled, mobile_enabled, QR_code_enabled, mode, is_pdf_sync, country_code, pdfProtect, showPDFtp, skipSVscreen, canRegister, canUpdatedetails, canAddVisit, showVitals, showSymp, showLab, showMed, showAddressEffects, showGlobaImp, ecgTool, otherReport, jssRehab, signature, exacta, sunUser) VALUES('" + json['cloud_enabled'] + "', '" + json['ecg_type'] + "', '$log_id', 'TC', '0', '" + json['sample_freequency'] + "', '" + json['loglevel'] + "', '" + json['sync'] + "', '" + json['session_time'] + "', '" + json['thermal_printer'] + "', '" + json['user_usage_type'] + "', '" + json['spot_moniter'] + "', '" + json['name_enabled'] + "', '" + json['age_enabled'] + "', '" + json['mobile_enabled'] + "', '" + json['QR_code_enabled'] + "', '" + json['mode'] + "', '" + json['is_pdf_sync'] + "','" + json['country_code'] + "', '" + json['protPDF'] + "', '" + json['showPDF'] + "', '" + json['showSympt'] + "','" + json['canRegister'] + "', '" + json['canEditRegister'] + "', '" + json['canAddVisit'] + "', '" + json['vital'] + "', '" + json['hisSymp'] + "', '" + json['lab'] + "', '" + json['med'] + "', '" + json['addeff'] + "', '" + json['globalimpress'] + "', '" + json['ecgTool'] + "', '" + json['otherReport'] + "', '" + json['jssRehab'] + "', '" + json['signature'] + "', '" + json['exacta'] + "', '" + json['sunuser'] + "')";

                let exe_uc;

                mysqlConnection.connect(function(err) {
                    mysqlConnection.query(insert_uc, function (err, response) {
                        if (err) throw err;
                        // console.log(row_hosp[0]);
                        exe_uc=response;
                        console.log("Insert UC :",exe_uc);
                        // console.log(h_id);
                    })
                });

                // $exe_uc = mysqli_query($conn, $insert_uc);
            } else {
                // $resultArray = array(
                //     'Result' => 'failure',
                //     'Response' => 'Username or EmailId already exist',
                // );
                let resultArray={
                    "Result":"Failure",
                    "Response":"Username or EmailId already exist"
                };
                console.log("Result Array :",resultArray);
            }

        } else {
            let password = json['password'];

            const encryptedPassword = await bcrypt.hash(password, 10);

            let users = {
                "user_type":'TC',
                "email_id" : json['email_id'],
                "user_name" :json['user_name'],
                "password" : encryptedPassword,
                "last_password1" :encryptedPassword,
                "last_password2" : encryptedPassword,
                "last_password3" : encryptedPassword
            };


            let check_doc = "SELECT d.id as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  (d.emailid = '" + json['doctor_email'] + "' or ul.user_name = '" + json['username'] + "')";
            // $res_doc = mysqli_query($conn, $check_doc);
            let res_doc;
            mysqlConnection.connect(function(err) {
                mysqlConnection.query(check_doc, function (err, response) {
                    if (err) throw err;
                    // console.log(row_hosp[0]);
                    res_doc=response;
                    console.log("Check DOC :",res_doc);
                    // console.log(h_id);
                })
            });


            if (res_doc.length > 0) {
                let i=0;
                let doctor_id;
                let log_id;
                while (i<res_doc.length) {
                    doctor_id = res_doc['doctor_id'];
                    log_id = res_doc['log_id'];
                    i++;
                }
                $check_map = "SELECT * FROM iMedrix_administration.hospital_doctor where doctor_id = '" + doctor_id + "' and hospital_name = "+h_id +"";
                let res_map;
                mysqlConnection.connect(function(err) {
                    mysqlConnection.query(check_map, function (err, response) {
                        if (err) throw err;
                        // console.log(row_hosp[0]);
                        res_map=response;
                        console.log("Check RESMAP :",res_map);
                        // console.log(h_id);
                    })
                });
                // $res_map = mysqli_query($conn, $check_map);
                if (res_map.length == 0) {
                    let insert_map = "INSERT INTO iMedrix_administration.hospital_doctor (doctor_id,user_id, hospital_code) VALUES ("+doctor_id+","+ log_id+"," +h_id+")";

                    let result;
                    mysqlConnection.connect(function(err) {
                        mysqlConnection.query(insert_map, function (err, response) {
                            if (err) throw err;
                            // console.log(row_hosp[0]);
                            result=response;
                            console.log("Check RESMAP :",result);
                            // console.log(h_id);
                        })
                    });
                    // result = mysqli_query($conn, $insert_map);
                } else {
                    let message = 'doctor emaild already exists for this hospital';
                }
            } else {
                let check_doc = "SELECT d.id as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  (d.emailid = '" + json['doctor_email'] + "' or ul.user_name = '" + json['username'] + "')";
                let res_doc;
                mysqlConnection.connect(function(err) {
                    mysqlConnection.query(check_doc, function (err, response) {
                        if (err) throw err;
                        // console.log(row_hosp[0]);
                        res_doc=response;
                        console.log("Check RESMAP :",res_doc);
                        // console.log(h_id);
                    })
                });
                // $res_doc = mysqli_query($conn, $check_doc);
                if (res_doc.length == 0) {

                    let doctor_query = "INSERT INTO iMedrix_administration.doctor_details (firstname, lastname, emailid,speciality, phone_no, view, comment, forward, closure) VALUES ('" + json['doctor_name'] + "','" + json['lastname'] + "', '" + json['doctor_email'] + "', '" + json['speciality'] + "','" + json['doctor_phone'] + "', '" + json['view'] + "','" + json['comment'] + "','" + json['forward'] + "','" + json['closure'] + "') ";
                    let result_doc;
                    mysqlConnection.connect(function(err) {
                        mysqlConnection.query(doctor_query, function (err, response) {
                            if (err) throw err;
                            // console.log(row_hosp[0]);
                            result_doc=response;
                            console.log("Doctor Query :",result_doc);
                            // console.log(h_id);
                        })
                    });
                    // $result_doc = mysqli_query($conn, $doctor_query); //or die("Error in Selecting doc " .$result_doc. mysqli_error($conn));
                    if (result_doc) {
                        let insert_ul = "INSERT INTO iMedrix_administration.users_login (user_type, email_id, user_name, password, last_password1, last_password2, last_password3) VALUES ('DR', '" + json['doctor_email'] + "', '" + json['username'] + "', '"+encryptedPassword+"','"+encryptedPassword+"','"+encryptedPassword+"','"+encryptedPassword+"') ";
                        let exe_ul;
                        mysqlConnection.connect(function(err) {
                            mysqlConnection.query(insert_ul, function (err, response) {
                                if (err) throw err;
                                // console.log(row_hosp[0]);
                                exe_ul=response;
                                console.log("Insert UL :",exe_ul);
                                // console.log(h_id);
                            })
                        });
                        // $exe_ul = mysqli_query($conn, $insert_ul);

                        let check_doc = "SELECT d.id as doctor_id, ul.id as log_id FROM iMedrix_administration.doctor_details as d,iMedrix_administration.users_login as ul  where d.emailid = ul.email_id and  d.emailid = '" + json['doctor_email'] + "' ";
                        // $res_doc = mysqli_query($conn, $check_doc);
                        let res_doc;
                        mysqlConnection.connect(function(err) {
                            mysqlConnection.query(check_doc, function (err, response) {
                                if (err) throw err;
                                // console.log(row_hosp[0]);
                                res_doc=response;
                                console.log("Check DOC :",res_doc);
                                // console.log(h_id);
                            })
                        });

                        if (res_doc.length > 0) {
                            let i=0;
                            let doctor_id;
                            let log_id;
                            while (i<res_doc.length) {
                                doctor_id = res_doc['doctor_id'];
                                log_id = res_doc['log_id'];
                                i++;
                            }
                        }
                    }
                    let insert_map = "INSERT INTO iMedrix_administration.hospital_doctor (doctor_id,user_id, hospital_code) VALUES ("+doctor_id+","+log_id+","+h_id+")";
                    let result;
                    mysqlConnection.connect(function(err) {
                        mysqlConnection.query(insert_map, function (err, response) {
                            if (err) throw err;
                            // console.log(row_hosp[0]);
                            result=response;
                            console.log("Insert Map :",result);
                            // console.log(h_id);
                        })
                    });
                    // let result = mysqli_query($conn, $insert_map);

                    let insert_uc = "INSERT INTO iMedrix_administration.users_config (user_type,notification_enabled, user_id, is_thirdparty_doctor, canRegister, canUpdatedetails, canAddVisit, showVitals, showSymp, showLab, showMed, showAddressEffects, showGlobaImp, ecgTool, otherReport, jssRehab, signature, exacta, sunUser) VALUES ('DR','" + json['notification_enabled'] + "', $log_id, '" + json['is_thirdparty_doctor'] + "', '" + json['canRegister'] + "', '" + json['canEditRegister'] + "', '" + json['canAddVisit'] + "', '" + json['vital'] + "', '" + json['hisSymp'] + "', '" + json['lab'] + "', '" + json['med'] + "', '" + json['addeff'] + "', '" + json['globalimpress'] + "', '" + json['ecgTool'] + "', '" + json['otherReport'] + "', '" + json['jssRehab'] + "', '" + json['signature'] + "', '" + json['exacta'] + "', '" + json['sunuser'] + "')";
                    let exe_uc;
                    mysqlConnection.connect(function(err) {
                        mysqlConnection.query(insert_uc, function (err, response) {
                            if (err) throw err;
                            // console.log(row_hosp[0]);
                            exe_uc=response;
                            console.log("Insert Map :",exe_uc);
                            // console.log(h_id);
                        })
                    });
                    // $exe_uc = mysqli_query($conn, $insert_uc);
                } else {
                    // let resultArray = array(
                    //     'Result' => 'failure',
                    //     'Response' => 'Email already exists',
                    // );
                    let resultArray={
                        "Result":"Failure",
                        "Response":"Email Already Exists"
                    };
                }
            }

        }
        if (result) {
            // $resultArray = array(
            //     'Result' => 'Success',
            //     'Response' => 'Details added successfully',
            // );
            let resultArray={
                "Result":"Success",
                "Response":"Details Added Successfully"
            };
        } else {
            // $resultArray = array(
            //     'Result' => 'failure',
            //     'Response' => 'Useranme or EmailId already exists',
            // );
            let resultArray={
                "Result":"Failure",
                "Response":"Username or Emailed already exists"
            };

        }
    } else {
        // $resultArray = array(
        //     'Result' => 'failure',
        //     'Response' => 'Bad request please use post method',
        // );
        let resultArray={
            "Result":"Failure",
            "Response":"Bad Request Please use post method"
        };

    }
    // echo json_encode($resultArray);

    })
