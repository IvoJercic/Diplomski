const axios = require("axios")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")//Skriva osobne varijable
dotenv.config({ path: "config.env" })
const PORT = process.env.PORT || 8080
var User = require("../model/user")
var Class = require("../model/class")
var auth = require("../controller/authController")
exports.homeRoutes = (req, res) => {
    res.render("index")

}

exports.login = (req, res) => {
    res.render("login")
}

exports.add_Class = (req, res) => {
    res.render("add_class")
}

exports.add_User = (req, res) => {
    //    res.render("myClasses", { classes: response.data.filter(function (p) { return p.admin == logedUserId }) })
    let myClasses = []
    axios.get(`http://localhost:${PORT}/api/classes`)
        .then(function (response) {
            const cookie = req.cookies;
            const logedUserId = cookie["id"]

            myClasses = response.data.filter(function (p) { return p.admin == logedUserId })

            //Nije bas najpravilnije ali mi je bilo najjednostavnije ovako to 
            User.findById(logedUserId)
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Not found user with id " + id });
                    }
                    else {
                        res.render("add_user", { logedUser: data, myClasses: myClasses })
                    }
                })
                .catch(err => {
                    res.status(500).send({ message: "Not found with id " + id })
                })


        })
        .catch(err => {
            res.send(error);
        })




}

exports.update_User = (req, res) => {
    axios.get(`http://localhost:${PORT}/api/users`, { params: { id: req.query.id } })
        .then(function (userdata) {
            //console.log(userdata.data);
            const cookie = req.cookies;
            const logedUserId = cookie["id"]

            //Nije bas najpravilnije ali mi je bilo najjednostavnije ovako to 
            User.findById(logedUserId)
                .then(data => {
                    if (!data) {
                        res.status(404).send({ message: "Not found user with id " + id });
                    }
                    else {
                        //Nije bas najpravilnije ali mi je bilo najjednostavnije ovako to 
                        Class.find()
                            .then(data2 => {
                                if (!data2) {
                                    res.status(404).send({ message: "Not found user with id " + id });
                                }
                                else {
                                    console.log(userdata.data["classId"]); //ID MOG RAZREDA
                                    console.log(data2.name); //IME MOG RAZREDA
                                    
                                    
                                    res.render("update_user", { user: userdata.data, logedUser: data ,myClassId:userdata.data["classId"],allClassess:data2})
                                }
                            })
                            .catch(err => {
                                res.status(500).send({ message: "Not found with id " + id })
                            })
                    }
                })
                .catch(err => {
                    res.status(500).send({ message: "Not found with id " + id })
                })
        })
        .catch(err => {
            res.send(err);
        })
}

exports.getAnswers = (req, res) => {
    console.log("SALJEM: " + req.query.class);

    axios.get(`http://localhost:${PORT}/api/getAnswersByClass`, { params: { class: req.query.class } })
        .then(function (userdata) {
            console.log("USERDATA");
            let temp="";
            userdata.data.forEach(element => {
                temp+="<option id='"+element.classId+"'>"+element.answer+"</option>";
            });
            //res.render("/games",{users:userdata.data} )
        })
        .catch(err => {
            res.send(err);
        })
}

exports.view_classrom = (req, res) => {
    console.log("SALJEM: " + req.query.class);

    axios.get(`http://localhost:${PORT}/api/studentsByClass`, { params: { class: req.query.class } })
        .then(function (userdata) {
            res.render("view_classroom", { users: userdata.data })
        })
        .catch(err => {
            res.send(err);
        })
}


exports.augmentedReality = (req, res) => {
    //Kopiran niz iz AR ROUtES, vodit konta da su identicni
    const arrayOfAnimals = ["bear", "tiger", "crocodile", "deer", "boar", "ibex", "scorpion", "frog", "wolf", "octopus", "shark", "penguin", "gorilla", "goose", "rabbit", "salmon", "zebra", "eagle"]
    const croatianNames=["Smeđi medvjed","Tigar","Krokodil","Jelen","Vepar","Kozorog","Škorpion","Žaba","Vuk","Hobotnica","Morski pas","Pingvin","Gorila","Guska","Zec","Losos","Zebra","Orao"]


    res.render("augmented_reality",{arrayOfAnimals:arrayOfAnimals,croatianNames:croatianNames})

}


exports.menuRoutes = (req, res) => {
    const cookie = req.cookies;
    const logedUserId =  cookie["id"]

    User.findById(logedUserId)
    .then(data => {
        if (!data) {
            res.status(404).send({ message: "Not found user with id " + id });
        }
        else {
            res.render("menu",{logedUser: data})

        }
    })
    .catch(err => {
        res.status(500).send({ message: "Not found with id " + id })
    })

}

exports.arRoutes = (req, res) => {
    const header = `
    <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>
    <script src="https://cdn.rawgit.com/jeromeetienne/AR.js/1.6.2/aframe/build/aframe-ar.js"></script>`;

    const animal = req.params.animal;

    const arrayOfAnimals = ["bear", "tiger", "crocodile", "deer", "boar", "ibex", "scorpion", "frog", "wolf", "octopus", "shark", "penguin", "gorilla", "goose", "rabbit", "salmon", "zebra", "eagle"]
    const arrayOfScales = ["0.8 0.8 0.8", "0.0009 0.0009 0.0009", "0.5 0.5 0.5", "0.02 0.02 0.02", "0.6 0.6 0.6", "1 1 1", "0.4 0.4 0.4", "0.1 0.1 0.1", "1.5 1.5 1.5", "0.7 0.7 0.7", "0.4 0.4 0.4", "0.5 0.5 0.5", "0.009 0.009 0.009", "0.3 0.3 0.3", "0.1 0.1 0.1", "0.5 0.5 0.5", "0.1 0.1 0.1", "0.8 0.8 0.8"]
    const arrayOfLinks = [
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fbear.glb?v=1621161897469",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Ftiger.glb?v=1621160544453",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fcrocodile.glb?v=1621157367034",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fdeer.glb?v=1621157416484",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fboar.glb?v=1621157256338",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fibex.glb?v=1621157460033",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fscorpion.glb?v=1621156884508",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Ffrog.glb?v=1621156900020",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fwolf.glb?v=1621160720536",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Foctopus.glb?v=1621157620023",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fshark.glb?v=1621156953180",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fpenguin.glb?v=1621157000645",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fgorilla.glb?v=1621157000645",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fgoose.glb?v=1621156921353",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Frabbit.glb?v=1621156921353",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fsalomon.glb?v=1621156976438",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Fzebra.glb?v=1621156921353",
        "https://cdn.glitch.com/dd0cbf11-771d-4700-adc6-d92d45789a4e%2Feagle.glb?v=1621166389183"
    ]

    let tempIndex = arrayOfAnimals.indexOf(animal);
    let scale = arrayOfScales[tempIndex]
    let link = arrayOfLinks[tempIndex]

    let HTML = header + `<body style="margin: Opx; overflow: hidden;">
    <a-scene embedded arjs>
      <a-marker preset="hiro">
          <a-entity
          id="a-entity"
          position="0 0 0"
          scale="`+ scale + `" gltf-model="` + link + `"></a-entity>
          </a-marker>
          <a-entity camera></a-entity>
        </a-scene>  
      </body>`


    res.send(HTML)
}


exports.myUsers = (req, res) => {
    axios.get(`http://localhost:${PORT}/api/users`)
        .then(function (response) {
            const cookie = req.cookies;
            const logedUserId =  cookie["id"]

            res.render("myUsers", { users: response.data.filter(function (p) { return p.createdBy == logedUserId }) })
        })
        .catch(err => {
            res.send(error);
        })
}

exports.myClasses = (req, res) => {
    axios.get(`http://localhost:${PORT}/api/classes`)
        .then(function (response) {
            const cookie = req.cookies;
            const logedUserId = cookie["id"]

            res.render("myClasses", { classes: response.data.filter(function (p) { return p.admin == logedUserId }) })
        })
        .catch(err => {
            res.send(error);
        })
}

exports.games = (req, res) => {
    const cookie = req.cookies;
    const logedUserId = cookie["id"]
    console.log("EVO OD:"+logedUserId);

    axios.get(`http://localhost:${PORT}/api/getAnswers/${logedUserId}`)
        .then(function (response) {
            console.log("ODGOVOR JEEEE:"+response.data);

            Class.find({"admin":logedUserId})
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id });
                }
                else {
                    // console.log("SVI RAZ:");
                    console.log("VESAD");
                    
                     console.log(response.data);
                    
                    
                    res.render("games", { answers: response.data.answerObject ,answersShortInfo:response.data.myAnswers,classes:data})
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Not found with id " + id })
            })

        })
        .catch(err => {
            res.send(error);
        })



}

