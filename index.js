const mysql = require('mysql');
const bcrypt = require('bcrypt');
const express = require('express');
const app  = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'106.51.126.124',
    user:'root',
    password:'grant123',
    database:'iMedrix_administration',
});

mysqlConnection.connect((err) =>{
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error :'+JSON.stringify(err, undefined, 2));
});

app.listen(3000,()=>console.log('Express is running at port no : 3000'));


//to get the technician detail:
app.get('/tech/:code', (req,res)=>{
    mysqlConnection.query("SELECT hd.hospital_code, hd.hospital_name, td.id as operator_id,td.mobile, ul.email_id, ul.user_name, uc.cloud_enabled, uc.reporting_required, uc.ecg_type, uc.session_time, uc.sync, uc.loglevel,uc.session_time, uc.sample_freequency, uc.thermal_printer, uc.terms_condition, td.markas_delete,uc.user_usage_type, uc.spot_moniter,name_enabled, age_enabled, mobile_enabled, uc.QR_code_enabled, uc.country_code, uc.last_reset_password_time,uc.mode,uc.is_pdf_sync, td.cityname, td.city_classification, td.qualification, td.speciality, td.role, td.region, td.full_name, uc.pdfProtect, uc.showPDFtp as showPDF, uc.skipSVscreen as showSympt,uc.is_admin,uc.canRegister,uc.canUpdatedetails, uc.canAddVisit, uc.showVitals, uc.showSymp, uc.showLab, uc.showMed, uc.showAddressEffects, uc.showGlobaImp, uc.ecgTool, uc.otherReport, uc.jssRehab, uc.signature, uc.exacta, uc.sunUser FROM iMedrix_administration.users_login ul, iMedrix_administration.technicians_details td, iMedrix_administration.hospital_technicians ht, iMedrix_administration.users_config as uc, iMedrix_administration.hospital_details as hd  where ul.email_id = td.emailid and ht.operator_id=td.id and uc.user_id = ul.id and ht.hospital_code = hd.id and hd.hospital_code = ?", [req.params.code],(err, rows, fields)=>{
        if(!err)
        mysqlConnection.query("SELECT dd.id as doctor_id, dd.firstname , dd.lastname, dd.emailid,dd.phone_no, uc.notification_enabled, uc.is_thirdparty_doctor, dd.speciality, uc.canRegister, uc.canUpdatedetails, uc.canAddVisit, uc.showVitals, uc.showSymp, uc.showLab, uc.showMed, uc.showAddressEffects, uc.showGlobaImp, uc.ecgTool, uc.otherReport, uc.jssRehab, uc.signature, uc.exacta, uc.sunUser  from iMedrix_administration.doctor_details dd, iMedrix_administration.hospital_doctor hd, iMedrix_administration.hospital_details as h,  iMedrix_administration.users_login ul,iMedrix_administration.users_config as uc where ul.email_id = dd.emailid and uc.user_id = ul.id and dd.id=hd.doctor_id and hd.hospital_code = h.id  and h.hospital_code= ? group by dd.id ", [req.params.code],(err, rowsd, fields)=>{
            if(!err)
            Operator = rows
            doctor = rowsd
            var a={response: 'success', Operator,
            response: 'success', doctor}
            res.send(a); 
        })
        else
        console.log(err);
    })
       
})

app.post('/prasath', (req,res)=>{
    console.log(req.body)
    console.log(req)
    let hospital_code=req.body.hospital_code;
    let h_id;
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
})


//insert technician detail:
app.post('/techdetail',(req,res)=>{
    var name = req.body.name;
	var emailid = req.body.emailid;
	var mobile = req.body.mobile;
	var cityname = req.body.cityname;
	var city_classification = req.body.city_classification;
	var qualidication = req.body.qualidication;
	var speciality = req.body.speciality;
	var role = req.body.role;
	var region = req.body.region;

    mysqlConnection.connect(function(err) {
        var sql = "INSERT INTO iMedrix_administration.technicians_details  (full_name, emailid, mobile,cityname, city_classification, qualification, speciality, role, region) VALUES ('"+name+"', '"+emailid+"', '"+mobile+"', '"+cityname+"', '"+city_classification+"', '"+qualidication+"', '"+speciality+"', '"+role+"', '"+region+"')";
        mysqlConnection.query(sql, function (err, result) {
            if (err) throw err;
            res.end("1 record inserted")
            res.end();
        }); 
    });
})


//insert  technician userlogin:
app.post('/userlogin', async function(req,res){
    saltRounds = 10;
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, saltRounds)

    let users = {
        "user_type":'TC',
        "email_id" :req.body.email_id,
        "user_name" :req.body.user_name,
        "password" :encryptedPassword,
        "last_password1" :encryptedPassword,
        "last_password2" : encryptedPassword,
        "last_password3" : encryptedPassword
    }
    mysqlConnection.query('INSERT into users_login SET ?',users, function (error, results, fields){
        if (error) {
            res.send({
                "code":400,
                "failed":"error occured",
                "error" : error
            })
        }else{
            res.send({
                "code":200,
                "success" : "user login inserted"
            });
        }
    });
})


//insert  technician userconfig:
app.post('/userconfig',(req,res)=>{
    var cloud_enabled = req.body.cloud_enabled;   
    var ecg_type = req.body.ecg_type;
    var log_id = req.body.log_id;
    var sample_freequency = req.body.sample_freequency;
    var loglevel = req.body.loglevel;
    var sync = req.body.sync;
    var session_time = req.body.session_time;            
    var thermal_printer = req.body.thermal_printer;              
    var user_usage_type = req.body.user_usage_type;                    
    var spot_moniter = req.body.spot_moniter;
    var name_enabled = req.body.name_enabled;
    var age_enabled = req.body.age_enabled; 
    var mobile_enabled = req.body.mobile_enabled;
    var QR_code_enabled = req.body.QR_code_enabled;
    var mode = req.body.mode;
    var is_pdf_sync = req.body.is_pdf_sync;
    var country_code = req.body.country_code;
    var protPDF = req.body.protPDF;
    var showPDF = req.body.showPDF;
    var showSympt = req.body.showPDF;
    var canRegister = req.body.canRegister;           
    var canEditRegister = req.body.canEditRegister; 
    var canAddVisit = req.body.canAddVisit;                          
    var vital = req.body.vital; 
    var hisSymp = req.body.hisSymp;
    var lab = req.body.lab;
    var med = req.body.med;
    var addeff = req.body.addeff;
    var globalimpress = req.body.globalimpress;
    var ecgTool = req.body.ecgTool;
    var otherReport = req.body.otherReport;
    var jssRehab = req.body.jssRehab; 
    var signature = req.body.signature;
    var exacta = req.body.exacta;
    var sunuser = req.body.sunuser;
    mysqlConnection.connect(function(err){
        var sql ="INSERT INTO iMedrix_administration.users_config (cloud_enabled, ecg_type, user_id, user_type, is_admin, sample_freequency, loglevel,  sync, session_time, thermal_printer, user_usage_type, spot_moniter, name_enabled, age_enabled, mobile_enabled, QR_code_enabled, mode, is_pdf_sync, country_code, pdfProtect, showPDFtp, skipSVscreen, canRegister, canUpdatedetails, canAddVisit, showVitals, showSymp, showLab, showMed, showAddressEffects, showGlobaImp, ecgTool, otherReport, jssRehab, signature, exacta, sunUser) VALUES ('"+cloud_enabled+"', '"+ecg_type+"', '"+log_id+"', 'TC', '0' , '"+sample_freequency+"', '"+loglevel+"', '"+sync+"', '"+session_time+"', '"+thermal_printer+"', '"+user_usage_type+"', '"+spot_moniter+"', '"+name_enabled+"', '"+age_enabled+"', '"+mobile_enabled+"', '"+QR_code_enabled+"', '"+mode+"', '"+is_pdf_sync+"', '"+country_code+"', '"+protPDF+"',  '"+showPDF+"', '"+showSympt+"', '"+canRegister+"', '"+canEditRegister+"', '"+canAddVisit+"', '"+vital+"', '"+hisSymp+"', '"+lab+"', '"+med+"', '"+addeff+"', '"+globalimpress+"', '"+ecgTool+"', '"+otherReport+"', '"+jssRehab+"', '"+signature+"', '"+exacta+"', '"+sunuser+"')";
        mysqlConnection.query(sql, function (err, result) {
            if (err) throw err;
            res.end("1 record inserted")
            res.end();
        });
    });
})

//insert doctor details:

app.post('/doctordetails',(req,res)=>{
    var doctor_name = req.body.doctor_name;
    var lastname = req.body.lastname;
    var doctor_email = req.body.doctor_email;
    var speciality = req.body.speciality;
    var doctor_phone = req.body.doctor_phone;
    var view = req.body.view;
    var comment = req.body.comment;
    var forward = req.body.forward;
    var closure = req.body.closure; 
    mysqlConnection.connect(function(err) {
        var sql ="INSERT INTO iMedrix_administration.doctor_details (firstname, lastname, emailid,speciality, phone_no, view, comment, forward, closure) VALUES ('"+doctor_name+"', '"+lastname+"', '"+doctor_email+"', '"+speciality+"', '"+doctor_phone+"', '"+view+"', '"+comment+"', '"+forward+"', '"+closure+"')";
        mysqlConnection.query(sql, function (err, result){
            if (err) throw err;
            res.end("1 record inserted")
            res.end();
        });
    });
})


//insert doctor login:
app.post('/userDRlogin', async function(req,res){
    saltRounds = 10;
    const password = req.body.password;
    const encryptedPassword = await bcrypt.hash(password, saltRounds)

    let users = {
        "user_type":'DR',
        "email_id" :req.body.email_id,
        "user_name" :req.body.user_name,
        "password" :encryptedPassword,
        "last_password1" :encryptedPassword,
        "last_password2" :encryptedPassword,
        "last_password3" :encryptedPassword
    }
    mysqlConnection.query('INSERT into users_login SET ?',users, function (error, results, fields){
        if (error) {
            res.send({
                "code":400,
                "failed":"error occured",
                "error" : error
            })
        }else{
            res.send({
                "code":200,
                "success" : "user login inserted"
            });
        }
    });
})

//insert doctor user config

app.post('/userdoctorconfig',(req,res)=>{
    var notification_enabled = req.body.notification_enabled;   
    var log_id = req.body.log_id;
    var is_thirdparty_doctor = req.body.is_thirdparty_doctor;
    var canRegister = req.body.canRegister;           
    var canEditRegister = req.body.canEditRegister; 
    var canAddVisit = req.body.canAddVisit;                          
    var vital = req.body.vital; 
    var hisSymp = req.body.hisSymp;
    var lab = req.body.lab;
    var med = req.body.med;
    var addeff = req.body.addeff;
    var globalimpress = req.body.globalimpress;
    var ecgTool = req.body.ecgTool;
    var otherReport = req.body.otherReport;
    var jssRehab = req.body.jssRehab; 
    var signature = req.body.signature;
    var exacta = req.body.exacta;
    var sunuser = req.body.sunuser;
    mysqlConnection.connect(function(err){
        var sql ="INSERT INTO iMedrix_administration.users_config (user_type,notification_enabled, user_id, is_thirdparty_doctor, canRegister, canUpdatedetails, canAddVisit, showVitals, showSymp, showLab, showMed, showAddressEffects, showGlobaImp, ecgTool, otherReport, jssRehab, signature, exacta, sunUser) VALUES ('DR','"+notification_enabled+"', '"+log_id+"', '"+is_thirdparty_doctor+"', '"+canRegister+"', '"+canEditRegister+"', '"+canAddVisit+"', '"+vital+"', '"+hisSymp+"', '"+lab+"', '"+med+"', '"+addeff+"', '"+globalimpress+"', '"+ecgTool+"', '"+otherReport+"', '"+jssRehab+"', '"+signature+"', '"+exacta+"', '"+sunuser+"')";
        mysqlConnection.query(sql, function (err, result) {
            if (err) throw err;
            res.end("1 record inserted")
            res.end();
        });
    });
})




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

