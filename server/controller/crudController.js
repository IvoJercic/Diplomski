var Userdb = require("../model/user")
const cookieParser = require("cookie-parser")
var Answer = require("../model/answer")
var Classes = require("../model/class")

//Stvara novog usera
exports.create = (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty !" });
        return;
    }

    //Stvaranje novog usera
    const user = new Userdb({
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        status: req.body.status
    })
    //console.log("SPREMAMO OVO: "+user);


    //Spremanje novog usera u bazu
    user
        .save(user)
        .then(data => {
            //res.send(data)
            res.redirect("/add-user");
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating a create operation"
            })
        })
}

//Dohvaca sve usere
exports.find = (req, res) => {

    if (req.query.id) {
        const id = req.query.id;
        //console.log("OVO JE ID: "+id);       

        Userdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found with id " + id });
                }
                else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Not found with id " + id })
            })
    }
    else {
        Userdb.find()
            .then(user => {
                res.send(user);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occured while retriving user operation"
                })
            })
    }
}

//Dohvaca sve razrede
exports.findClasses = (req, res) => {

    if (req.query.id) {
        const id = req.query.id;
        //console.log("OVO JE ID: "+id);       

        Classes.find()
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found with id " + id });
                }
                else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Not found with id " + id })
            })
    }
    else {
        Classes.find()
            .then(classs => {
                res.send(classs);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occured while retriving user operation"
                })
            })
    }
}


exports.findStudentsByClass = (req, res) => {
    let temp = '"' + req.query.class + '"';


    Userdb.find({ "classId": req.query.class })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: "Students not found" });
            }
            else {
                res.send(data)
                console.log(data);

            }
        })
        .catch(err => {
            res.status(500).send({ message: "Not found" })
        })
}


//Azurira usera
exports.update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(data);
                //res.redirect("/index")
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
}

//Brise korisnika
exports.delete = (req, res) => {
    //console.log("BRISEM...");

    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                res.send({
                    message: "User was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

//Brise razred
exports.deleteClass = (req, res) => {
    //console.log("BRISEM...");

    const id = req.params.id;

    Classes.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                res.send({
                    message: "Class was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete class with id=" + id
            });
        });
}

exports.addAnswer = (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({ message: "Content can not be empty !" });
        return;
    }

    //Stvaranje novog usera
    const answer = new Answer({
        user: req.body.user,
        answer: req.body.answer,
        classId:req.body.classId
        
    })
    console.log("SPREMAMO OVO: " + answer);


    //Spremanje novog usera u bazu
    answer
        .save(answer)
        .then(data => {
            //res.send(data)
            console.log("SPREMLJENO");

            res.redirect("/menu");
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating a create operation"
            })
        })

}


exports.getAnswers = (req, res) => {
    const id = req.params.id;


    let myUsers = [];
    let myUsersId = []
    Userdb.find({"createdBy":id})
        .then(data => {
            //console.log(data);
            data.forEach(element => {
                myUsers.push(element);
                myUsersId.push(element._id)
            });

            let myAnswers = [];

            let answerObject;            
            Answer.find({ "user": { $in: myUsersId } })
                .then(data => {
                    answerObject=data;
                    data.forEach(element => {
                        myAnswers.push({
                            answer: element.answer,
                            user: myUsers.find(obj => {
                                return String(obj._id) == element.user
                            }).name
                        });
                    });

                    //console.log("SVI ODGOVORI: "+myAnswers);
                    myAnswers.forEach(element => {
                        //console.log("UREDENI ODGOVOIR:"+element.user);
                    });

                    let sending={answerObject:answerObject,myAnswers:myAnswers};
                    console.log("IZ CONTROLLERA SALJEM: "+sending.answerObject);
                    


                    res.json({answerObject:answerObject,myAnswers:myAnswers});

                })
                .catch(err => {
                    res.status(500)
                })

        })
        .catch(err => {
            res.status(500)
        })
}

