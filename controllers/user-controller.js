const bcrypt = require("bcryptjs");
const jDentIcon  = require("jdenticon");
const path  = require("path");
const fs  = require("fs");

const {User} = require("../models");
const jwt = require("jsonwebtoken");


const UserController = {
    register: async (req, res) => {
        const { email, password, name } = req.body

        if (!email || !password || !name) {

            return res.status(400).json({
                error: 'Wrong data'
            })
        }

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    error: 'User already exist!'
                })
            }
            const hashedPassword = await bcrypt.hash(password, 3)

            //generate avatar
            const png = jDentIcon.toPng(name, 200)
            const avatarName = `${name}_${Date.now()}.png`
            const avatarPath = path.join(__dirname, '/../uploads', avatarName);
            fs.writeFileSync(avatarPath, png)

            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                avatarUrl: `/uploads/${avatarName}`,
            })

            await newUser.save()

            res.json(newUser)

        } catch (e) {
            console.log('Error with register')
            res.status(500).json({ error: 'Error registration!' })
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body

        if (!email || !password){
           return  res.status(400).json({error: 'No correct data!'})
        }
         try {
            const user = await User.findOne({ email });

            if (!user) {
               return res.status(400).json({error: 'This user not found, check login or password!'})
            }

            const valid = await bcrypt.compare(password, user.password)

             if (!valid) {
                 return res.status(400).json({ error: 'Wrong login or password!' })
             }

             const token = jwt.sign({
                     id: user.id
                 }, 'user'
             )

             res.json({token})
         } catch (e) {
             console.log('Error with login')
             res.status(500).json({error: 'Error with login'})
         }
    },
    getUserById: async (req, res) => {
        const userId = req.user.id;

        try {
            const user = await User.findById(userId)

            if (!user){
                return res.status(404).json({ error: "Not found user" })
            }

            // res.json({
            //     "email": user.email,
            //     "name": user.name,
            //     "avatarUrl": user.avatarUrl,
            //     "posts": user.posts,
            //     "likes": user.likes,
            //     "comments": user.comments,
            //     "followers": user.followers,
            //     "following": user.following,
            // })
            res.json({user})

        } catch (e) {
            console.log('Error with getUserById')
            res.status(500).json({error: 'Server error'})
        }

        res.send(userId)
    },
    updateUser: async (req, res) => {
        const { id } = req.params
        const { email, name, dateOfBirth, bio, location } = req.body

        let filePath;

        if (req.file && req.file.path){
            filePath = req.file.path
        }

        if (!req.user.id === id){
            return res.status(403).json({ error: 'Not access' })
        }

        try {
            if (email) {
                const existUser = await User.findOne({ email })

                console.log('existUser', existUser)

                if (existUser && existUser.id === id) {
                   return res.status(400).json({ error: 'This email already exist!' })
                }

                const updatedUserData = {
                    name,
                    email,
                    dateOfBirth,
                    bio,
                    location,
                };

                // const updatedUser = await User.updateOne(existUser._id, updatedUserData);

                const result = await User.updateOne(
                    { _id: id }, // Фильтр
                    { $set: updatedUserData }, // Обновляемые данные
                    { new: true } // Возвращает обновленный документ (не применяется в updateOne)
                );

                if (result.nModified === 0) {
                    return res.status(404).json({ error: 'User not found or data is the same' });
                }

                console.log('result', result)
                // console.log('updatedUser', updatedUser)


                res.json({ message: 'User updated successfully' });

            }
            res.json({ error: 'Email is required!' });
        } catch (e) {
            console.log('Error with updateUser')
            res.status(500).json({ error: 'Error updateUser' })
        }

        res.send('updateUser')
    },
    current: async (req, res) => {
        res.send('current')
    },
}

module.exports = UserController