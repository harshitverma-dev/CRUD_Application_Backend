const User = require('./../models/userSchema');
const moment = require('moment');
const csv = require('fast-csv');
const fs = require('fs');
const BASE_URL = process.env.BASE_URL 

//posting all form data of user
const userPost = async (req, res) => {
    const { firstName, lastName, email, mobile, gender, status, location } = req.body;
    const file = req.file.filename;

    if (!firstName || !lastName || !email || !mobile || !gender || !status || !location) {
        res.status(401).send('all fields are required');
    }

    try {
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            res.status(404).send('user is already exsist!');
        } else {
            const datecreated = moment(new Date()).format('YYYY-MM-DD hh:mm:ss a');
            const newUserData = new User({
                firstName,
                lastName,
                email,
                mobile,
                gender,
                status,
                profile: file,
                location,
                datecreated
            });

            await newUserData.save((err) => {
                if (err) {
                    res.status(404).json({
                        message: err
                    })
                } else {
                    res.status(200).json({
                        message: "user data successfully saved!",
                        data: newUserData
                    })
                }
            })

        }
    } catch (err) {
        res.status(404).json({
            message: err
        })
    }
}

// getting all users
const usersGet = async (req, res) => {

    const searchData = req.query.search || "";
    const genderName = req.query.gender || "";
    const statusName = req.query.status || "";
    const sortData = req.query.sort || "";
    const query = {
        firstName: { $regex: searchData, $options: "i" }
    }

    if (genderName !== "All") {
        query.gender = genderName;
    }
    if (statusName != "All") {
        query.status = statusName;
    }

    try {
        const usersData = await User.find(query).sort({ datecreated: sortData == "new" ? -1 : 1 });
        res.status(200).json(usersData);

    } catch (err) {
        res.status(200).json({
            message: err
        })
    }
}

// getting single user
const userGet = async (req, res) => {
    const { id } = req.params;
    try {
        const oneUserData = await User.findById(id)
        if (oneUserData) {
            res.status(200).json(oneUserData)
        } else {
            res.status(404).json({
                message: "user is not avaliable"
            })
        }

    } catch (err) {
        res.status(200).json({
            message: err
        })
    }
}

// updating single user
const userUpdate = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    const { firstName, lastName, email, mobile, gender, location, status, user_profile } = req.body;
    const file = req.file ? req.file.filename : user_profile;

    const dateupdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
    try {
        const updatedUser = await User.findByIdAndUpdate({ _id: id }, {
            firstName, lastName, email, mobile, gender, location, status, profile: file, dateupdated
        }, {
            new: true
        });
        await updatedUser.save();
        console.log(updatedUser);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(404).json({
            message: err
        })
    }

}


// deleting single user
const userDelete = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUserData = await User.findByIdAndDelete(id);
        res.status(200).json({
            meassage: "user successfully deleted!",
            deletedUserData
        })
    } catch (err) {
        res.status(404).send(err);
    }
}

// updating user status
const userStatusUpdate = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    try {
        const updateNewStatus = await User.findByIdAndUpdate(id, { status: data }, { new: true });
        await updateNewStatus.save();
        res.status(200).json({
            meassage: "user status successfully updated!",
            updateNewStatus
        })
    } catch (err) {
        res.status(404).send(err);
    }
}

// user export
const userExport = async (req, res) => {
    try {
        const userAllData = await User.find();
        const csvStream = csv.format({ headers: true });

        if (!fs.existsSync('public/files/export')) {
            if (!fs.existsSync('public/files')) {
                fs.mkdirSync('public/files');
            }
            if (!fs.existsSync('public/files/export')) {
                fs.mkdirSync('./public/files/export');
            }
        }

        const writableStream = fs.createWriteStream(
            "public/files/export/users.csv"
        )

        csvStream.pipe(writableStream);

        writableStream.on('finish', function () {
            res.json({
                downloadUrl: `${BASE_URL}/files/export/users.csv`
            })
        })

        if (userAllData.length > 0) {
            userAllData.map((user) => {
                csvStream.write({
                    FirstName: user.firstName ? user.firstName : "-",
                    LastName: user.lastName ? user.lastName : "-",
                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    Dateupdated: user.dateupdated ? user.dateupdated : "-"
                })
            })
        }

        csvStream.end();
        writableStream.end();

    } catch (err) {
        res.status(404).json(err);
    }

}
module.exports = { userPost, usersGet, userGet, userUpdate, userDelete, userStatusUpdate, userExport };