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
        const userId = req.user.id;

        try {
            const user = await User.findById(userId)

            if (!user){
                return res.status(404).json({ error: "Not found user" })
            }

            res.json({
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                posts: user.posts,
                likes: user.likes,
                comments: user.comments,
                followers: user.followers,
                following: user.following,
            })

        } catch (e) {
            console.log('Error with getUserById')
            res.status(500).json({error: 'Server error'})
        }

        res.send(userId)
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

                const newUserAfterUpdate = {
                    id: updatedUser._id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    avatarUrl: updatedUser.avatarUrl,
                    posts: updatedUser.posts,
                    likes: updatedUser.likes,
                    comments: updatedUser.comments,
                    followers: updatedUser.followers,
                    following: updatedUser.following,
                    createdAt: updatedUser.createdAt,
                    updatedAt: updatedUser.updatedAt,
                    bio: updatedUser.bio,
                    dateOfBirth: updatedUser.dateOfBirth
                }

                return res.json({ message: 'Пользователь успешно обновлен', user: newUserAfterUpdate});
        } catch (e) {
            console.log('Ошибка при обновлении пользователя', e);
            return res.status(500).json({ error: 'Ошибка при обновлении пользователя' });
        }
    },
    current: async (req, res) => {
       try {
           const user = await User.findById(req.user.id)

           res.json(user)
       } catch (e) {
           console.log(e)
           res.json({ error: "Error with get current user" })
       }
    },
}

module.exports = UserController