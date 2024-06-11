const bcrypt = require("bcryptjs");
const jDentIcon  = require("jdenticon");
const path  = require("path");
const fs  = require("fs");

const { User } = require("../models");
const jwt = require("jsonwebtoken");
const configureUserData = require("../helpers/configureUserData");

const UserControllers = {
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

            res.json({
                email: newUser.email,
                name: newUser.name,
                avatarUrl: newUser.avatarUrl,
                posts: newUser.posts,
                likes: newUser.likes,
                comments: newUser.comments,
                followers: newUser.followers,
                following: newUser.following,
            })

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
        const userId = req.params.id;
        const ownerUserId = req.user.id;

        if (!userId) {
            return res.status(400).json({ error: 'User id is required!' })
        }

        try {
            const user = await User.findById(userId)

            if (!user){
                return res.status(404).json({ error: "Not found user" })
            }

            const userData = configureUserData(user)

            res.json({
                ...userData,
                isFollowing: user.following.includes(ownerUserId)
            })

        } catch (e) {
            console.log('Error with getUserById')
            res.status(500).json({error: 'Server error'})
        }
    },
    updateUser: async (req, res) => {
        const { id } = req.params;
        const { email, name, dateOfBirth, bio, location } = req.body;

        let filePath;

        if (req.file && req.file.path) {
            filePath = req.file.path;
        }

        if (req.user.id !== id) {
            return res.status(403).json({ error: 'Нет доступа' });
        }

        try {
            if (email) {
                const existUser = await User.findOne({email});

                if (existUser && existUser._id.toString() !== id) {
                    return res.status(400).json({error: 'Этот email уже используется!'});
                }
            }

                const updatedUserData = {
                    name,
                    email,
                    dateOfBirth,
                    bio,
                    location,
                };

                if (filePath) {
                    updatedUserData.avatarUrl = filePath;
                }

                const updatedUser = await User.findOneAndUpdate(
                    { _id: id },
                    { $set: updatedUserData },
                    { new: true }
                );

                if (!updatedUser) {
                    return res.status(404).json({ error: 'Пользователь не найден или данные не изменены' });
                }
                const newUserAfterUpdate = configureUserData(updatedUser)

                return res.json({ message: 'Пользователь успешно обновлен', user: newUserAfterUpdate});
        } catch (e) {
            console.log('Ошибка при обновлении пользователя', e);
            return res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
        }
    },
    current: async (req, res) => {
        const userId = req.user.id

        if (!userId) {
            return res.status(401).json({ error: 'User not found!' })
        }

       try {
           const user = await User.findById(userId).populate('posts')
               .populate({
                   path: 'followers',
                   populate: {
                       path: 'followerId',
                       model: 'User'
                   }
               })

           if (!user) {
               return res.status(400).json({ error: 'User not found!' })
           }

           const newUser = configureUserData(user)

           res.json(newUser)
       } catch (e) {
           console.log(e)
           res.status(500).json({ error: "Error with get current user" })
       }
    },
}

module.exports = UserControllers
